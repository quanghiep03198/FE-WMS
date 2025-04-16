import { Icon, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import ConnectionInsight from './-connection-insight'
import SettingPanel from './-setting-panel'
import SyncDataTrigger from './-sync-data-trigger'

const ScannerSettings: React.FC = () => {
	const { t } = useTranslation()

	return (
		<ToolbarWrapper>
			<ToolbarHeader>
				<Typography
					variant='h6'
					className='inline-flex items-center gap-x-2 text-xl font-semibold sm:text-lg md:text-lg'>
					<Icon name='Settings' size={22} />
					{t('ns_common:navigation.settings')}
				</Typography>
			</ToolbarHeader>
			<ToolbarBody>
				<ConnectionInsight />
				<SettingPanel />
				<SyncDataTrigger />
			</ToolbarBody>
		</ToolbarWrapper>
	)
}

const ToolbarWrapper = tw.div`@container group grid grid-rows-[48px_auto] sm:rounded-none sm:border-none rounded-lg border bg-background max-h-full overflow-hidden xxl:max-h-full`
const ToolbarHeader = tw.div`sm:bg-transparent sm:px-0 flex items-center gap-x-2 border-b px-4 py-2 bg-table-head rounded-t-[inherit]`
const ToolbarBody = tw.div`
	flex h-full sm:px-0 flex-grow basis-full flex-col items-stretch gap-x-4 gap-y-6 overflow-y-auto p-4 !scrollbar-none @5xl:flex-row @5xl:flex-wrap sm:max-h-[60vh] md:max-h-[60vh]
`

export default ScannerSettings
