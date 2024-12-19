import { Div } from '@/components/ui'
import { QueryClient, QueryErrorResetBoundary } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient; isAuthenticated: boolean }>()({
	component: () => (
		<QueryErrorResetBoundary>
			<Div style={{ viewTransitionName: 'app' }}>
				<Outlet />
			</Div>
		</QueryErrorResetBoundary>
	)
})
