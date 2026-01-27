import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../../-components/shared/page-header'
import { useBreadcrumbContext } from '../../-contexts/breadcrumb-context'
import UserTable from './-components/user-table'

export const Route = createLazyFileRoute('/(features)/_layout/(admin)/access-management/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/access-management', text: t('ns_common:navigation.access_management') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.access_management')}</title>
			<meta name='description' content='Manage users' />
			<RoleGuard authorizedRoles={[UserRole.ADMIN]}>
				<Div as='section' className='space-y-4'>
					<Div className='flex items-start justify-between'>
						<PageHeader>
							<PageTitle>{t('ns_common:navigation.access_management')}</PageTitle>
							<PageDescription>{t('ns_auth:descriptions.access_management')}</PageDescription>
						</PageHeader>
					</Div>
					<Separator />
				</Div>
				<UserTable />
			</RoleGuard>
		</Fragment>
	)
}
