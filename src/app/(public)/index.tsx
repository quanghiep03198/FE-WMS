import env from '@/common/utils/env'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import PageComposition from './-components/page-composition'
import { PageProvider } from './-contexts/page-context'

export const Route = createFileRoute('/(public)/')({
	component: Page
})

function Page() {
	const url = env('VITE_APP_DOMAIN')

	return (
		<Fragment>
			<title>Warehouse Management System</title>
			<meta name='description' content='Greenland Warehouse Management System' />
			<script type='application/ld+json'>
				{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: 'Greenland Warehouse Management System',
					url: url,
					logo: new URL('logo.svg', url)
				})}
			</script>
			<PageProvider>
				<PageComposition />
			</PageProvider>
		</Fragment>
	)
}
