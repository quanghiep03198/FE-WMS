import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Fragment } from 'react'

type RootRouteContext = {
	queryClient: QueryClient
	isAuthenticated: boolean
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
	component: () => (
		<Fragment>
			<Outlet />
			<TanStackDevtools
				config={{
					position: 'bottom-right'
				}}
				plugins={[
					{
						name: 'Tanstack Router',
						render: <TanStackRouterDevtoolsPanel />
					},
					{
						name: 'Tanstack Query',
						render: <ReactQueryDevtoolsPanel />
					}
				]}
			/>
		</Fragment>
	)
})
