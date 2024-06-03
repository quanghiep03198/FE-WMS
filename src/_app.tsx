import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { I18nextProvider } from 'react-i18next';
import { i18n } from './i18n';
import { routeTree } from './route-tree.gen';
import { compress, decompress } from 'lz-string';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

declare module '@tanstack/react-query' {
	interface Register {
		defaultError: AxiosError;
	}
}

// Register things for typesafety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: 'intent'
});

const localStoragePersister = createSyncStoragePersister({
	storage: window.localStorage,
	serialize: (data) => compress(JSON.stringify(data)),
	deserialize: (data) => JSON.parse(decompress(data))
});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 60,
			refetchOnWindowFocus: false,
			refetchOnMount: false
		}
	}
});

export default function App() {
	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister: localStoragePersister, maxAge: Infinity }}>
			<I18nextProvider i18n={i18n}>
				<RouterProvider router={router} />
				<ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
			</I18nextProvider>
		</PersistQueryClientProvider>
	);
}
