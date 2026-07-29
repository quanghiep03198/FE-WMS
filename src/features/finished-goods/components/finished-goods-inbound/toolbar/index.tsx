import { buttonVariants, Div, Icon, Label, Separator } from '@components/ui'
import { useTranslation } from 'react-i18next'

import ConnectButton from './connect-button'
import DeviceSelect from './device-select'
import NetworkInsight from './network-insight'

const Toolbar: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='flex items-center gap-x-2'>
			<NetworkInsight />
			<DeviceSelect />
			<Separator orientation='vertical' />
			<ConnectButton />
			<Label
				htmlFor='side-toolbar-sheet-trigger'
				className={buttonVariants({
					variant: 'secondary',
					className: '@[1366px]/page-container:hidden'
				})}>
				<Icon name='Settings2' />
				<span>{t('ns_common:navigation.settings')}</span>
			</Label>
		</Div>
	)
}

export default Toolbar
