import { CommonActions } from '@/common/constants/enums'
import type { IUser } from '@/common/types/entities'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from '@/components/ui'
import type { CellContext } from '@tanstack/react-table'
import { pick } from 'lodash-es'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../contexts'
import { useUpdateUserStatusMutation } from '../hooks/use-user-request'

const UserActionDropdown: React.FC<CellContext<IUser, unknown>> = ({ row }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const [open, setOpen] = useState<boolean>(false)

	const { mutateAsync, isPending } = useUpdateUserStatusMutation()

	return (
		<DropdownMenu open={open || isPending} onOpenChange={setOpen}>
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
				<DropdownMenuItem
					disabled={isPending}
					onClick={async () => {
						await mutateAsync({ username: row.original.username, is_active: !row.original.is_active })
					}}>
					{isPending && <Icon name='LoaderCircle' className='animate-spin' />}
					{row.original.is_active ? t('ns_common:actions.deactivate') : t('ns_common:actions.activate')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserActionDropdown
