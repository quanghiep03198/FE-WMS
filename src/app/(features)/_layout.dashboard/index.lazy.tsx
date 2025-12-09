import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../-components/shared/page-header'
import { AssemblyProductivityOverview } from './-components/assembly-production-volumn-overview'
import DefectiveGoodsInventoryOverview from './-components/defective-goods-inventory-composition'
import InoutboundOverview from './-components/inoutbound-overview'
import { NetFlowOverview } from './-components/net-flow-overview'
import Statistics from './-components/statistics'

export const Route = createLazyFileRoute('/(features)/_layout/dashboard/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/dashboard', text: t('ns_common:navigation.dashboard') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.dashboard')}</title>
			<meta name='description' content={t('ns_dashboard:dashboard_description')} />

			<Div className='z-10 mt-4 flex flex-col gap-y-6 @container'>
				<PageHeader className='basis-1/2 xl:basis-full'>
					<PageTitle>Dashboard</PageTitle>
					<PageDescription>{t('ns_dashboard:dashboard_description')}</PageDescription>
				</PageHeader>
				<Separator />
				<Div className='grid grid-cols-12 gap-4 [&_div[data-slot=card-title]]:!capitalize'>
					<Div className='col-span-full @container/statistics'>
						<Statistics />
					</Div>
					<Div className='col-span-full @[1366px]:col-span-7'>
						<InoutboundOverview />
					</Div>
					<Div className='col-span-full @[960px]:col-span-7 @[1366px]:col-span-5'>
						<NetFlowOverview />
					</Div>
					<Div className='col-span-full @[960px]:col-span-5 @[1366px]:col-span-4'>
						<DefectiveGoodsInventoryOverview />
					</Div>
					<Div className='col-span-full @[1366px]:col-span-8'>
						<AssemblyProductivityOverview />
					</Div>
				</Div>
			</Div>
		</Fragment>
	)
}
