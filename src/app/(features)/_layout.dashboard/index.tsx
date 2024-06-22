import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { Div } from '@/components/ui'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import ImportExportOverview from './_components/-import-export-overview'
import Statistics from './_components/-statistics'
import TransactionHistory from './_components/-transaction-history'

export const Route = createFileRoute('/(features)/_layout/dashboard/')({
	component: Dashboard
})

function Dashboard() {
	const { t } = useTranslation()
	useBreadcrumb([{ to: '/dashboard', title: t('ns_common:navigation.wh_dashboard') }])

	return (
		<Fragment>
			<Helmet title='Warehouse Management' />
			<Div className='space-y-6'>
				<Statistics />
				<TransactionHistory />
				<ImportExportOverview />
			</Div>
		</Fragment>
	)
}
