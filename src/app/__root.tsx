import { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Fragment } from 'react'
import NotFoundPage from './_components/_errors/-not-found'
import Loading from '@/components/shared/loading'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient; isAuthenticated: boolean }>()({
	component: () => (
		<Fragment>
			<Outlet />
			<TanStackRouterDevtools position='bottom-right' initialIsOpen={false} />
		</Fragment>
	),
	wrapInSuspense: true,
	notFoundComponent: NotFoundPage,
	pendingComponent: () => <Loading className='h-screen' />
})
