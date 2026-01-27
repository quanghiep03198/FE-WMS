import { UserRole } from '@/common/constants/enums'
import { Badge, Icon } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const roleColorMap: Map<UserRole, string> = new Map([
	[UserRole.ADMIN, '#ef4444'],
	[UserRole.MANAGER, 'blue'],
	[UserRole.FG_WAREHOUSE_STAFF, '#22c55e'],
	[UserRole.DG_WAREHOUSE_STAFF, 'orange'],
	[UserRole.IE_STAFF, 'purple'],
	[UserRole.SECURITY_GUARD, '#3b82f6']
])

const RoleBadge: React.FC<{ value: UserRole }> = ({ value }) => {
	const { t } = useTranslation()

	return (
		<Badge variant='outline'>
			<Icon name='User' stroke={roleColorMap[value]} /> {t(`ns_auth:roles.${value}`)}
		</Badge>
	)
}

export default RoleBadge
