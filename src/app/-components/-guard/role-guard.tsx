import type { UserRole } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import PermissionDenied from '../-errors/permission-denied'

export const RoleGuard: React.FC<React.PropsWithChildren & { authorizedRoles: UserRole[] | '*' }> = ({
	children,
	authorizedRoles
}) => {
	const { user } = useAuth()
	const isAccessible =
		user &&
		Array.isArray(user?.roles) &&
		user?.roles?.some((role) => authorizedRoles.includes(role)) &&
		authorizedRoles !== '*'

	if (!isAccessible) return <PermissionDenied />

	return children
}
