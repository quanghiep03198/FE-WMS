import { asyncStoragePersister, queryClient } from '@integrations/tanstack-query'
import { type Persister, PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

export const QueryClientProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
	<PersistQueryClientProvider
		client={queryClient}
		persistOptions={{
			persister: asyncStoragePersister as Persister,
			maxAge: 1000 * 60 * 60 * 24,
			buster: 'v1',
			dehydrateOptions: {
				shouldDehydrateQuery: (q) => q.state.status === 'success' && q.meta?.persist === true
			}
		}}>
		{children}
	</PersistQueryClientProvider>
)
