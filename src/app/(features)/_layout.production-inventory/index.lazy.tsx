import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import DataSection from './-components/partials/data-section'
import PageHeader from './-components/partials/page-header'
import SearchBox from './-components/partials/search-box'

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
		<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF]}>
			<Div as='section' className='pt-4 @container xxl:min-h-[var(--outlet-wrapper-height)]'>
				<PageHeader />
				<SearchBox />
				<DataSection />
			</Div>
		</RoleGuard>
	)
}
