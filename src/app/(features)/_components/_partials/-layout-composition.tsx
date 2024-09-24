import { Div, DivProps } from '@/components/ui'
import tw from 'tailwind-styled-components'

const Container = tw(Div)<DivProps>`
	@container relative flex h-screen items-stretch divide-x divide-border overflow-hidden transition-width duration-200 ease-in-out group/app-layout
`

const Main = tw(Div)<DivProps>`
	relative flex max-w-full flex-1 flex-grow flex-col overflow-y-scroll overflow-x-hidden bg-background transition-width duration-200 ease-in-out scrollbar scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary
`
const OutletWrapper = tw(Div)<DivProps>`flex-1 basis-full py-4 px-6 sm:px-4`

export default {
	Container,
	Main,
	OutletWrapper
}
