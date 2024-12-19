import { Div, DivProps } from '@/components/ui'
import ScrollShadow, { ScrollShadowProps } from '@/components/ui/@custom/scroll-shadow'
import tw from 'tailwind-styled-components'

const Container = tw(Div)<DivProps>`
	@container relative flex h-screen items-stretch divide-x divide-border overflow-hidden transition-width duration-200 ease-in-out group/app-layout
`

const ScrollArea = tw(ScrollShadow)<ScrollShadowProps>`
	relative flex flex-grow flex-col overflow-y-auto !scrollbar-none overflow-x-hidden bg-background scrollbar scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary
`
const Main = tw(Div)<DivProps>`grid w-full flex-1 basis-full grid-rows-[80px_auto] overflow-hidden`

const OutletWrapper = tw.div`sm:px-4 px-6 py-4 flex-1 basis-full`

export default {
	Container,
	Main,
	ScrollArea,
	OutletWrapper
}
