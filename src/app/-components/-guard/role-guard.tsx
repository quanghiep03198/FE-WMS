import { UserRole } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import { Div, Typography } from '@/components/ui'
import { HttpStatusCode } from 'axios'
import { useTranslation } from 'react-i18next'

export const RoleGuard: React.FC<React.PropsWithChildren & { authorizedRoles: UserRole[] | '*' }> = ({
	children,
	authorizedRoles
}) => {
	const { user } = useAuth()
	const { t } = useTranslation()
	const isAccessible = user && authorizedRoles.includes(user.role) && authorizedRoles !== '*'

	if (!isAccessible)
		return (
			<Div className='flex min-h-[var(--outlet-wrapper-height)] w-full flex-1 flex-col items-center justify-center gap-y-3'>
				<Typography variant='code' color='destructive' className='font-semibold'>
					{HttpStatusCode.Forbidden}
				</Typography>
				<Typography variant='h1'>{t('ns_common:errors.403')}</Typography>
				<Typography variant='p' className='mb-6 mt-2 text-base leading-7' color='muted'>
					{t('ns_common:errors.403_message')}
				</Typography>
			</Div>
		)

	return children
}
