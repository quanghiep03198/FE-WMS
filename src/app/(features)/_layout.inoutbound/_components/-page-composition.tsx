import tw from 'tailwind-styled-components'

const Container = tw.div`space-y-6`
const Main = tw.div`grid h-full xl:grid-cols-2 h-[70vh] grid-flow-col xl:grid-rows-3 gap-4 grid-flow-row`
const ListBoxPanel = tw.div`xl:col-span-1 xl:row-span-full xl:order-1 order-2 xl:max-h-full h-full max-h-[60vh]`
const CounterPanel = tw.div`xl:col-span-1 xl:row-span-1 xl:order-2 order-1`
const FormPanel = tw.div`xl:col-span-1 xl:row-span-2 order-3`

export default {
	Container,
	Main,
	ListBoxPanel,
	CounterPanel,
	FormPanel
}
