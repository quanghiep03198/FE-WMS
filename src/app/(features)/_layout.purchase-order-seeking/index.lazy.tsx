import useQueryParams from '@/common/hooks/use-query-params'
import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import DataTable from './-components/data-table'
import PageHeader from './-components/header'
import SearchForm from './-components/search-form'

export const Route = createLazyFileRoute('/(features)/_layout/purchase-order-seeking/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()
	const { searchParams } = useQueryParams<{ po: string }>()

	useEffect(() => {
		setBreadcrumb([{ to: '/inoutbound-history', text: t('ns_common:navigation.inoutbound_history') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.inoutbound_history')}</title>
			<meta name='description' content='Search in/outbound progress by order' />

			<Div as='section' className='min-h-[var(--outlet-wrapper-height)] place-content-center space-y-6'>
				<PageHeader />
				<SearchForm />
				{searchParams.po && <DataTable />}
			</Div>
		</Fragment>
	)
}
