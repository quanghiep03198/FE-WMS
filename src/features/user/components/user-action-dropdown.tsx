import { CommonActions } from '@common/constants/enums'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@components/ui/dropdown-menu'
import { Icon } from '@components/ui/icon'
import type { IUser } from '@features/auth/types'
import type { CellContext } from '@tanstack/react-table'
import { pick } from 'lodash-es'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../contexts'
import { useUpdateUserMutation } from '../hooks/use-user-request'

const UserActionDropdown: React.FC<CellContext<IUser, unknown>> = ({ row }) => {
	const { t } = useTranslation()
	const { event$, requestPasswordReset } = usePageContext()
	const [open, setOpen] = useState<boolean>(false)
	const userId = row.original._id

	const { mutateAsync, isPending } = useUpdateUserMutation()

	return (
		<>
			<DropdownMenu open={open || isPending} onOpenChange={setOpen}>
				<DropdownMenuTrigger className='text-muted-foreground hover:text-foreground transition-colors duration-200 ease-in-out'>
					<Icon name='Ellipsis' />
				</DropdownMenuTrigger>
				<DropdownMenuContent align='start' side='left'>
					<DropdownMenuGroup>
						<DropdownMenuLabel>{t('ns_common:common_fields.actions')}</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								event$.emit({
									action: CommonActions.UPDATE,
									payload: pick(row.original, [
										'_id',
										'username',
										'display_name',
										'email',
										'roles'
										// 'authorized_factory_codes'
									])
								})
							}>
							{t('ns_common:actions.update')}
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={isPending || !userId}
							onSelect={() => {
								if (userId) {
									setOpen(false)
									requestPasswordReset({ _id: userId, username: row.original.username })
								}
							}}>
							{t('ns_auth:actions.reset_password')}
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={isPending}
							onClick={async () => {
								await mutateAsync({
									_id: row.original._id,
									username: row.original.username,
									deleted: !row.original.deleted
								})
							}}>
							{isPending && <Icon className='animate-spin' name='LoaderCircle' />}
							{!row.original.deleted ? t('ns_common:actions.deactivate') : t('ns_common:actions.activate')}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}

export default UserActionDropdown
