import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../_components/_shared/-page-header'
import { useBreadcrumbContext } from '../_contexts/-breadcrumb-context'
import EmptyState from './_components/-empty-state'

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
		<Div className='mt-6 flex h-full flex-col space-y-6'>
			<PageHeader>
				<PageTitle>{t('ns_common:navigation.production_inventory')}</PageTitle>
				<PageDescription>{t('ns_inoutbound:description.production_inventory')}</PageDescription>
			</PageHeader>

			<Separator />
			<Div className='flex-1'>
				<EmptyState />
			</Div>
		</Div>
	)
}
