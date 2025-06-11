import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../_contexts/-breadcrumb-context'
import DataSection from './_components/-data-section'
import PageHeader from './_components/-page-header'
import SearchBox from './_components/-search-box'

export const Route = createLazyFileRoute('/(features)/_layout/production-inventory/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/production-inventory', text: t('ns_common:navigation.inventory_estimation') }])
	}, [i18n.language])

	return (
		<Div className='mt-6'>
			<PageHeader />
			<SearchBox />
			<DataSection />
		</Div>
	)
}
