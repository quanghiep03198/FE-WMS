import { UserRole } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import { Icon } from '@/components/ui'
import React from 'react'

const RoleBaseAccessControl: React.FC<React.PropsWithChildren & { authorizedRoles: UserRole[] }> = ({
	children,
	authorizedRoles
}) => {
	const { user } = useAuth()
	const isAccessible = user && authorizedRoles.includes(user.role)

	const preventActionIfUnauthorized = (e: React.MouseEvent) => {
		if (!isAccessible) {
			e.preventDefault()
			e.stopPropagation()
			// Hiển thị thông báo không có quyền
		}
	}

	return isAccessible ? (
		children
	) : (
		<div
			aria-disabled={!isAccessible}
			className='group relative'
			onClick={preventActionIfUnauthorized}
			onContextMenu={preventActionIfUnauthorized}>
			{!isAccessible && (
				<div className='absolute inset-0 z-20 flex items-center justify-center gap-x-2 group-aria-disabled:cursor-not-allowed group-aria-disabled:select-none group-aria-disabled:bg-background/50 group-aria-disabled:hover:bg-transparent'>
					<Icon name='Lock' className='ease opacity-0 duration-200 group-hover:opacity-100' />
				</div>
			)}
			<div className='ease opacity-100 duration-200 group-hover:opacity-0'>{children}</div>
		</div>
	)
}

export default RoleBaseAccessControl
