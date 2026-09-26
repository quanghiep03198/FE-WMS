import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Sentry from '@sentry/react'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'
import type { QueryKey } from '@tanstack/react-query'
import { matchQuery, MutationCache, QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { compress, decompress } from 'lz-string'

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
			networkMode: 'always'
		},
		mutations: {
			networkMode: 'always'
		}
	},
	mutationCache: new MutationCache({
		onSuccess: (_data, _variables, _context, mutation) => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					// invalidate all matching tags at once
					// or everything if no meta is provided
					mutation.meta?.invalidates?.some((queryKey) => matchQuery({ queryKey }, query)) ?? true
			})
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
