import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import DataSection from './-components/data-section'
import PageHeader from './-components/page-header'
import SearchBox from './-components/search-box'

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
		<Div as='section' className='pt-4 xxl:min-h-[var(--outlet-wrapper-height)]'>
			<PageHeader />
			<SearchBox />
			<DataSection />
		</Div>
	)
}
