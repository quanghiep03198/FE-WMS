import { i18n } from '@i18n/index'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Sentry from '@sentry/react'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'
import type { QueryKey } from '@tanstack/react-query'
import { matchQuery, MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { AxiosError, HttpStatusCode, isAxiosError } from 'axios'
import { del, get, set } from 'idb-keyval'
import { toast } from 'sonner'
declare module '@tanstack/react-query' {
	interface Register {
		defaultError: AxiosError
		mutationMeta: {
			invalidates?: Array<QueryKey>
			suppressNotifications?: boolean
		}
	}
}

export const asyncStoragePersister = createAsyncStoragePersister({
	storage: {
		getItem: (k) => get(k),
		setItem: (k, v) => set(k, v),
		removeItem: (k) => del(k)
	},
	throttleTime: 10_000
})

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 5,
			staleTime: 1000 * 60 * 5,
			networkMode: 'always',
			refetchOnWindowFocus: false,
			refetchOnMount: false
		},
		mutations: {
			networkMode: 'always'
		}
	},
	queryCache: new QueryCache({
		onError: (error, query) => {
			if (
				query.meta?.suppressErrorToast !== true &&
				isAxiosError(error) &&
				(error.code === AxiosError.ETIMEDOUT || error.code === AxiosError.ECONNABORTED)
			) {
				toast.error(i18n.t('ns_common:errors.request_timeout'))
			}
		}
	}),
	mutationCache: new MutationCache({
		onSuccess: async (_data, _variables, _context, mutation) => {
			// * invalidate all matching tags at once
			await queryClient.invalidateQueries({
				predicate: (query) =>
					mutation.meta?.invalidates?.some((queryKey) => matchQuery({ queryKey }, query)) ?? false
			})
			if (!mutation.meta?.suppressNotifications) toast.success(i18n.t('ns_common:notification.success'))
		},
		onError: (error, _variables, _context, mutation) => {
			if (mutation.meta?.suppressNotifications) return
			if (isAxiosError(error) && error.response?.status !== HttpStatusCode.InternalServerError) {
				const response = error.response as AxiosResponse<ResponseBody<any>>
				toast.error(response.data.message)
			} else toast.error(i18n.t('ns_common:notification.unknown_error'))
		}
	})
})

broadcastQueryClient({
	queryClient: queryClient as unknown as Parameter<typeof broadcastQueryClient>['queryClient'],
	broadcastChannel: 'wms-client', // Optional: defaults to 'react-query'
	options: { webWorkerSupport: true, type: 'localstorage' },
	onBroadcastError: (error, event) => {
		Sentry.captureException(error, {
			tags: { broadcastEvent: event.type },
			extra: { queryHash: event.queryHash, queryKey: event.queryKey }
		})
	}
})
