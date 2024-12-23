import { Icon, Typography } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { useEventListener } from 'ahooks'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { FP_RFID_SETTINGS_KEY } from '../../_constants/rfid.const'
import ConnectionInsight from './-connection-insight'
import SettingPanel from './-setting-panel'
import SyncRunner from './-sync-runner'

const ScannerSettings: React.FC = () => {
	const { t } = useTranslation()

	useEventListener('LOGOUT', () => {
		localStorage.removeItem(FP_RFID_SETTINGS_KEY) // remove finished production RFID settings
	})

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
				<SyncRunner />
				<SettingPanel />
			</ToolbarBody>
		</ToolbarWrapper>
	)
}

const ToolbarWrapper = tw.div`@container group grid grid-rows-[48px_auto] rounded-lg border bg-background max-h-full overflow-hidden xxl:max-h-[calc(100vh-7rem)]`
const ToolbarHeader = tw.div`flex items-center gap-x-2 border-b px-4 py-2 bg-table-head rounded-t-[inherit]`
const ToolbarBody = tw(ScrollShadow)`
	flex max-h-[90vh] flex-grow basis-full flex-col items-stretch gap-x-4 gap-y-6 overflow-y-auto p-4 !scrollbar-none @5xl:flex-row @5xl:flex-wrap sm:max-h-[60vh] md:max-h-[60vh]
`

export default ScannerSettings
