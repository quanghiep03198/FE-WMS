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

			<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF]}>
				<HostCompatibleGuard>
					{/* Temporarily disable navigation blocker because of potential preventing update service worker  */}
					{/* <PageNavigationBlocker /> */}
					<PageProvider>
						<Div className='static gap-4 py-[--outlet-padding] @[1500px]:grid @[1500px]:grid-cols-12 @[1500px]:p-0'>
							<Div className='h-full @container/playground @[1500px]:col-span-4'>
								<Div className='flex flex-col items-stretch gap-4 @4xl/playground:grid @4xl/playground:grid-flow-col @4xl/playground:auto-rows-auto @4xl/playground:grid-cols-2 @[1500px]/layout-wrapper:gap-0 @[1500px]/playground:gap-6'>
									<Div className='order-first col-span-full @4xl/playground:col-span-1 @[1500px]/layout-wrapper:mb-0 @[1500px]:hidden'>
										<ScannedEpcCounter />
									</Div>
									<Div className='col-span-full flex-1 @4xl/playground:sticky @4xl/playground:top-[var(--header-height)] @4xl/playground:order-last @4xl/playground:col-span-1 @4xl/playground:col-start-2 @4xl/playground:row-span-6 @[1500px]/layout-wrapper:mb-6 @[1500px]:order-first'>
										<Div className='hidden @[1500px]:block'>
											<ScannedEpcCounter />
										</Div>
										<ScannedEpcList />
									</Div>
									<Div className='order-last col-span-full @4xl/playground:order-2 @4xl/playground:col-span-1'>
										<OutboundForm />
									</Div>
								</Div>
							</Div>
							<Div className='hidden @[1500px]:col-span-8 @[1500px]:block'>
								<OrderSizeDetailTable />
							</Div>
						</Div>
					</PageProvider>
				</HostCompatibleGuard>
			</RoleGuard>
		</Fragment>
	)
}
