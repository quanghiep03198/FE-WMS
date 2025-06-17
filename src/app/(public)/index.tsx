import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import GridBackground from '../-components/-shared/grid-background'
import PageComposition from './-components/page-composition'
import { PageProvider } from './-contexts/page-context'

export const Route = createFileRoute('/(public)/')({
	component: Page,
	staticData: {}
})

export default function Page() {
	return (
		<Fragment>
			<title>Warehouse Management System</title>
			<meta name='description' content='Greenland Warehouse Management System' />
			<PageProvider>
				<PageComposition />
			</PageProvider>
			<GridBackground />
		</Fragment>
	)
}
