import env from '@/common/utils/env'
import { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Fragment } from 'react'
import NotFoundPage from './_components/_errors/-not-found'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient; isAuthenticated: boolean }>()({
	component: RootRoute,
	notFoundComponent: NotFoundPage
})

function RootRoute() {
	return (
		<Fragment>
			<Outlet />
			{env('VITE_NODE_ENV') === 'development' && (
				<TanStackRouterDevtools
					position='bottom-left'
					toggleButtonProps={{ style: { left: 80, bottom: 20 } }}
					initialIsOpen={false}
				/>
			)}
		</Fragment>
	)
}
