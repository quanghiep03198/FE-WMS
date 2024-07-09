import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import ErrorBoundary from '../_components/_errors/-error-boundary'
import AuthGuard from '../_components/_guard/-auth-guard'
import LayoutComposition from './_components/_partials/-layout-composition'
import NavSidebar from './_components/_partials/-nav-sidebar'
import Navbar from './_components/_partials/-navbar'

export const Route = createFileRoute('/(features)/_layout')({
	component: Layout,
	beforeLoad: ({ context: { isAuthenticated } }) => {
		if (!isAuthenticated) throw redirect({ to: '/login' })
	}
})

function Layout() {
	return (
		<AuthGuard>
			<LayoutComposition.Container role='region'>
				<NavSidebar />
				<LayoutComposition.Main as='main' role='main'>
					<Navbar />
					<LayoutComposition.OutletWrapper>
						<ErrorBoundary>
							<Outlet />
						</ErrorBoundary>
					</LayoutComposition.OutletWrapper>
				</LayoutComposition.Main>
			</LayoutComposition.Container>
		</AuthGuard>
	)
}
