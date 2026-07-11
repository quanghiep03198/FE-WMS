import { UserRole } from '@/common/constants/enums'
import { RoleGuard } from '@/components/guards/role-guard'
import { Div } from '@/components/ui'
import useQueryParams from '@/hooks/use-query-params'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import { RFIDDataType } from '../_layout.(rfid)/-constants'
import DataSection from './-components/data-section'
import PageHeader from './-components/header'
import SearchForm from './-components/search-form'

export const Route = createLazyFileRoute('/(features)/_layout/inoutbound-history/')({
	component: RouteComponent
})

function RouteComponent() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()
	const { searchParams } = useQueryParams<{ order: string; type: RFIDDataType }>()

	useEffect(() => {
		setBreadcrumb([{ to: '/inoutbound-history', text: t('ns_common:navigation.inoutbound_history') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.inoutbound_history')}</title>
			<meta name='description' content='Search in/outbound progress by order' />

			<RoleGuard
				authorizedRoles={[
					UserRole.ADMIN,
					UserRole.MANAGER,
					UserRole.FG_WAREHOUSE_STAFF,
					UserRole.INDUSTRIAL_ENGINEERING_STAFF
				]}>
				<Div as='section' className='min-h-[var(--outlet-wrapper-height)] place-content-center space-y-6'>
					<PageHeader />
					<SearchForm />
					{searchParams.order && Object.values(RFIDDataType).includes(searchParams.type) && <DataSection />}
				</Div>
			</RoleGuard>
		</Fragment>
	)
}
