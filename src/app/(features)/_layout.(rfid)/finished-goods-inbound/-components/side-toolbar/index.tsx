import { cn } from '@/common/utils/cn'
import { Div } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import tw from 'tailwind-styled-components'
import ConnectionInsight from './connection-insight'
import DataRestoration from './data-restoration'
import FullscreenToggleBox from './fullscreen-toggle-box'
import SyncDataTrigger from './sync-data-trigger'

const ScannerSettings: React.FC = () => {
	return (
		<ToolbarWrapper>
			<ScrollShadow
				className={cn(
					'flex flex-grow basis-full flex-col items-stretch gap-x-4 gap-y-6 p-4 !scrollbar-none xl:max-h-[calc(var(--outlet-wrapper-height)-var(--outlet-padding)-4px)]',
					'sm:max-h-[60vh] sm:px-0 md:max-h-[60vh] xxl:p-6',
					'@4xl:grid @4xl:grid-cols-12 @4xl:grid-rows-3 @4xl:gap-x-10'
				)}>
				<Div className='w-full @4xl:col-span-5 @4xl:col-start-1 @4xl:row-span-1'>
					<ConnectionInsight />
				</Div>
				<Div className='w-full @4xl:col-span-5 @4xl:col-start-1 @4xl:row-span-1'>
					<FullscreenToggleBox />
				</Div>
				<Div className='w-full @4xl:col-span-5 @4xl:col-start-1 @4xl:row-span-1'>
					<DataRestoration />
				</Div>
				<Div className='w-full @4xl:col-span-7 @4xl:col-start-6 @4xl:row-span-full'>
					<SyncDataTrigger />
				</Div>
			</ScrollShadow>
		</ToolbarWrapper>
	)
}

const ToolbarWrapper = tw.div`
	@container sticky overflow-hidden xl:top-[var(--header-height)] top-auto group sm:rounded-none sm:border-none border rounded-lg bg-sidebar 
	group-has-[#toggle-fullscreen[data-state=checked]]:relative group-has-[#toggle-fullscreen[data-state=checked]]:top-auto
	`

export default ScannerSettings
