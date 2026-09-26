import { asyncStoragePersister, queryClient } from '@integrations/tanstack-query'
import { type Persister, PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

export const QueryClientProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
	<PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister as Persister }}>
		{children}
	</PersistQueryClientProvider>
)
