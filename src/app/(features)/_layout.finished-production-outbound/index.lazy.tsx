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
			<Div className='flex items-stretch gap-3 first:basis-full first:xl:basis-[320]'>
				<Div className='flex min-w-[30rem] basis-[30rem] flex-col space-y-3'>
					<Div className='basis-[10rem]'>
						<ScannedEpcCounter />
					</Div>
					<Div className='h-full flex-1 rounded-md border'>
						<ScannedEpcList />
					</Div>
					<Div className='basis-auto'>
						<OutboundForm />
					</Div>
				</Div>
				<OrderSizeDetailTable />
				<ScanningFloatToolbar />
			</Div>
		</PageProvider>
	)
}
