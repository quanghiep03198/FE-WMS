import { cn } from '@/common/utils/cn'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import tw from 'tailwind-styled-components'
import ConnectionInsight from './connection-insight'
import DataRestoration from './data-restoration'
import SettingPanel from './setting-panel'
import SyncDataTrigger from './sync-data-trigger'

const ScannerSettings: React.FC = () => {
	return (
		<ToolbarWrapper>
			<ScrollShadow
				className={cn(
					'flex h-full flex-grow basis-full flex-col items-stretch gap-x-4 gap-y-6 p-4 !scrollbar-none',
					'sm:max-h-[60vh] sm:px-0 md:max-h-[60vh] xxl:p-6',
					'@5xl:flex-row @5xl:flex-wrap'
				)}>
				<ConnectionInsight />
				<SettingPanel />
				<DataRestoration />
				<SyncDataTrigger />
			</ScrollShadow>
		</ToolbarWrapper>
	)
}

const ToolbarWrapper = tw.div`@container group sm:rounded-none sm:border-none border rounded-lg bg-sidebar max-h-[var(--outlet-wrapper-height)] overflow-hidden`

export default ScannerSettings
