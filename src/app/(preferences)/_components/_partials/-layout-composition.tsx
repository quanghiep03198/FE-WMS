import { Div, ScrollArea, TDivProps } from '@/components/ui'
import tw from 'tailwind-styled-components'
import Heading from './-heading'
import Sidebar from './-navbar'

const Container = tw(Div)<TDivProps>`
mx-auto h-screen container overflow-y-auto scrollbar max-w-full border-separate border-spacing-0`

const MainSection = tw(Div)<TDivProps>`h-full w-full flex-1 xxl:max-w-8xl max-w-7xl mx-auto`

const OutletWrapper = tw(Div)<TDivProps>`xl:pl-96 py-6 flex-1`

export default {
	Container,
	MainSection,
	OutletWrapper,
	Sidebar,
	Heading
}
