import HostCompatibleGuard from '@/app/-components/-guard/host-compatible-guard'
import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@/app/-components/-guard/role-base-access-control'
import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import { Button, Icon } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
	PageAction,
	PageDescription,
	PageHeader,
	PageSeparator,
	PageTitle,
	PageWrapper
} from '../-components/shared/page'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import CreatePurchaseOrdersFormDialog from './-components/create-purchase-orders-form-dialog'
import CreateTruckloadDialogButton from './-components/create-truckload-delivery-button'
import DeleteConfirmDialog from './-components/delete-confirm-dialog'
import SignatureEditorDialog from './-components/signature-editor-dialog'
import TruckloadDeliveryMasterTable from './-components/truckload-delivery-master-table'
import UpdateDispatchOrderFormDialog from './-components/update-dispatch-order-form-dialog'
import { PageContextProvider } from './-contexts/page-context'
import { STORAGE_DELIVERY_FILTER_KEY } from './-hooks/use-store-filter-params'

export const Route = createLazyFileRoute('/(features)/_layout/truckload-delivery/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useLayoutEffect(() => {
		setBreadcrumb([{ to: '/truckload-delivery', text: t('ns_common:navigation.truckload_delivery_management') }])

		return () => {
			sessionStorage.removeItem(STORAGE_DELIVERY_FILTER_KEY)
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
							<CreatePurchaseOrdersFormDialog />
							<UpdateDispatchOrderFormDialog />
							<DeleteConfirmDialog />
							<SignatureEditorDialog />
							<TruckloadDeliveryMasterTable />
						</PageWrapper>
					</PageContextProvider>
				</HostCompatibleGuard>
			</RoleGuard>
		</Fragment>
	)
}
