import { buttonVariants, Div, Icon, Label, Tooltip } from '@/components/ui'
import useMediaQuery from '@hooks/use-media-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ScannerActions from './action-buttons'
import DeviceSelect from './device-select'

const ScannerToolbar: React.FC = () => {
	const { t } = useTranslation()
	const isLargeScreen = useMediaQuery('(min-width: 960px)')

	return (
		<Div className='bg-background flex items-start justify-between gap-2 group-has-[#toggle-fullscreen[data-state=checked]]:relative group-has-[#toggle-fullscreen[data-state=checked]]:top-auto'>
			<DeviceSelect />
			<ScannerActions />
			<Tooltip
				message={t('ns_common:navigation.settings')}
				triggerProps={{
					asChild: true
				}}
				contentProps={{ hidden: !isLargeScreen }}>
				<Label
					htmlFor='side-toolbar-sheet-trigger'
					className={buttonVariants({
						variant: 'outline',
						className: '@[1366px]/page-container:hidden'
					})}>
					<Icon name='Settings2' />
					<span>{t('ns_common:navigation.settings')}</span>
				</Label>
			</Tooltip>
		</Div>
	)
}

export default ScannerToolbar
