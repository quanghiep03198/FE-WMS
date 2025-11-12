import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../-components/-shared/page-header'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import CreateTruckloadDialogButton from './-components/create-truckload-delivery-button'
import TruckloadDeliveryFormDialog from './-components/truckload-delivery-form-dialog'
import TruckloadDeliveryMasterTable from './-components/truckload-delivery-master-table'
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
						<PageHeader>
							<PageTitle>{t('ns_common:navigation.truckload_delivery_management')}</PageTitle>
							<PageDescription>{t('ns_inoutbound:description.truckload_delivery')}</PageDescription>
						</PageHeader>
						<CreateTruckloadDialogButton />
					</Div>
					<Separator />

					<TruckloadDeliveryFormDialog />
					<TruckloadDeliveryMasterTable />
				</Div>
			</PageContextProvider>
		</Fragment>
	)
}
