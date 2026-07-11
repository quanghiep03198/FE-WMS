import { localStoragePersister, queryClient } from '@/integrations/tanstack-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

export const QueryClientProvider: React.FC<React.PropsWithChildren> = ({ children }) => (
	<PersistQueryClientProvider
		client={queryClient}
		persistOptions={{ persister: localStoragePersister, maxAge: 60 * 1000 * 15 }}>
		{children}
	</PersistQueryClientProvider>
)
