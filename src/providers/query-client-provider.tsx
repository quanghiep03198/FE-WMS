import { AppConfigs } from '@/configs/app.config'
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type { AxiosError } from 'axios'
import { compress, decompress } from 'lz-string'

declare module '@tanstack/react-query' {
	interface Register {
		defaultError: AxiosError
	}
}

const localStoragePersister = createSyncStoragePersister({
	storage: window.localStorage,
	key: AppConfigs.QUERY_CLIENT_CACHE_STORAGE_KEY,
	serialize: (data) => compress(JSON.stringify(data)),
	deserialize: (data) => JSON.parse(decompress(data))
})

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 15,
			experimental_prefetchInRender: true,
			networkMode: 'always'
		},
		mutations: {
			networkMode: 'always'
		}
	}
})

broadcastQueryClient({
	queryClient: queryClient as unknown as Parameter<typeof broadcastQueryClient>['queryClient'],
	broadcastChannel: 'wms-client', // Optional: defaults to 'react-query'
	options: { webWorkerSupport: true, type: 'localstorage' }
})

export const QueryClientProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
	<PersistQueryClientProvider
		client={queryClient}
		persistOptions={{ persister: localStoragePersister, maxAge: 60 * 1000 * 15 }}>
		{children}
		<ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-right' />
	</PersistQueryClientProvider>
)
