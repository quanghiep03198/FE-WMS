import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import ProductionImportHeading from './_components/-warehouse-import-heading'
import ProductionImportList from './_components/-warehouse-import-list'

export const Route = createLazyFileRoute('/(features)/_layout/warehouse-import/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/warehouse-import', text: t('ns_common:navigation.import_management') }])
	}, [i18n.language])

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.import_management')} />

			<Div className='space-y-6'>
				<ProductionImportHeading />
				<Separator />
				<ProductionImportList />
			</Div>
		</Fragment>
	)
}
