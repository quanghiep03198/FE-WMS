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
			<Div className='grid max-h-screen grid-cols-12 place-items-stretch items-stretch gap-4 overflow-hidden sm:grid-cols-1 md:grid-cols-1'>
				<Div className='@container lg:col-span-full xl:col-span-full xxl:col-span-4'>
					<Div className='flex grid-rows-12 flex-col gap-4 @7xl:grid @7xl:grid-flow-col @7xl:grid-cols-2'>
						<Div className='order-first col-span-full row-span-3 @7xl:col-span-1 @7xl:row-span-4'>
							<ScannedEpcCounter />
						</Div>
						<Div className='col-span-full row-span-6 @7xl:order-last @7xl:col-span-full @7xl:row-span-12'>
							<ScannedEpcList />
						</Div>
						<Div className='order-last col-span-full @7xl:order-2 @7xl:col-span-1 @7xl:row-span-8'>
							<OutboundForm />
						</Div>
					</Div>
				</Div>
				<Div className='hidden lg:col-span-full xl:col-span-full xxl:col-span-8 xxl:block'>
					<OrderSizeDetailTable />
				</Div>
			</Div>
			<ScanningFloatToolbar />
		</PageProvider>
	)
}
