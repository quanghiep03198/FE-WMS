import { Button, Icon } from '@/components/ui'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useToggleListPanel } from '../../-hooks/use-toggle-list-panel'

const ListPanelToggleButton: React.FC = () => {
	const { listPanelOpen, toggleListPanelOpen } = useToggleListPanel()
	const { t } = useTranslation()
	return (
		<Button variant='ghost' size='sm' type='button' onClick={() => toggleListPanelOpen()}>
			<Icon name={listPanelOpen ? 'PanelLeftClose' : 'PanelLeftOpen'} size={18} />
			{listPanelOpen ? t('ns_common:actions.collapse_list_panel') : t('ns_common:actions.open_list_panel')}
		</Button>
	)
}

export default memo(ListPanelToggleButton)
