import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@/components/guards/role-base-access-control'
import { Button, Icon } from '@/components/ui'
import { CommonActions, UserRole } from '@common/constants/enums'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../-contexts/page-context'
import { PageAction, PageDescription, PageHeader, PageTitle } from '../../../../components/shared/page'

const PageHeading: React.FC = () => {
	const { dispatch } = usePageContext()
	const { t } = useTranslation()

	return (
		<PageHeader>
			<PageTitle>{t('ns_warehouse:headings.warehouse_list_title')}</PageTitle>
			<PageDescription>{t('ns_warehouse:headings.warehouse_list_description')}</PageDescription>
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
