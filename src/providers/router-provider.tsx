import NotFoundPage from '@/app/_components/_errors/-not-found'
import { useAuth } from '@/common/hooks/use-auth'
import { routeTree } from '@/route-tree.gen'
import { RouterProvider as BrowserRouter, createRouter } from '@tanstack/react-router'
import Loading from '../components/shared/loading'
import { queryClient } from './query-client-provider'

// @ts-ignore
// Set up a Router instance
const router = createRouter({
	routeTree,
	context: { queryClient, isAuthenticated: undefined },
	defaultPreload: 'intent',
	defaultPendingComponent: Loading,
	defaultNotFoundComponent: NotFoundPage,
	defaultPreloadStaleTime: 0
})

// Register things for typesafety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export const RouterProvider: React.FC = () => {
	const { isAuthenticated } = useAuth()
	return <BrowserRouter router={router} context={{ queryClient, isAuthenticated }} />
}
