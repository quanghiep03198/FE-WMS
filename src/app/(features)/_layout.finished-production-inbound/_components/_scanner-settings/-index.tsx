import tw from 'tailwind-styled-components'
import ConnectionInsight from './-connection-insight'
import SettingPanel from './-setting-panel'
import SyncDataTrigger from './-sync-data-trigger'

const ScannerSettings: React.FC = () => {
	return (
		<ToolbarWrapper>
			<ToolbarContent>
				<ConnectionInsight />
				<SettingPanel />
				<SyncDataTrigger />
			</ToolbarContent>
		</ToolbarWrapper>
	)
}

const ToolbarWrapper = tw.div`@container group grid sm:rounded-none sm:border-none rounded-lg border bg-sidebar max-h-full overflow-hidden xxl:max-h-full`
const ToolbarContent = tw.div`
	flex h-full sm:px-0 flex-grow basis-full flex-col items-stretch gap-x-4 gap-y-6 overflow-y-auto p-4 xxl:p-6 !scrollbar-none @5xl:flex-row @5xl:flex-wrap sm:max-h-[60vh] md:max-h-[60vh]
`

export default ScannerSettings
