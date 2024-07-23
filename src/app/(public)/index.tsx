import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import GridBackground from './_components/-grid-background'
import PageComposition from './_components/-page-composition'
import { PageProvider } from './_contexts/-page-context'

export const Route = createFileRoute('/(public)/')({
	component: Page
})

export default function Page() {
	return (
		<Fragment>
			<Helmet
				title='GL Warehouse Management System'
				meta={[{ name: 'description', content: 'Greenland Warehouse Management System' }]}
			/>
			<PageProvider>
				<PageComposition />
			</PageProvider>
			<GridBackground />
		</Fragment>
	)
}
