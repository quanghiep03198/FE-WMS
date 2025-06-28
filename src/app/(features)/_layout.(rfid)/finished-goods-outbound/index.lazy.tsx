import HostCompatibleGuard from '@/app/-components/-guard/host-compatible-guard'
import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../../-contexts/breadcrumb-context'
import ScannedEpcCounter from './-components/-epc-counter'
import ScannedEpcList from './-components/-epc-data-list'
import OrderSizeDetailTable from './-components/-manufacture-order-detail/order-detail-table'
import OutboundForm from './-components/-outbound-form'
import { PageProvider } from './-contexts/page-context'

export const Route = createLazyFileRoute('/(features)/_layout/(rfid)/finished-goods-outbound/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/finished-goods-outbound', text: t('ns_common:navigation.finished_goods_outbound') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.finished_goods_outbound')}</title>
			<meta name='description' content='RFID Scanner integration for outbound process' />

			<HostCompatibleGuard>
				{/* Temporarily disable navigation blocker because of potential preventing update service worker  */}
				{/* <PageNavigationBlocker /> */}
				<PageProvider>
					<Div className='static gap-4 xxl:grid xxl:grid-cols-12'>
						<Div className='h-full @container xxl:col-span-4'>
							<Div className='flex flex-col items-stretch gap-6 @6xl:grid @6xl:grid-flow-col @6xl:auto-rows-auto @6xl:grid-cols-2 @6xl:grid-rows-3 xxl:gap-4'>
								<Div className='order-first col-span-full @6xl:col-span-1 @6xl:row-span-1'>
									<ScannedEpcCounter />
								</Div>
								<Div className='col-span-full flex-1 @6xl:sticky @6xl:top-[var(--header-height)] @6xl:order-last @6xl:col-span-1 @6xl:row-span-3'>
									<ScannedEpcList />
								</Div>
								<Div className='order-last col-span-full @6xl:order-2 @6xl:col-span-1 @6xl:row-span-2'>
									<OutboundForm />
								</Div>
							</Div>
						</Div>
						<Div className='hidden xxl:col-span-8 xxl:block'>
							<OrderSizeDetailTable />
						</Div>
					</Div>
				</PageProvider>
			</HostCompatibleGuard>
		</Fragment>
	)
}
