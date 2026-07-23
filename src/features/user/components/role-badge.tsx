import { UserRole } from '@common/constants/enums'
import type { IconProps } from '@components/ui'
import { Badge, Icon } from '@components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const RoleBadge: React.FC<{ data: UserRole }> = ({ data }) => {
	const { t } = useTranslation()

	const roleIcon: IconProps['name'] = (() => {
		switch (data) {
			case UserRole.ADMIN:
				return 'UserCog'
			case UserRole.MANAGER:
				return 'UserStar'
			case UserRole.SECURITY_GUARD:
				return 'ShieldUser'
			default:
				return 'User'
		}
	})()

	return (
		<Badge variant='secondary' className='flex-nowrap whitespace-nowrap' title={t(`ns_auth:roles.${data}`)}>
			<Icon name={roleIcon} size={18} />
			{t(`ns_auth:roles.${data}`)}
		</Badge>
	)
}

export default RoleBadge
