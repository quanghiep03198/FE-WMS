import { Div, TDivProps } from '@/components/ui'
import tw from 'tailwind-styled-components'

const Container = tw(Div)<TDivProps>`grid grid-cols-3 gap-x-6 gap-y-10`

export default {
	Container
}
