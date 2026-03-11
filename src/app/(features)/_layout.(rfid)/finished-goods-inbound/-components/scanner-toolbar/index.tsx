import useMediaQuery from '@/common/hooks/use-media-query'
import { buttonVariants, Div, Icon, Label, Separator, Tooltip } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { HorizontalConnectionInsight } from '../side-toolbar/connection-insight'
import ScannerActions from './action-buttons'
import TenacyBox from './tenancy-box'

const ScannerToolbar: React.FC = () => {
	const { t } = useTranslation()
	const isLargeScreen = useMediaQuery('(min-width: 920px)')

	return (
		<Div className='flex h-[var(--toolbar-height)] items-start justify-between gap-2 bg-background group-has-[#toggle-fullscreen[data-state=checked]]:relative group-has-[#toggle-fullscreen[data-state=checked]]:top-auto md:justify-end'>
			<HorizontalConnectionInsight className='md:hidden' />
			<TenacyBox />
			<ScannerActions />
			<Separator className='m-1.5 block h-6 w-0.5 @7xl/page-container:hidden md:hidden' />
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
						className: '@[1366px]/page-container:hidden md:order-first lg:size-9 lg:p-0 xl:size-9 xl:p-0'
					})}>
					<Icon name='Settings2' />
					<span className='lg:hidden xl:hidden'>{t('ns_common:navigation.settings')}</span>
				</Label>
			</Tooltip>
		</Div>
	)
}

export default ScannerToolbar
