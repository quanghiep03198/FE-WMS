import { UserRole } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import PermissionDenied from '../-errors/permission-denied'

export const RoleGuard: React.FC<React.PropsWithChildren & { authorizedRoles: UserRole[] | '*' }> = ({
	children,
	authorizedRoles
}) => {
	const { user } = useAuth()
	const isAccessible = user && authorizedRoles.includes(user.role) && authorizedRoles !== '*'

	if (!isAccessible) return <PermissionDenied />

	return children
}
