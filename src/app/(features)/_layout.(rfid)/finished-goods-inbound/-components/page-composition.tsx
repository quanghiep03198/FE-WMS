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
	tw.div`w-full items-stretch grid grid-cols-1 @[1366px]/page-container:grid-cols-[2.5fr_1fr] gap-x-6 gap-y-10`

const Main: React.FC<React.ComponentProps<'div'>> = tw.div`flex flex-col items-stretch justify-start basis-full flex-1`

const InnerWrapper: React.FC<React.ComponentProps<'div'>> =
	tw.div`grid xl:grid-cols-2 lg:grid-cols-2 xxl:grid-rows-3 group-has-[#toggle-fullscreen[data-state=checked]]:grid-rows-[auto_auto_auto] xl:grid-rows-[auto_auto_auto] lg:grid-rows-3 gap-y-4 gap-x-6 lg:gap-x-4 flex-1`

const ListBoxPanel: React.FC<React.ComponentProps<'div'>> =
	tw.div`xl:col-span-1 xl:row-span-full xl:order-1 order-2 lg:col-span-1 lg:row-span-full lg:order-1 lg:max-h-full xl:max-h-full`

const CounterPanel: React.FC<React.ComponentProps<'div'>> = tw.div`
	flex-col gap-y-3 
	xl:col-span-1 xl:row-span-1 xl:order-2 order-1 xl:[&>*[data-slot=connection-insight]]:hidden
	lg:col-span-1 lg:row-span-1 lg:order-2 flex lg:[&>*[data-slot=connection-insight]]:hidden
	md:gap-y-0 md:[&>*[data-slot=epc-counter]]:rounded-b-none md:[&>*[data-slot=epc-counter-skeleton]]:rounded-b-none 
	md:[&>*[data-slot=connection-insight]]:mb-3 md:[&>*[data-slot=connection-insight]]:border-t-0 md:[&>*[data-slot=connection-insight]]:rounded-b-md md:[&>*[data-slot=connection-insight]]:rounded-t-none
	md:[&>*[data-slot=connection-insight]_*[data-slot=detail]]:flex md:[&>*[data-slot=connection-insight]_*[data-slot=detail]]:justify-center
	`

const FormPanel: React.FC<React.ComponentProps<'div'>> =
	tw.div`xl:col-span-1 xl:row-span-2 order-3 lg:col-span-1 lg:row-span-2`

export default {
	Container,
	Wrapper,
	InnerWrapper,
	Main,
	ListBoxPanel,
	CounterPanel,
	FormPanel
}
