import UnavailableService from '@/app/_components/_errors/-unavailable-service'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../_contexts/-breadcrumb-context'

export const Route = createLazyFileRoute('/(features)/_layout/finished-production-outbound/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/finished-production-outbound', text: t('ns_common:navigation.fp_stock_out') }])
	}, [i18n.language])

	return (
		<UnavailableService />
		// <PageProvider>
		// 	<Div className='grid grid-cols-1 items-stretch gap-4 overflow-hidden @container xxl:grid-cols-[1fr_3fr]'>
		// 		<Div className='flex max-h-[inherit] flex-col justify-between gap-4 @[1366px]:grid-flow-col @[1366px]:grid-cols-2 @[1366px]:grid-rows-12 xl:max-h-[85vh]'>
		// 			<Div className='order-first @[1366px]:col-span-1 @[1366px]:row-span-4'>
		// 				<ScannedEpcCounter />
		// 			</Div>
		// 			<Div className='order-last @[1366px]:order-2 @[1366px]:col-span-1 @[1366px]:row-span-8'>
		// 				<OutboundForm />
		// 			</Div>
		// 			<Div className='@[1366px]:order-2 @[1366px]:col-span-full @[1366px]:row-span-full'>
		// 				<ScannedEpcList />
		// 			</Div>
		// 		</Div>

		// 		<OrderSizeDetailTable />
		// 	</Div>
		// 	<ScanningFloatToolbar />
		// </PageProvider>
	)
}
