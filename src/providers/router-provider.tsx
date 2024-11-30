import NotFoundPage from '@/app/_components/_errors/-not-found'
import { useAuth } from '@/common/hooks/use-auth'
import { routeTree } from '@/route-tree.gen'
import { RouterProvider as BrowserRouterProvider, createRouter } from '@tanstack/react-router'
import { queryClient } from './query-client-provider'

type CreateRouterOptions = FirstParameter<typeof createRouter>

// Set up a Router instance
const router = createRouter({
	routeTree,
	context: { queryClient, isAuthenticated: false },
	defaultPreload: 'intent',
	defaultNotFoundComponent: NotFoundPage,
	defaultPreloadStaleTime: 0
} as unknown as CreateRouterOptions)

// Register things for typesafety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export const RouterProvider: React.FC = () => {
	const { isAuthenticated } = useAuth()
	return <BrowserRouterProvider router={router} context={{ queryClient, isAuthenticated }} />
}
