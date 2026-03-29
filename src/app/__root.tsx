import type { QueryClient } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { useRegisterSW } from 'virtual:pwa-register/react'

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
	isAuthenticated: boolean
	serviceWorker: ReturnType<typeof useRegisterSW>
}>()({
	component: Outlet
})
