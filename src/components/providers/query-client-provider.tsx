import env from '@/common/utils/env'
import { StorageService } from '@/services/storage.service'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { AxiosError } from 'axios'
import { compress, decompress } from 'lz-string'

declare module '@tanstack/react-query' {
	interface Register {
		defaultError: AxiosError
	}
}

const localStoragePersister = createSyncStoragePersister({
	storage: window.localStorage,
	serialize: (data) => compress(JSON.stringify(data)),
	deserialize: (data) => JSON.parse(decompress(data))
})

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 15,
			networkMode: 'online', //In this mode, Queries and Mutations will not fire unless you have network connection.
			enabled: !!StorageService.getAccessToken()
		},
		mutations: {
			networkMode: 'online'
		}
	}
})

export const QueryClientProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
	<PersistQueryClientProvider
		client={queryClient}
		persistOptions={{ persister: localStoragePersister, maxAge: env('VITE_DEFAULT_TTL', Infinity) }}>
		{children}
		<ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
	</PersistQueryClientProvider>
)
