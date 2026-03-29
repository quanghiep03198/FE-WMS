import type { UserRole } from '@/common/constants/enums'
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
			fallbackComponent?: undefined
	  }
	| { mode?: Extract<VisibilityMode, 'fallback'>; fallbackComponent: Required<React.ReactNode> }

type RoleBaseAccessControlProps = React.PropsWithChildren &
	RoleBaseAccessControlVariant & {
		authorizedRoles: UserRole[]
		classNames?: {
			wrapper?: string
			innerWrapper?: string
		}
	}

export const ACTION_RESTRICTED_TOAST_ID = 'action-restricted-toast'

const RoleBaseAccessControl: React.FC<RoleBaseAccessControlProps> = ({
	children,
	classNames,
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
				id: ACTION_RESTRICTED_TOAST_ID,
				dismissible: true,
				duration: 5000
			})
		}
	}

	const Component: Record<VisibilityMode, React.ReactNode> = {
		mask: (
			<div
				aria-disabled={!isAccessible}
				className={cn('group/rbac relative', classNames?.wrapper)}
				onClick={preventActionIfUnauthorized}
				onContextMenu={preventActionIfUnauthorized}>
				{!isAccessible && (
					<div
						data-slot='rbac-mask'
						className='ease absolute inset-0 z-20 flex items-center justify-center gap-x-2 opacity-0 transition-opacity duration-200 group-hover/rbac:opacity-100 group-aria-disabled/rbac:cursor-not-allowed group-aria-disabled/rbac:select-none'>
						<Icon
							name='Lock'
							className='ease-in-out group-hover/rbac:duration-200 group-hover/rbac:animate-in group-hover/rbac:zoom-in-0'
						/>
					</div>
				)}
				<div
					data-slot='rbac-element'
					className={cn(
						'ease opacity-100 transition-opacity duration-200 group-hover/rbac:opacity-15',
						classNames?.innerWrapper
					)}>
					{children}
				</div>
			</div>
		),
		invisible: null,
		fallback: fallbackComponent
	}

	return isAccessible ? children : Component[mode]
}

export default RoleBaseAccessControl
