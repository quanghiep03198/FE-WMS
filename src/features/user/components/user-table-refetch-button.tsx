import { Tooltip } from '@components/customs/tooltip'
import type { ButtonProps } from '@components/ui/button'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import useMediaQuery from '@hooks/use-media-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetUsersQuery } from '../hooks/use-user-request'

const UserTableRefreshButton: React.FC<ButtonProps> = (props) => {
	const isMobile = useMediaQuery('(max-width: 767px')
	const { refetch } = useGetUsersQuery()

	const { t } = useTranslation()

	return (
		<Tooltip contentProps={{ hidden: !isMobile }} message={t('ns_common:actions.reload')}>
			<Button
				size={isMobile ? 'icon' : 'default'}
				variant={isMobile ? 'ghost' : 'outline'}
				onClick={() => refetch()}
				{...props}>
				<Icon name='RefreshCcw' /> {!isMobile && t('ns_common:actions.reload')}
			</Button>
		</Tooltip>
	)
}

export default UserTableRefreshButton
