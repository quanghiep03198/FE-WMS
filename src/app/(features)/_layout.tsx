import Loading from '@/components/shared/loading'
import NetworkDetector from '@/components/shared/network-detector'
import { SidebarProvider } from '@/components/ui'
import { AuthQueryKeys } from '@features/auth/hooks/use-profile-request'
import { useEffectOnce } from '@hooks/use-effect-once'
import { Outlet, createFileRoute, redirect, useRouteContext } from '@tanstack/react-router'
import { useLocalStorageState } from 'ahooks'
import { Fragment } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import tw from 'tailwind-styled-components'
import { type RegisteredServiceWorker } from 'virtual:pwa-register/react'
import { ErrorBoundaryFallback } from '../../components/errors/error-boundary-fallback'
import UnsupportedScreen from '../../components/errors/unsupported-screen'
import AuthGuard from '../../components/guards/auth-guard'
import NavSidebar from './-components/partials/nav-sidebar'
import Navbar from './-components/partials/navbar'
import { BreadcrumbProvider } from './-contexts/breadcrumb-context'

export const Route = createFileRoute('/(features)/_layout')({
	component: Layout,
	pendingComponent: Loading,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (!isAuthenticated) throw redirect({ to: '/login' })
	},
	loader: async ({ context: { queryClient } }) => {
		return await queryClient.prefetchQuery({ queryKey: [AuthQueryKeys.PROFILE] })
	}
})

function Layout() {
	const { updateServiceWorker }: RegisteredServiceWorker = useRouteContext({
		from: '',
		select: (context) => context.serviceWorker
	})

	const [font] = useLocalStorageState<string>('font', {
		defaultValue: '*:!font-sans',
		listenStorageChange: true
	})

	useEffectOnce(() => {
		if (document.body.classList.contains(font)) document.body.classList.remove(font)
		document.body.classList.add(font)
	})

	return (
		<Fragment>
			<UnsupportedScreen />
			<AuthGuard>
				<SidebarProvider
					data-state-persistent-key='appSidebarOpen'
					suppressHydrationWarning={true}
					className='h-screen [&:has(#toggle-fullscreen[data-state=checked])_header]:z-0'>
					<NavSidebar />
					<LayoutWrapper>
						<BreadcrumbProvider>
							<Navbar />
							<OutletWrapper id='outlet-wrapper'>
								<ErrorBoundary
									fallbackRender={({ error, resetErrorBoundary }) => {
										return (
											<ErrorBoundaryFallback
												error={error as Error}
												resetError={(args) => {
													resetErrorBoundary(args)
													updateServiceWorker()
												}}
											/>
										)
									}}>
									<Outlet />
								</ErrorBoundary>
							</OutletWrapper>
						</BreadcrumbProvider>
					</LayoutWrapper>
				</SidebarProvider>
			</AuthGuard>
			<NetworkDetector />
		</Fragment>
	)
}

const LayoutWrapper: React.FC<React.ComponentProps<'div'>> = tw.div`
	relative h-full flex-1 overflow-y-scroll @container/layout-wrapper
	[counter-reset:h_var(--screen-height)_w_var(--screen-width)]
	[--scrollbar-thickness:10px] 
	[--outlet-padding:12px] 
	[--header-height:56px] 
	[--outlet-wrapper-height:calc(var(--screen-height,100dvh)*1px-var(--header-height)-2*var(--outlet-padding))]
	xxl:[--header-height:80px]
`

const OutletWrapper: React.FC<React.ComponentProps<'main'>> = tw.main`
	relative flex-1 basis-full py-[--outlet-padding] xxl:px-6 xxl:pt-0 xl:px-4 lg:px-4 md:px-2 sm:px-2
`
