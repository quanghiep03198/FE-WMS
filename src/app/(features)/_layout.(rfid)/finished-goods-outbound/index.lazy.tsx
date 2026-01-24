import HostCompatibleGuard from '@/app/-components/-guard/host-compatible-guard'
import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../../-contexts/breadcrumb-context'
import ScannedEpcCounter from './-components/epc-counter'
import ScannedEpcList from './-components/epc-data-list'
import OrderSizeDetailTable from './-components/manufacture-order-detail/order-detail-table'
import OutboundForm from './-components/outbound-form'
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
				<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_OFFICER]}>
					<PageProvider>
						<Div className='static gap-4 xxl:grid xxl:grid-cols-12'>
							<Div className='h-full @container xxl:col-span-4'>
								<Div className='flex flex-col items-stretch gap-6 @4xl:grid @4xl:grid-flow-col @4xl:auto-rows-auto @4xl:grid-cols-2 xxl:gap-4'>
									<Div className='order-first col-span-full @4xl:col-span-1 xxl:hidden'>
										<ScannedEpcCounter />
									</Div>
									<Div className='col-span-full flex-1 @4xl:sticky @4xl:top-[var(--header-height)] @4xl:order-last @4xl:col-span-1 @4xl:col-start-2 @4xl:row-span-6 xxl:order-first'>
										<Div className='hidden xxl:block'>
											<ScannedEpcCounter />
										</Div>
										<ScannedEpcList />
									</Div>
									<Div className='order-last col-span-full @4xl:order-2 @4xl:col-span-1'>
										<OutboundForm />
									</Div>
								</Div>
							</Div>
							<Div className='hidden xxl:col-span-8 xxl:block'>
								<OrderSizeDetailTable />
							</Div>
						</Div>
					</PageProvider>
				</RoleGuard>
			</HostCompatibleGuard>
		</Fragment>
	)
}
