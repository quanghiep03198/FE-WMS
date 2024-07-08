import { Div, DivProps } from '@/components/ui'
import tw from 'tailwind-styled-components'
import Heading from './-heading'
import Navbar from './-navbar'

const Container = tw(Div)<DivProps>`
	mx-auto h-screen container overflow-y-auto scrollbar max-w-full border-separate border-spacing-0
`

const MainSection = tw(Div)<DivProps>`h-full w-full flex-1 xxl:max-w-8xl max-w-7xl mx-auto`

const OutletWrapper = tw(Div)<DivProps>`xl:pl-96 py-6 flex-1`

export default {
	Container,
	MainSection,
	OutletWrapper,
	Navbar,
	Heading
}
