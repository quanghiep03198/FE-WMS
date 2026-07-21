import { Div } from '@/components/ui'
import { UserRole } from '@common/constants/enums'
import HostCompatibleGuard from '@components/guards/host-compatible-guard'
import { RoleGuard } from '@components/guards/role-guard'
import ScannedEpcCounter from '@features/finished-goods/components/finished-goods-outbound/epc-counter'
import ScannedEpcList from '@features/finished-goods/components/finished-goods-outbound/epc-data-list'
import OrderSizeDetailTable from '@features/finished-goods/components/finished-goods-outbound/manufacture-order-detail/order-detail-table'
import OutboundForm from '@features/finished-goods/components/finished-goods-outbound/outbound-form'
import { PageProvider } from '@features/finished-goods/contexts/finished-goods-outbound/page-context'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../../../../contexts/breadcrumb-context'

export const Route = createLazyFileRoute('/(features)/_layout/(finished-goods)/finished-goods-outbound')({
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

			<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF]}>
				<HostCompatibleGuard>
					{/* Temporarily disable navigation blocker because of potential preventing update service worker  */}
					{/* <PageNavigationBlocker /> */}
					<PageProvider>
						<Div className='static gap-4 @7xl/layout-wrapper:grid @7xl/layout-wrapper:grid-cols-12 @7xl/layout-wrapper:p-0'>
							<Div className='h-full @container/playground @7xl/layout-wrapper:col-span-4'>
								<Div className='flex flex-col items-stretch gap-0 @4xl/playground:grid @4xl/playground:grid-flow-col @4xl/playground:auto-rows-auto @4xl/playground:grid-cols-2 @4xl/playground:gap-4 @7xl/layout-wrapper:gap-0'>
									<Div className='order-first col-span-full @4xl/playground:col-span-1 @[1400px]/playground:hidden'>
										<ScannedEpcCounter />
									</Div>
									<Div className='col-span-full mb-4 flex-1 @4xl/playground:order-last @4xl/playground:col-span-1 @4xl/playground:col-start-2 @4xl/playground:row-span-6 @4xl/playground:mb-0 @7xl/layout-wrapper:order-first @7xl/layout-wrapper:mb-6'>
										<Div className='hidden @[1400px]/playground:block'>
											<ScannedEpcCounter />
										</Div>
										<ScannedEpcList />
									</Div>
									<Div className='order-last col-span-full @4xl/playground:order-2 @4xl/playground:col-span-1'>
										<OutboundForm />
									</Div>
								</Div>
							</Div>
							<Div className='hidden @7xl/layout-wrapper:col-span-8 @7xl/layout-wrapper:block'>
								<OrderSizeDetailTable />
							</Div>
						</Div>
					</PageProvider>
				</HostCompatibleGuard>
			</RoleGuard>
		</Fragment>
	)
}
