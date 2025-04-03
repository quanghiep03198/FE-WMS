import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MonthPickerFilter } from '../_components/_shared/-month-picker-filter'
import { PageDescription, PageHeader, PageTitle } from '../_components/_shared/-page-header'
import InoutboundOverview from './_components/-inoutbound-overview'
import RFIDDeviceList from './_components/-rfid-device-list'
import Statistics from './_components/-statistics'
import SystemTime from './_components/-system-time'

export const Route = createFileRoute('/(features)/_layout/dashboard/')({
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
			<head>
				<title>{t('ns_common:navigation.dashboard')}</title>
				<meta name='description' content={t('ns_dashboard:dashboard_description')} />
			</head>
			<Div className='z-10 flex flex-col gap-y-6 @container'>
				<Div className='flex items-center justify-between gap-4'>
					<PageHeader className='basis-1/2'>
						<PageTitle>Dashboard</PageTitle>
						<PageDescription>{t('ns_dashboard:dashboard_description')}</PageDescription>
					</PageHeader>
					<MonthPickerFilter />
				</Div>
				<Separator />
				<Div className='grid grid-cols-12 gap-4'>
					<Div className='order-2 col-span-12 @[1280px]:order-first @[1280px]:col-span-9'>
						<Statistics />
					</Div>
					<Div className='order-first col-span-12 @[1280px]:order-2 @[1280px]:col-span-3'>
						<SystemTime />
					</Div>
					<Div className='order-3 col-span-full @[1280px]:col-span-8'>
						<InoutboundOverview />
					</Div>
					<Div className='order-last col-span-12 @[1280px]:col-span-4'>
						<RFIDDeviceList />
					</Div>
				</Div>
			</Div>
		</Fragment>
	)
}
