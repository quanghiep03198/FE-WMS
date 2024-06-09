import { Div } from '@/components/ui'
import { createFileRoute, createLazyFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet'
import ImportExportOverview from './_components/-import-export-overview'
import Statistics from './_components/-statistics'
import TransactionHistory from './_components/-transaction-history'

export const Route = createFileRoute('/(features)/_layout/dashboard/')({
	component: Dashboard
})

function Dashboard() {
	return (
		<>
			<Helmet title='Warehouse Management' />
			<Div className='space-y-6'>
				<Statistics />
				<TransactionHistory />
				<ImportExportOverview />
			</Div>
		</>
	)
}
