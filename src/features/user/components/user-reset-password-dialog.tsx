import ConfirmDialog from '@components/customs/confirm-dialog'
import { Button } from '@components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@components/ui/dialog'
import { Icon } from '@components/ui/icon'
import useCopyToClipboard from '@hooks/use-copy-to-clipboard'
import { escape } from 'lodash-es'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useResetUserPasswordMutation } from '../hooks/use-user-request'

type Props = {
	user: { _id: string; username: string }
	onClose: () => void
}

const PasswordResetResult: React.FC<Props & { password: string }> = ({ user, password, onClose }) => {
	const { t } = useTranslation()
	const [copyToClipboard, { isCoppied }] = useCopyToClipboard()
	const [copyAttempted, setCopyAttempted] = useState(false)

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>{t('ns_auth:titles.password_reset')}</DialogTitle>
					<DialogDescription>
						{t('ns_auth:descriptions.password_reset', { username: user.username })}
					</DialogDescription>
				</DialogHeader>
				<div className='flex items-center gap-2'>
					<code className='bg-muted min-w-0 flex-1 items-center flex rounded-md h-9 p-3 break-all select-all'>
						{password}
					</code>
					<Button
						variant='outline'
						onClick={() => {
							copyToClipboard(password, undefined)
							setCopyAttempted(true)
						}}>
						<Icon name={isCoppied ? 'Check' : 'Copy'} />
						{t('ns_common:editor.copy')}
					</Button>
				</div>
				{copyAttempted && (
					<p className='text-muted-foreground text-sm' role='status'>
						{t(isCoppied ? 'ns_auth:notification.password_copied' : 'ns_auth:notification.password_copy_failed')}
					</p>
				)}
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>{t('ns_common:actions.close')}</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const UserResetPasswordDialog: React.FC<Props> = ({ user, onClose }) => {
	const { t } = useTranslation()
	const [password, setPassword] = useState<string | null>(null)
	const { mutate, isPending, isError } = useResetUserPasswordMutation(setPassword)
	const resetPassword = () => {
		if (!isPending) mutate(user._id)
	}

	if (password !== null) return <PasswordResetResult password={password} user={user} onClose={onClose} />

	return (
		<ConfirmDialog
			open
			description={t('ns_auth:descriptions.confirm_reset_password', { username: escape(user.username) })}
			isError={isError}
			isPending={isPending}
			title={t('ns_auth:actions.reset_password')}
			dialogActionProps={{
				onClick: (event) => {
					event.preventDefault()
					resetPassword()
				}
			}}
			onConfirm={resetPassword}
			onOpenChange={(open) => {
				if (!open && !isPending) onClose()
			}}
		/>
	)
}

export default UserResetPasswordDialog
