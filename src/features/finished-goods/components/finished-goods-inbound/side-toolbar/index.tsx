import { Div, Sheet, SheetContent, SheetTrigger, Typography } from '@components/ui'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
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
					className='scroll-fade-y max-w-lg overflow-y-scroll!'
					onOpenAutoFocus={(e) => e.preventDefault()}>
					<Div className='max-h-full flex-1 space-y-6'>
						<Div className='space-y-3'>
							<Typography className='text-lg font-semibold sm:text-base md:text-base'>
								{t('ns_common:titles.general_settings')}
							</Typography>
							{/* <ConnectionController /> */}
							<EpcDeduplicationToggleBox />
							<FullscreenToggleBox />
						</Div>
						<DataRestoration />
						<SyncDataTrigger />
					</Div>
				</SheetContent>
			</Sheet>
			<ToolbarWrapper>
				<Div className='w-full space-y-3 @4xl:col-span-5 @4xl:col-start-1 @4xl:row-span-1'>
					<Typography className='text-lg font-semibold sm:text-base md:text-base'>
						{t('ns_common:titles.general_settings')}
					</Typography>
					<EpcDeduplicationToggleBox />
					<FullscreenToggleBox />
				</Div>

				<DataRestoration />
				<SyncDataTrigger />
			</ToolbarWrapper>
		</>
	)
}

const ToolbarWrapper = tw.div`
	@container @[1366px]/page-container:flex flex-col grow basis-full hidden sticky xl:top-(--header-height) top-auto group
	max-h-(--outlet-wrapper-height) scroll-fade overflow-y-auto scrollbar-none  border rounded-lg bg-sidebar 
	sm:rounded-none sm:border-none items-stretch gap-x-4 gap-y-6 p-4
	group-has-[#toggle-fullscreen[data-state=checked]]:relative group-has-[#toggle-fullscreen[data-state=checked]]:top-auto 
	
`

export default ScannerSettings
