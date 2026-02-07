import HostCompatibleGuard from '@/app/-components/-guard/host-compatible-guard'
import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useLayoutEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import {
	PageAction,
	PageDescription,
	PageHeader,
	PageSeparator,
	PageTitle,
	PageWrapper
} from '../-components/shared/page-header'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import CreatePurchaseOrdersFormDialog from './-components/create-purchase-orders-form-dialog'
import DateRangeFilter from './-components/date-range-filter'
import DeleteConfirmDialog from './-components/delete-confirm-dialog'
import DownloadExcelButton from './-components/download-excel-button'
import SignatureEditorDialog from './-components/signature-editor-dialog'
import TruckloadDeliveryMasterTable from './-components/truckload-delivery-master-table'
import UpdateDispatchOrderFormDialog from './-components/update-dispatch-order-form-dialog'
import { PageContextProvider } from './-contexts/page-context'

export const Route = createLazyFileRoute('/(features)/_layout/truckload-delivery/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()
	const isMobile = useMediaQuery('(max-width: 1023px)')

	useLayoutEffect(() => {
		setBreadcrumb([{ to: '/truckload-delivery', text: t('ns_common:navigation.truckload_delivery_management') }])
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
					UserRole.SECURITY_GUARD
				]}>
				<HostCompatibleGuard>
					<PageContextProvider>
						<PageWrapper>
							<PageHeader>
								<PageTitle>{t('ns_common:navigation.truckload_delivery_management')}</PageTitle>
								<PageDescription>{t('ns_inoutbound:description.truckload_delivery')}</PageDescription>
								<PageAction>
									<DateRangeFilter />
									{!isMobile && <DownloadExcelButton />}
								</PageAction>
							</PageHeader>
							<PageSeparator />
							<CreatePurchaseOrdersFormDialog />
							<UpdateDispatchOrderFormDialog />
							<DeleteConfirmDialog />
							<SignatureEditorDialog />
							<ErrorBoundary
								fallbackRender={() => <div className='text-destructive'>Ooppps!!!! Something went wrong</div>}>
								<TruckloadDeliveryMasterTable />
							</ErrorBoundary>
						</PageWrapper>
					</PageContextProvider>
				</HostCompatibleGuard>
			</RoleGuard>
		</Fragment>
	)
}
