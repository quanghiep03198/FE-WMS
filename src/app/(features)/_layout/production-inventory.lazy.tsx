import { UserRole } from '@common/constants/enums'
import { RoleGuard } from '@components/guards/role-guard'
import { Div } from '@components/ui'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import DataSection from '@features/inventory/components/production-inventory/partials/data-section'
import PageHeader from '@features/inventory/components/production-inventory/partials/page-header'
import SearchBox from '@features/inventory/components/production-inventory/partials/search-box'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/production-inventory')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/production-inventory', text: t('ns_common:navigation.inventory_estimation') }])
	}, [i18n.language])

	return (
		<RoleGuard
			authorizedRoles={[
				UserRole.ADMIN,
				UserRole.MANAGER,
				UserRole.FG_WAREHOUSE_STAFF,
				UserRole.INDUSTRIAL_ENGINEERING_STAFF
			]}>
			<Div as='section' className='xxl:min-h-(--outlet-wrapper-height) @container pt-4'>
				<PageHeader />
				<SearchBox />
				<DataSection />
			</Div>
		</RoleGuard>
	)
}
