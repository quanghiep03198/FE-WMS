import { UserRole } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import { cn } from '@/common/utils/cn'
import { Icon } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type VisibilityMode = 'mask' | 'invisible' | 'fallback'

type RoleBaseAccessControlVariant =
	| {
			mode?: Exclude<VisibilityMode, 'fallback'>
			fallbackComponent?: never
	  }
	| { mode?: Extract<VisibilityMode, 'fallback'>; fallbackComponent: React.ReactNode }

type RoleBaseAccessControlProps = React.PropsWithChildren &
	Pick<React.ComponentProps<'div'>, 'style' | 'className'> &
	RoleBaseAccessControlVariant & { authorizedRoles: UserRole[] }

const RoleBaseAccessControl: React.FC<RoleBaseAccessControlProps> = ({
	children,
	className,
	style,
	mode = 'mask',
	authorizedRoles,
	fallbackComponent
}) => {
	const { user } = useAuth()
	const isAccessible = user && Array.isArray(user.roles) && user.roles.some((role) => authorizedRoles.includes(role))
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

	const Component: Record<VisibilityMode, React.ReactNode> = {
		mask: (
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
		),
		invisible: null,
		fallback: fallbackComponent
	}

	return isAccessible ? children : Component[mode]
}

export default RoleBaseAccessControl
