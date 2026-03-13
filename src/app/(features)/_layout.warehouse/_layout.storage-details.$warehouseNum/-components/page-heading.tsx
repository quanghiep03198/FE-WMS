import { PageAction, PageDescription, PageHeader, PageTitle } from '@/app/(features)/-components/shared/page'
import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@/app/-components/-guard/role-base-access-control'
import { CommonActions, UserRole } from '@/common/constants/enums'
import { Button, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../../-contexts/page-context'

const PageHeading: React.FC = () => {
	const { dispatch } = usePageContext()
	const { t } = useTranslation()

	return (
		<PageHeader>
			<PageTitle> {t('ns_warehouse:headings.storage_list_title')}</PageTitle>
			<PageDescription>{t('ns_warehouse:headings.storage_list_description')}</PageDescription>
			<PageAction>
				<RoleBaseAccessControl
					authorizedRoles={[UserRole.FG_WAREHOUSE_STAFF, UserRole.MANAGER, UserRole.ADMIN]}
					mode='fallback'
					fallbackComponent={
						<Button
							type='button'
							onClick={() =>
								toast.warning(t('ns_common:errors.403_notification'), { id: ACTION_RESTRICTED_TOAST_ID })
							}>
							<Icon name='Lock' />
							{t('ns_common:actions.add')}
						</Button>
					}>
					<Button
						onClick={() =>
							dispatch({
								type: CommonActions.CREATE,
								payload: { dialogTitle: t('ns_warehouse:form.add_warehouse_title') }
							})
						}>
						<Icon name='CirclePlus' /> {t('ns_common:actions.add')}
					</Button>
				</RoleBaseAccessControl>
			</PageAction>
		</PageHeader>
	)
}

export default PageHeading
