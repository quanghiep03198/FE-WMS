import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Fragment } from 'react'
import type { useRegisterSW } from 'virtual:pwa-register/react'

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
	isAuthenticated: boolean
	serviceWorker: ReturnType<typeof useRegisterSW>
}>()({
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
