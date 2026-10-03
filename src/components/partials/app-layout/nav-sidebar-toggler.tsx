import { Button, Icon, Tooltip, useSidebar } from '@components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const NavSidebarToggler: React.FC = () => {
	const { t } = useTranslation()
	const { toggleSidebar } = useSidebar()

	return (
		<Tooltip
			contentProps={{ side: 'bottom', align: 'start' }}
			message={`${t('ns_common:actions.toggle_sidebar')} (ctrl+b)`}
			triggerProps={{ asChild: true }}>
			<Button aria-label='Menu' size='icon' variant='ghost' onClick={toggleSidebar}>
				<Icon name='Menu' />
			</Button>
		</Tooltip>
	)
}

export default NavSidebarToggler
