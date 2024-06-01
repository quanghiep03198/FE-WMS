import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nextProvider } from 'react-i18next';
import { i18n } from './i18n';
import '@tanstack/react-query';
import { AxiosError } from 'axios';

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



const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 60
		}
	}
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<I18nextProvider i18n={i18n}>
				<RouterProvider router={router} />
				<ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
			</I18nextProvider>
		</QueryClientProvider>
	);
}
