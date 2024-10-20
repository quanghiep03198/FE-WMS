import tw from 'tailwind-styled-components'

const Container = tw.div`
	group flex-1 bg-background max-h-full items-stretch @container
	has-[#toggle-fullscreen[data-state=checked]]:fixed
	has-[#toggle-fullscreen[data-state=checked]]:p-6
	has-[#toggle-fullscreen[data-state=checked]]:z-50
	has-[#toggle-fullscreen[data-state=checked]]:inset-0
   has-[#toggle-fullscreen[data-state=checked]]:w-screen
   has-[#toggle-fullscreen[data-state=checked]]:h-screen
   has-[#toggle-fullscreen[data-state=checked]]:overflow-y-auto
	`
const Wrapper = tw.div`items-stretch grid grid-cols-1 @[1366px]:grid-cols-[2.5fr_1fr] gap-x-6 gap-y-10`
const Main = tw.div`flex flex-col gap-y-6 max-h-full items-stretch`
const InnerWrapper = tw.div`grid xl:grid-cols-2 lg:grid-cols-2 xl:grid-rows-3 lg:grid-rows-3 gap-y-4 gap-x-6 flex-1 `
const ListBoxPanel = tw.div`xl:col-span-1 xl:row-span-full xl:order-1 order-2 lg:col-span-1 lg:row-span-full lg:order-1 lg:max-h-full xl:max-h-full`
const CounterPanel = tw.div`xl:col-span-1 xl:row-span-1 xl:order-2 order-1 lg:col-span-1 lg:row-span-1 lg:order-2`
const FormPanel = tw.div`xl:col-span-1 xl:row-span-2 order-3 lg:col-span-1 lg:row-span-2`

export default {
	Container,
	Wrapper,
	InnerWrapper,
	Main,
	ListBoxPanel,
	CounterPanel,
	FormPanel
}
