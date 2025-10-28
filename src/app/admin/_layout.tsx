import LayoutComposition from '@/app/admin/_layout.user-management/-components/-partials/layout-composition'
import Loading from '@/components/shared/loading'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Fragment } from 'react'

export const Route = createFileRoute('/admin/_layout')({
	component: page,
	pendingComponent: Loading
})

function page() {
	return (
		<Fragment>
			<LayoutComposition.Container>
				<LayoutComposition.Heading />
				<LayoutComposition.MainSection as='section'>
					<LayoutComposition.Navbar />
					<LayoutComposition.OutletWrapper>
						<Outlet />
					</LayoutComposition.OutletWrapper>
				</LayoutComposition.MainSection>
			</LayoutComposition.Container>
		</Fragment>
	)
}
