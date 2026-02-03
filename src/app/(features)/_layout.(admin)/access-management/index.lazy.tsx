import RoleBaseAccessControl from '@/app/-components/-guard/role-base-access-control'
import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
	PageAction,
	PageDescription,
	PageHeader,
	PageSeparator,
	PageTitle,
	PageWrapper
} from '../../-components/shared/page-header'
import { useBreadcrumbContext } from '../../-contexts/breadcrumb-context'
import { UserFormDialog, UserFormDialogTrigger } from './-components/user-form-dialog'
import UserTable from './-components/user-table'
import { PageContextProvider } from './-contexts/page-context'

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
				<RoleBaseAccessControl
					authorizedRoles={[UserRole.ADMIN]}
					classNames={{ wrapper: 'pb' }}></RoleBaseAccessControl>
				<PageContextProvider>
					<PageWrapper>
						<PageHeader>
							<PageTitle>{t('ns_auth:titles.page_title')}</PageTitle>
							<PageDescription>{t('ns_auth:descriptions.page_description')}</PageDescription>
							<PageAction>
								<UserFormDialogTrigger />
							</PageAction>
						</PageHeader>
						<PageSeparator />
						<UserTable />
					</PageWrapper>
					<UserFormDialog />
				</PageContextProvider>
			</RoleGuard>
		</Fragment>
	)
}
