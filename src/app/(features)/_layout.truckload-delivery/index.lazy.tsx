import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../-components/-shared/page-header'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import CreatePurchaseOrdersFormDialog from './-components/create-purchase-orders-form-dialog'
import CreateTruckloadDialogButton from './-components/create-truckload-delivery-button'
import DeleteConfirmDialog from './-components/delete-confirm-dialog'
import TruckloadDeliveryFormDialog from './-components/truckload-delivery-form-dialog'
import TruckloadDeliveryTableV2 from './-components/truckload-delivery-table-v2'
import { PageContextProvider } from './-contexts/page-context'

export const Route = createLazyFileRoute('/(features)/_layout/truckload-delivery/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

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
						<Div className='inline-flex items-center gap-x-1'>
							<DeleteConfirmDialog />
							<CreateTruckloadDialogButton />
						</Div>
					</Div>
					<Separator />
					<CreatePurchaseOrdersFormDialog />
					<TruckloadDeliveryFormDialog />
					<TruckloadDeliveryTableV2 />
				</Div>
			</PageContextProvider>
		</Fragment>
	)
}
