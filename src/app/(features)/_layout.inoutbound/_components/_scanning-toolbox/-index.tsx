import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQuerySelector from '@/common/hooks/useQuerySelector'
import { Icon, Toggle, Tooltip, Typography } from '@/components/ui'
import { useState } from 'react'
import tw from 'tailwind-styled-components'
import ConnectionInsight from './-connection-insight'
import SettingPanel from './-setting-panel'

const ScanningToolbox: React.FC = () => {
	return (
		<ToolbarWrapper>
			<ToolbarHeader>
				<Typography
					variant='h6'
					className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
					<Icon name='Settings2' size={18} />
					Toolbar
				</Typography>
				<ToolbarToggler />
			</ToolbarHeader>
			<ToolbarBody>
				<SettingPanel />
				<ConnectionInsight />
			</ToolbarBody>
		</ToolbarWrapper>
	)
}

const ToolbarToggler: React.FC = () => {
	const isLargeScreen = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)
	const sidebarTrigger = useQuerySelector<HTMLInputElement>('#sidebar-toggle')
	const [isToggled, setIsToggled] = useState<boolean>(false)

	return (
		isLargeScreen && (
			<Tooltip message={isToggled ? 'Unpin Toolbar' : 'Pin Toolbar'} contentProps={{ side: 'left' }}>
				<Toggle
					id='toggle-pin-toolbar'
					size='sm'
					className='peer/toggle-pin-toolbar group/toggle-pin-toolbar data-[state=on]:bg-transparent hover:text-foreground'
					onPressedChange={(value) => {
						if (sidebarTrigger && sidebarTrigger.checked) {
							sidebarTrigger.checked = false
						}
						setIsToggled(value)
					}}>
					<Icon name='Pin' className='block group-data-[state=on]/toggle-pin-toolbar:hidden' />
					<Icon name='PinOff' className='hidden group-data-[state=on]/toggle-pin-toolbar:block' />
				</Toggle>
			</Tooltip>
		)
	)
}

const ToolbarWrapper = tw.div`
	group mt-10 flex flex-col overflow-y-auto rounded-lg border bg-background scrollbar max-h-[60dvh]
	has-[#toggle-pin-toolbar[data-state=on]]:xl:max-h-[65dvh]
	has-[#toggle-pin-toolbar[data-state=on]]:xxl:max-h-[75dvh]
	has-[#toggle-pin-toolbar[data-state=on]]:mt-0 
	has-[#toggle-pin-toolbar[data-state=on]]:min-h-full
`

const ToolbarHeader = tw.div`sticky top-0 z-10 flex items-center justify-between gap-x-2 border-b bg-background px-4 py-2`

const ToolbarBody = tw.div`
	flex basis-full gap-10 p-4
	group-has-[#toggle-pin-toolbar[data-state=on]]:flex-col-reverse
	group-has-[#toggle-pin-toolbar[data-state=on]]:justify-end
	lg:flex-row xl:flex-row
	`
// sm:flex-col md:flex-col

export default ScanningToolbox
