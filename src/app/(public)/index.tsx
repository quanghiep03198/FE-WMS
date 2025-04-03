import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import GridBackground from '../_components/_shared/-grid-background'
import PageComposition from './_components/-page-composition'
import { PageProvider } from './_contexts/-page-context'

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
