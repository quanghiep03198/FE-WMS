import AuthProvider from '@/components/providers/auth-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/@shadcn/sonner';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import NotFoundPage from './_components/_errors/-not-found';

export const Route = createRootRoute({
	component: RootRouter,
	notFoundComponent: NotFoundPage
});

function RootRouter() {
	return (
		<>
			<AuthProvider>
				<ThemeProvider>
					<Outlet />
					<Toaster />
				</ThemeProvider>
			</AuthProvider>
			<TanStackRouterDevtools position='bottom-right' initialIsOpen={false} />
		</>
	);
}
