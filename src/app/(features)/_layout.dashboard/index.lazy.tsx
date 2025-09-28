import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../-components/-shared/page-header'
import { AssemblyProductivityOverview } from './-components/assembly-production-volumn-overview'
import InoutboundOverview from './-components/inoutbound-overview'
import { NetFlowOverview } from './-components/net-flow-overview'
import RFIDDeviceList from './-components/rfid-device-list'
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
				<Div className='grid grid-cols-12 gap-4'>
					<Div className='col-span-12 @[1280px]:order-first'>
						<Statistics />
					</Div>
					<Div className='col-span-full xxl:col-span-7'>
						<InoutboundOverview />
					</Div>
					<Div className='col-span-full xxl:col-span-5'>
						<NetFlowOverview />
					</Div>
					<Div className='col-span-12'>
						<AssemblyProductivityOverview />
					</Div>
					<Div className='order-last col-span-12 @[1280px]:col-span-full'>
						<RFIDDeviceList />
					</Div>
				</Div>
			</Div>
		</Fragment>
	)
}
