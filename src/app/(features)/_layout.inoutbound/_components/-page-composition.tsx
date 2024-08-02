import { memo } from 'react'
import tw from 'tailwind-styled-components'

const Container = memo(tw.div`space-y-6 flex-1`)
const Main = tw.div`grid xl:grid-cols-2 lg:grid-cols-2 xl:grid-rows-3 lg:grid-rows-3 gap-y-4 gap-x-6 xl:h-[75dvh] lg:h-[75dvh]`
const ListBoxPanel = tw.div`xl:col-span-1 xl:row-span-full xl:order-1 order-2 lg:col-span-1 lg:row-span-full lg:order-1 lg:max-h-full xl:max-h-full`
const CounterPanel = tw.div`xl:col-span-1 xl:row-span-1 xl:order-2 order-1 lg:col-span-1 lg:row-span-1 lg:order-2`
const FormPanel = tw.div`xl:col-span-1 xl:row-span-2 order-3 lg:col-span-1 lg:row-span-2`

export default {
	Container,
	Main,
	ListBoxPanel,
	CounterPanel,
	FormPanel
}
