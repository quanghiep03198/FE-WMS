import { UserFormDialog, UserFormDialogTrigger } from '@features/user/components/user-form-dialog'
import UserTable from '@features/user/components/user-table'
import { PageContextProvider } from '@features/user/contexts'
import { UserRole } from '@common/constants/enums'
import RoleBaseAccessControl from '@components/guards/role-base-access-control'
import { RoleGuard } from '@components/guards/role-guard'
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
} from '../../../../components/shared/page'
import { useBreadcrumbContext } from '../../../../contexts/breadcrumb-context'

export const Route = createLazyFileRoute('/(features)/_layout/(admin)/access-management')({
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
