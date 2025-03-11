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
			<Div className=''>
				<Div className='grid grid-cols-1 gap-4 xxl:grid-cols-[1fr_3fr]'>
					<Div className='grid h-full min-w-[30rem] basis-[30rem] grid-flow-col grid-rows-12 flex-col gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-1'>
						<Div className='order-first col-span-1 row-span-4 md:row-span-3 xxl:col-span-full xxl:row-span-3'>
							<ScannedEpcCounter />
						</Div>
						<Div className='col-span-1 row-span-8 md:order-last md:row-span-6 xxl:order-last xxl:row-span-6'>
							<OutboundForm />
						</Div>
						<Div className='col-span-1 row-span-12 md:row-span-3 xxl:order-2 xxl:row-span-3'>
							<ScannedEpcList />
						</Div>
					</Div>
					<Div className='max-h-full'>
						<OrderSizeDetailTable />
					</Div>
				</Div>
			</Div>
			<ScanningFloatToolbar />
		</PageProvider>
	)
}
