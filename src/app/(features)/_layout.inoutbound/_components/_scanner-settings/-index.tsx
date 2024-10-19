import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQuerySelector from '@/common/hooks/use-query-selector'
import { Icon, Separator, Typography } from '@/components/ui'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import ConnectionInsight from './-connection-insight'
import SettingPanel from './-setting-panel'

const ScanningToolbox: React.FC = () => {
	const { t } = useTranslation()
	const isLargeScreen = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)
	const isExtraLargeScreen = useMediaQuery(PresetBreakPoints.ULTIMATE_LARGE)
	const sidebarTrigger = useQuerySelector<HTMLInputElement>('#sidebar-toggle')

	useEffect(() => {
		if (!sidebarTrigger) return
		if (!isLargeScreen || !isExtraLargeScreen) {
			sidebarTrigger.checked = false
		} else {
			sidebarTrigger.checked = true
		}
	}, [isLargeScreen, isExtraLargeScreen])

	return (
		<ToolbarWrapper>
			<ToolbarHeader>
				<Typography
					variant='h6'
					className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
					<Icon name='Settings2' size={18} />
					{t('ns_common:navigation.settings')}
				</Typography>
			</ToolbarHeader>
			<ToolbarBody>
				<SettingPanel />
				<Separator className='block lg:hidden' />
				<Separator orientation='vertical' className='xl:hidden' />
				<ConnectionInsight />
			</ToolbarBody>
		</ToolbarWrapper>
	)
}

const ToolbarWrapper = tw.div`group mt-10 flex flex-col rounded-lg border bg-background xl:max-h-[70dvh] xxl:max-h-[75dvh] overflow-y-auto xl:mt-0 xl:min-h-full`
const ToolbarHeader = tw.div`sticky top-0 z-10 flex items-center justify-between gap-x-2 border-b px-4 py-2 bg-background/80 backdrop-blur-sm rounded-t-lg`
const ToolbarBody = tw.div`flex items-stretch flex-grow gap-8 xl:basis-full p-4 xl:flex-col-reverse xl:justify-end sm:flex-col-reverse sm:justify-end md:flex-col-reverse md:justify-end`

export default ScanningToolbox
