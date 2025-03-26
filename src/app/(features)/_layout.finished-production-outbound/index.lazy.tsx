import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../_contexts/-breadcrumb-context'
import ScannedEpcCounter from './_components/_epc-counter/-index'
import ScannedEpcList from './_components/_epc-data-list/-index'
import OrderSizeDetailTable from './_components/_manufacture-order-detail/-order-size-table'
import OutboundForm from './_components/_outbound-form/-index'
import ScanningFloatToolbar from './_components/_scanning-toolbar/-index'
import { PageProvider } from './_contexts/-page-context'

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
		<PageProvider>
			<Div className='grid max-h-screen grid-cols-12 items-stretch gap-4 overflow-hidden sm:grid-cols-1 md:grid-cols-1'>
				<Div className='h-full @container lg:col-span-full xl:col-span-full xxl:col-span-4'>
					<Div className='flex grid-rows-12 flex-col gap-4 @6xl:grid @6xl:grid-flow-col @6xl:grid-cols-2'>
						<Div className='order-first col-span-full row-span-3 @6xl:col-span-1 @6xl:row-span-5'>
							<ScannedEpcCounter />
						</Div>
						<Div className='col-span-full row-span-6 @6xl:order-last @6xl:col-span-1 @6xl:row-span-12'>
							<ScannedEpcList />
						</Div>
						<Div className='order-last col-span-full @6xl:order-2 @6xl:col-span-1 @6xl:row-span-7'>
							<OutboundForm />
						</Div>
					</Div>
				</Div>
				<Div className='hidden flex-col items-stretch gap-4 lg:col-span-full xl:col-span-full xxl:col-span-8 xxl:flex'>
					<OrderSizeDetailTable />
				</Div>
			</Div>
			<ScanningFloatToolbar />
		</PageProvider>
	)
}
