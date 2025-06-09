import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../_components/_shared/-page-header'
import { useBreadcrumbContext } from '../_contexts/-breadcrumb-context'
import FilterBox from './_components/-filter-box'

export const Route = createLazyFileRoute('/(features)/_layout/production-inventory/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/production-inventory', text: t('ns_common:navigation.production_inventory') }])
	}, [i18n.language])

	return (
		<Div className='space-y-6'>
			<Div className='flex justify-between'>
				<PageHeader>
					<PageTitle>{t('ns_common:navigation.production_inventory')}</PageTitle>
					<PageDescription>{t('ns_inoutbound:description.production_inventory')}</PageDescription>
				</PageHeader>
				<Div className='xl:basis-1/3'>
					<FilterBox />
				</Div>
			</Div>
			<Separator />
		</Div>
	)
}
