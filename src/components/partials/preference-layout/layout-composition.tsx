import tw from 'tailwind-styled-components'
import Heading from './heading'
import Navbar from './navbar'

const Container: React.FC<React.ComponentProps<'div'>> = tw.div`
	mx-auto h-screen container overflow-y-auto scrollbar max-w-full border-separate border-spacing-0
`

const MainSection: React.FC<React.ComponentProps<'section'>> =
	tw.div`h-full w-full flex-1 xxl:max-w-8xl max-w-7xl mx-auto`

const OutletWrapper: React.FC<React.ComponentProps<'div'>> =
	tw.div`z-0 xl:pl-96 py-6 flex-1 [view-transition-name:main-content]`

export default {
	Container,
	MainSection,
	OutletWrapper,
	Navbar,
	Heading
}
