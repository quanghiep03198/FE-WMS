import type { ButtonProps } from '@/components/ui'
import { Button, Icon, Tooltip } from '@/components/ui'
import useMediaQuery from '@/hooks/use-media-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUsersQuery } from '../hooks/use-user-request'

const UserTableRefreshButton: React.FC<ButtonProps> = (props) => {
	const isMobile = useMediaQuery('(max-width: 767px')
	const { refetch } = useGetUsersQuery()

	const { t } = useTranslation()

	return (
		<Tooltip message={t('ns_common:actions.reload')} contentProps={{ hidden: !isMobile }}>
			<Button
				variant={isMobile ? 'ghost' : 'outline'}
				size={isMobile ? 'icon' : 'default'}
				onClick={() => refetch()}
				{...props}>
				<Icon name='RefreshCcw' /> {!isMobile && t('ns_common:actions.reload')}
			</Button>
		</Tooltip>
	)
}

export default UserTableRefreshButton
