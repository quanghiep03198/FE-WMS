import { Div, DivProps } from '@/components/ui'
import tw from 'tailwind-styled-components'

const Container = tw(Div)<DivProps>`
	relative flex max-h-screen items-stretch divide-x divide-border overflow-y-auto transition-width duration-200 ease-in-out
`

const Main = tw(Div)<DivProps>`
	relative flex max-w-full flex-1 flex-col overflow-y-auto bg-background transition-width duration-200 ease-in-out scrollbar scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary
`
const OutletWrapper = tw(Div)<DivProps>`flex-1 py-4 px-6 sm:px-2`

export default {
	Container,
	Main,
	OutletWrapper
}
