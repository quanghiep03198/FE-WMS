import { cn } from '@/common/utils/cn'
import { Div, Sheet, SheetContent, SheetTrigger, Typography } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { ConnectionInsight } from './connection-insight'
import DataRestoration from './data-restoration'
import EpcDeduplicationToggleBox from './epc-deduplication-toggle-box'
import FullscreenToggleBox from './fullscreen-toggle-box'
import SyncDataTrigger from './sync-data-trigger'

const ScannerSettings: React.FC = () => {
	const { t } = useTranslation()

	return (
		<>
			<Sheet>
				<SheetTrigger id='side-toolbar-sheet-trigger' className='hidden' />
				<SheetContent
					side='left'
					className='max-w-lg !overflow-y-scroll'
					onOpenAutoFocus={(e) => e.preventDefault()}>
					<ScrollShadow className='max-h-full flex-1 space-y-6'>
						<Div className='space-y-3'>
							<Typography className='text-lg font-semibold sm:text-base md:text-base'>
								{t('ns_common:titles.general_settings')}
							</Typography>
							<EpcDeduplicationToggleBox />
							<FullscreenToggleBox />
						</Div>
						<DataRestoration />
						<SyncDataTrigger />
					</ScrollShadow>
				</SheetContent>
			</Sheet>
			<ToolbarWrapper>
				<ScrollShadow
					className={cn(
						'flex max-h-[--outlet-wrapper-height] flex-grow basis-full flex-col items-stretch gap-x-4 gap-y-6 p-4 !scrollbar-none',
						'sm:px-0 xxl:p-6',
						'@4xl:grid @4xl:grid-cols-12 @4xl:grid-rows-3 @4xl:gap-x-10'
					)}>
					<Div className='w-full space-y-3 @4xl:col-span-5 @4xl:col-start-1 @4xl:row-span-1'>
						<Typography className='text-lg font-semibold sm:text-base md:text-base'>
							{t('ns_inoutbound:scanner_setting.network_status')}
						</Typography>
						<ConnectionInsight className='md:hidden' />
					</Div>

					<Div className='w-full space-y-3 @4xl:col-span-5 @4xl:col-start-1 @4xl:row-span-1'>
						<Typography className='text-lg font-semibold sm:text-base md:text-base'>
							{t('ns_common:titles.general_settings')}
						</Typography>
						<EpcDeduplicationToggleBox />
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
		</>
	)
}

const ToolbarWrapper = tw.div`
	@container @[1366px]/page-container:block hidden sticky overflow-hidden xl:top-[var(--header-height)] top-auto group sm:rounded-none sm:border-none border rounded-lg bg-sidebar 
	group-has-[#toggle-fullscreen[data-state=checked]]:relative group-has-[#toggle-fullscreen[data-state=checked]]:top-auto
`

export default ScannerSettings
