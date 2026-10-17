import { i18n } from '@i18n/index'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Sentry from '@sentry/react'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'
import type { QueryKey } from '@tanstack/react-query'
import { matchQuery, MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { AxiosError, HttpStatusCode, isAxiosError } from 'axios'
import { compress, decompress } from 'lz-string'
import { toast } from 'sonner'

declare module '@tanstack/react-query' {
	interface Register {
		defaultError: AxiosError
		mutationMeta: {
			invalidates?: Array<QueryKey>
		}
	}
}

export const asyncStoragePersister = createAsyncStoragePersister({
	storage: AsyncStorage,
	serialize: (data) => compress(JSON.stringify(data)),
	deserialize: (data) => JSON.parse(decompress(data))
})

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
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
		onError: (error) => {
			if (isAxiosError(error) && (error.code === AxiosError.ETIMEDOUT || error.code === AxiosError.ECONNABORTED)) {
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
			toast.success(i18n.t('ns_common:notification.success'))
		},
		onError: (error) => {
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
