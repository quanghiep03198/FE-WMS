import useQueryParams from '@/common/hooks/use-query-params'
import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { has } from 'lodash'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import { RFIDDataType } from '../_layout.(rfid)/-constants'
import DataSection from './-components/data-section'
import PageHeader from './-components/header'
import SearchForm from './-components/search-form'

export const Route = createLazyFileRoute('/(features)/_layout/inoutbound-progress-lookup/')({
	component: RouteComponent
})

function RouteComponent() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()
	const { searchParams } = useQueryParams<{ order: string; type: RFIDDataType }>()

	useEffect(() => {
		setBreadcrumb([{ to: '/inoutbound-progress-lookup', text: t('ns_common:navigation.inoutbound_progress_lookup') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.inoutbound_progress_lookup')}</title>
			<meta name='description' content='Search in/outbound progress by order' />

			<Div as='section' className='min-h-[var(--outlet-wrapper-height)] space-y-10'>
				<PageHeader />
				<SearchForm />
				{has(searchParams, 'order') && Object.values(RFIDDataType).includes(searchParams.type) && <DataSection />}
			</Div>
		</Fragment>
	)
}
