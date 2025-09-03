import tw from 'tailwind-styled-components'

const Wrapper = tw.div<{
	orientation: 'horizontal' | 'vertical'
}>`
   flex flex-col rounded-lg border 
   ${(props) => (props.orientation === 'horizontal' ? 'flex-row' : 'flex-col')} 
   `
const Header = tw.div`p-6`
const Title = tw.h5`inline-flex items-center font-semibold [&_svg]:size-5 [&:has(svg)]:gap-x-2 text-lg text-foreground`
const Description = tw.p`text-muted-foreground`
const Content = tw.div`relative h-full w-full flex-1 place-content-center place-items-center overflow-hidden`
const Footer = tw.div`p-6`

export const VisualCard = {
	Wrapper,
	Content,
	Description,
	Header,
	Footer,
	Title
}
