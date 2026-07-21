import tw from 'tailwind-styled-components'

const Container: React.FC<React.ComponentProps<'div'>> = tw.div`
	@container/page-container group flex-1 bg-background items-stretch overflow-y-auto
	[--toolbar-height:48px]
	has-[#toggle-fullscreen[data-state=checked]]:fixed
	has-[#toggle-fullscreen[data-state=checked]]:p-6
	has-[#toggle-fullscreen[data-state=checked]]:z-50
	has-[#toggle-fullscreen[data-state=checked]]:inset-0
   has-[#toggle-fullscreen[data-state=checked]]:w-screen
   has-[#toggle-fullscreen[data-state=checked]]:h-screen
	has-[#toggle-fullscreen[data-state=checked]]:animate-in
	has-[#toggle-fullscreen[data-state=checked]]:fade-in-0
	has-[#toggle-fullscreen[data-state=unchecked]]:fade-out-0
	has-[#toggle-fullscreen[data-state=unchecked]]:zoom-out-95
`

const Wrapper: React.FC<React.ComponentProps<'div'>> =
	tw.div`w-full h-full items-stretch grid grid-cols-1 @[920px]/page-container:grid-cols-2 @[1366px]/page-container:grid-cols-3 gap-6`

export default { Container, Wrapper }
