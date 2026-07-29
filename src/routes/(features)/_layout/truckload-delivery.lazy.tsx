import { UserRole } from '@common/constants/enums'
import HostCompatibleGuard from '@components/guards/host-compatible-guard'
import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@components/guards/role-base-access-control'
import { RoleGuard } from '@components/guards/role-guard'
import { PageAction, PageDescription, PageHeader, PageSeparator, PageTitle, PageWrapper } from '@components/shared/page'
import { Button, Icon } from '@components/ui'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import CreateTruckloadDialogButton from '@features/truckload-delivery/components/create-truckload-delivery-button'
import TruckloadDeliveryMasterTable from '@features/truckload-delivery/components/truckload-delivery-master-table'
import { PageContextProvider } from '@features/truckload-delivery/contexts/page-context'
import { STORED_DELIVERY_PAGE_QUERY_KEY } from '@features/truckload-delivery/hooks/use-page-query-params'
import { STORAGE_DELIVERY_FILTER_KEY } from '@features/truckload-delivery/hooks/use-store-filter-params'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, lazy, Suspense, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const DeleteConfirmDialog = lazy(() => import('@features/truckload-delivery/components/delete-confirm-dialog'))
const SignatureEditorDialog = lazy(() => import('@features/truckload-delivery/components/signature-editor-dialog'))
const UpdateDispatchOrderFormDialog = lazy(
	() => import('@features/truckload-delivery/components/update-dispatch-order-form-dialog')
)
const CreatePurchaseOrdersFormDialog = lazy(
	() => import('@features/truckload-delivery/components/create-purchase-orders-form-dialog')
)

export const Route = createLazyFileRoute('/(features)/_layout/truckload-delivery')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useLayoutEffect(() => {
		setBreadcrumb([{ to: '/truckload-delivery', text: t('ns_common:navigation.truckload_delivery_management') }])

		return () => {
			sessionStorage.removeItem(STORAGE_DELIVERY_FILTER_KEY)
			sessionStorage.removeItem(STORED_DELIVERY_PAGE_QUERY_KEY)
		}
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.truckload_delivery_management')}</title>
			<meta name='description' content={t('ns_inoutbound:description.truckload_delivery')} />

			<RoleGuard
				authorizedRoles={[
					UserRole.ADMIN,
					UserRole.MANAGER,
					UserRole.FG_WAREHOUSE_STAFF,
					UserRole.IE_STAFF,
					UserRole.SECURITY_GUARD,
					UserRole.INDUSTRIAL_ENGINEERING_STAFF
				]}>
				<HostCompatibleGuard>
					<PageContextProvider>
						<PageWrapper>
							<PageHeader>
								<PageTitle>{t('ns_common:navigation.truckload_delivery_management')}</PageTitle>
								<PageDescription>{t('ns_inoutbound:description.truckload_delivery')}</PageDescription>
								<PageAction>
									<RoleBaseAccessControl
										authorizedRoles={[UserRole.FG_WAREHOUSE_STAFF, UserRole.IE_STAFF]}
										mode='fallback'
										fallbackComponent={
											<Button
												type='button'
												onClick={() =>
													toast.warning(t('ns_common:errors.403_notification'), {
														id: ACTION_RESTRICTED_TOAST_ID
													})
												}>
												<Icon name='Lock' />
												{t('ns_common:actions.add')}
											</Button>
										}>
										<CreateTruckloadDialogButton />
									</RoleBaseAccessControl>
									{/* <DateRangeFilter /> */}
									{/* {!isMobile && <DownloadExcelButton />} */}
								</PageAction>
							</PageHeader>
							<PageSeparator />
							<Suspense fallback={null}>
								<CreatePurchaseOrdersFormDialog />
							</Suspense>
							<Suspense fallback={null}>
								<UpdateDispatchOrderFormDialog />
							</Suspense>
							<Suspense fallback={null}>
								<DeleteConfirmDialog />
							</Suspense>
							<Suspense fallback={null}>
								<SignatureEditorDialog />
							</Suspense>
							<TruckloadDeliveryMasterTable />
						</PageWrapper>
					</PageContextProvider>
				</HostCompatibleGuard>
			</RoleGuard>
		</Fragment>
	)
}
