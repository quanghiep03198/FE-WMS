import useMediaQuery from '@/common/hooks/use-media-query'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../-components/-shared/page-header'
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

			<PageContextProvider>
				<Div as='section' className='mt-4 space-y-6'>
					<Div className='flex items-start justify-between'>
						<PageHeader className='md:basis-3/5'>
							<PageTitle>{t('ns_common:navigation.truckload_delivery_management')}</PageTitle>
							<PageDescription>{t('ns_inoutbound:description.truckload_delivery')}</PageDescription>
						</PageHeader>
						<Div className='flex items-center gap-x-2'>
							<DateRangeFilter />
							{!isMobile && <DownloadExcelButton />}
						</Div>
					</Div>
					<Separator />
					<CreatePurchaseOrdersFormDialog />
					<UpdateDispatchOrderFormDialog />
					<DeleteConfirmDialog />
					<SignatureEditorDialog />
					<TruckloadDeliveryMasterTable />
				</Div>
			</PageContextProvider>
		</Fragment>
	)
}
