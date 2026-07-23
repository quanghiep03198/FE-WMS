import { Button, Icon, Tooltip, useSidebar } from '@components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const NavSidebarToggler: React.FC = () => {
	const { t } = useTranslation()
	const { toggleSidebar } = useSidebar()

	return (
		<Tooltip
			message={`${t('ns_common:actions.toggle_sidebar')} (ctrl+b)`}
			triggerProps={{ asChild: true }}
			contentProps={{ side: 'bottom', align: 'start' }}>
			<Button variant='ghost' size='icon' onClick={toggleSidebar} aria-label='Menu'>
				<Icon name='Menu' />
			</Button>
		</Tooltip>
	)
}

export default NavSidebarToggler
