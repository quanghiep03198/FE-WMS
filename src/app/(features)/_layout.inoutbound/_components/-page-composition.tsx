import tw from 'tailwind-styled-components'

const Container = tw.div`space-y-6 flex-1`
const Main = tw.div`grid xl:grid-cols-12 lg:grid-cols-2 xl:grid-rows-3 lg:grid-rows-4 gap-4 h-[75vh]`
const ListBoxPanel = tw.div`xl:col-span-7 xl:row-span-full xl:order-1 order-2 lg:col-span-1 lg:row-span-full lg:order-1`
const CounterPanel = tw.div`xl:col-span-5 xl:row-span-1 xl:order-2 order-1 lg:col-span-1 lg:row-span-1 lg:order-2`
const FormPanel = tw.div`xl:col-span-5 xl:row-span-2 order-3 lg:col-span-1 lg:row-span-2`

export default {
	Container,
	Main,
	ListBoxPanel,
	CounterPanel,
	FormPanel
}
