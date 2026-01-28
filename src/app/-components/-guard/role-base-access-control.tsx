import { UserRole } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type RoleBaseAccessControlProps = React.PropsWithChildren &
	Pick<React.ComponentProps<'div'>, 'style' | 'className'> & { authorizedRoles: UserRole[] }

const RoleBaseAccessControl: React.FC<RoleBaseAccessControlProps> = ({
	children,
	className,
	style,
	authorizedRoles
}) => {
	const { user } = useAuth()
	const isAccessible = user && authorizedRoles.includes(user.role)
	const { t } = useTranslation()

	const preventActionIfUnauthorized = (e: React.MouseEvent) => {
		if (!isAccessible) {
			e.preventDefault()
			e.stopPropagation()
			toast.warning(t('ns_common:errors.403_notification'), {
				id: 'permission-denied',
				dismissible: true,
				duration: 5000
			})
		}
	}

	return isAccessible ? (
		children
	) : (
		<div
			aria-disabled={!isAccessible}
			className={cn('group/rbac relative h-full w-full', className)}
			style={style}
			onClick={preventActionIfUnauthorized}
			onContextMenu={preventActionIfUnauthorized}>
			{!isAccessible && (
				<div className='absolute inset-0 z-20 flex items-center justify-center gap-x-2 group-aria-disabled/rbac:cursor-not-allowed group-aria-disabled/rbac:select-none'>
					<Icon
						name='Lock'
						className='ease stroke-muted-foreground opacity-0 duration-200 group-hover/rbac:opacity-100'
					/>
				</div>
			)}
			<div className='ease opacity-100 duration-200 group-hover/rbac:opacity-0'>{children}</div>
		</div>
	)
}

export default RoleBaseAccessControl
