import tw from 'tailwind-styled-components'

const Container = tw.div`space-y-6`
const Main = tw.div`grid h-full xl:grid-cols-2 lg:grid-cols-2 h-[75vh] grid-flow-col xl:grid-rows-3 lg:grid-rows-3 gap-x-6 gap-y-10 grid-flow-row`
const ListBoxPanel = tw.div`xl:col-span-1 xl:row-span-full xl:order-1 order-2 xl:max-h-full lg:col-span-1 lg:row-span-full lg:order-1 order-2 lg:max-h-full h-full max-h-[60vh]`
const CounterPanel = tw.div`xl:col-span-1 xl:row-span-1 xl:order-2 order-1 lg:col-span-1 lg:row-span-1 lg:order-2 order-1 `
const FormPanel = tw.div`xl:col-span-1 xl:row-span-2 order-3 lg:col-span-1 lg:row-span-2 order-3`

export default {
	Container,
	Main,
	ListBoxPanel,
	CounterPanel,
	FormPanel
}
