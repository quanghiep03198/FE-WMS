import { Div, TDivProps } from '@/components/ui'
import tw from 'tailwind-styled-components'

const Container = tw(Div)<TDivProps>`
	relative flex max-h-screen items-stretch divide-x divide-border overflow-y-auto transition-width duration-200 ease-in-out
	`

const Main = tw(Div)<TDivProps>`
	relative flex max-w-full flex-1 flex-col overflow-y-auto bg-background transition-width duration-200 ease-in-out scrollbar scrollbar-track-transparent scrollbar-thumb-border dark:scrollbar-thumb-secondary
`
const OutletWrapper = tw(Div)<TDivProps>`flex-1 p-6 sm:p-2`

export default {
	Container,
	Main,
	OutletWrapper
}
