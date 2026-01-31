import { CommonActions } from '@/common/constants/enums'
import { IUser } from '@/common/types/entities'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from '@/components/ui'
import { CellContext } from '@tanstack/react-table'
import { pick } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'

const UserActionDropdown: React.FC<CellContext<IUser, unknown>> = ({ row }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'>
				<Icon name='Ellipsis' />
			</DropdownMenuTrigger>
			<DropdownMenuContent side='left' align='start'>
				<DropdownMenuItem
					onClick={() =>
						event$.emit({
							action: CommonActions.UPDATE,
							payload: pick(row.original, [
								'username',
								'display_name',
								'email',
								'employee_code',
								'roles',
								'authorized_factory_codes'
							])
						})
					}>
					{t('ns_common:actions.update')}
				</DropdownMenuItem>
				{!row.original.is_active ? (
					<DropdownMenuItem>{t('ns_common:actions.activate')}</DropdownMenuItem>
				) : (
					<DropdownMenuItem>{t('ns_common:actions.deactivate')}</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserActionDropdown
