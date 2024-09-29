import { SIDEBAR_TOGGLE_CHANGE } from '@/app/(features)/_constants/event.const'
import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQuerySelector from '@/common/hooks/useQuerySelector'
import { Icon, Separator, Toggle, Tooltip, Typography } from '@/components/ui'
import { useEventListener } from 'ahooks'
import { useEffect, useState } from 'react'
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
					Toolbox
				</Typography>
				<ToolbarToggler />
			</ToolbarHeader>
			<ToolbarBody>
				<SettingPanel />
				<Separator className='hidden group-has-[#toggle-pin-toolbar[data-state=on]]:block sm:block md:block' />
				<Separator
					orientation='vertical'
					className='group-has-[#toggle-pin-toolbar[data-state=on]]:hidden sm:hidden md:hidden'
				/>
				<ConnectionInsight />
			</ToolbarBody>
		</ToolbarWrapper>
	)
}

const ToolbarToggler: React.FC = () => {
	const isLargeScreen = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)
	const isExtraLargeScreen = useMediaQuery(PresetBreakPoints.ULTIMATE_LARGE)
	const sidebarTrigger = useQuerySelector<HTMLInputElement>('#sidebar-toggle')
	const [isToggled, setIsToggled] = useState<boolean>(isExtraLargeScreen)

	useEventListener(SIDEBAR_TOGGLE_CHANGE, (e: CustomEvent<boolean>) => setIsToggled(!e.detail || isExtraLargeScreen))

	useEffect(() => {
		if ((!isLargeScreen || !isExtraLargeScreen) && isToggled) setIsToggled(!isToggled)
	}, [isLargeScreen, isExtraLargeScreen])

	return (
		isLargeScreen && (
			<Tooltip message={isToggled ? 'Unpin Toolbar' : 'Pin Toolbar'} contentProps={{ side: 'left' }}>
				<Toggle
					id='toggle-pin-toolbar'
					size='sm'
					pressed={isToggled}
					className='group/toggle-pin-toolbar data-[state=on]:bg-transparent hover:text-foreground'
					onPressedChange={(value) => {
						if (sidebarTrigger && sidebarTrigger.checked && !isExtraLargeScreen) {
							sidebarTrigger.checked = !value
						}
						setIsToggled(value)
					}}>
					<Icon name={isToggled ? 'PinOff' : 'Pin'} />
				</Toggle>
			</Tooltip>
		)
	)
}

const ToolbarWrapper = tw.div`
	group mt-10 flex flex-col rounded-lg border bg-background
	has-[#toggle-pin-toolbar[data-state=on]]:xl:max-h-[70dvh]
	has-[#toggle-pin-toolbar[data-state=on]]:xxl:max-h-[75dvh]
	has-[#toggle-pin-toolbar[data-state=on]]:overflow-y-auto
	has-[#toggle-pin-toolbar[data-state=on]]:mt-0 
	has-[#toggle-pin-toolbar[data-state=on]]:min-h-full
`

const ToolbarHeader = tw.div`sticky top-0 z-10 flex items-center justify-between gap-x-2 border-b px-4 py-2 bg-background/80 backdrop-blur-sm rounded-t-lg`

const ToolbarBody = tw.div`
	flex items-stretch flex-grow gap-10 basis-full p-4 lg:flex-row xl:flex-row flex-col-reverse 
	group-has-[#toggle-pin-toolbar[data-state=on]]:flex-col-reverse
	group-has-[#toggle-pin-toolbar[data-state=on]]:justify-end
	group-has-[#toggle-pin-toolbar[data-state=on]]:max-h-none
`

export default ScanningToolbox
