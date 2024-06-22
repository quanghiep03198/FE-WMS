import useAuth from '@/common/hooks/use-auth'
import { routeTree } from '@/route-tree.gen'
import { RouterProvider as TanstackRouterProvider, createRouter } from '@tanstack/react-router'
import Loading from '../shared/loading'
import { queryClient } from './query-client-provider'
import { AuthProvider } from './auth-provider'

// Set up a Router instance
const router = createRouter({
	routeTree,
	context: { queryClient, isAuthenticated: undefined },

	defaultPendingComponent: () => <Loading className='h-screen' />
})

// Register things for typesafety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

const RouterProvider: React.FC = () => {
	const { isAuthenticated } = useAuth()
	return <TanstackRouterProvider router={router} context={{ queryClient, isAuthenticated }} />
}

export default RouterProvider