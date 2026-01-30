import { UserRole } from '@/common/constants/enums'
import { Badge, Icon } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const RoleBadge: React.FC<{ value: UserRole }> = ({ value }) => {
	const { t } = useTranslation()

	const roleConfig = {
		[UserRole.ADMIN]: {
			icon: 'UserCog' as const,
			color: 'hsl(var(--active))'
		},
		[UserRole.MANAGER]: {
			icon: 'User' as const,
			color: 'hsl(var(--success))'
		}
	} as const

	const config = roleConfig[value] ?? {
		icon: 'User' as const,
		color: 'hsl(var(--muted-foreground))'
	}

	return (
		<Badge variant='outline' className='text-nowrap'>
			<Icon name={config.icon} stroke={config.color} className='' /> {t(`ns_auth:roles.${value}`)}
		</Badge>
	)
}

export default RoleBadge
