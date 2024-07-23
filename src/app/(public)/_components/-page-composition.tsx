import tw from 'tailwind-styled-components'
import { navigationConfig, usePageContext } from '../_contexts/-page-context'
import Footer from './-footer'
import Header from './-header'

const PageComposition: React.FC = () => {
	const { menuRef, parentScrollRef, contentScrollRef } = usePageContext()

	return (
		<Container
			ref={(e) => {
				parentScrollRef.current = e
			}}>
			<Header />
			<Main
				ref={(e) => {
					contentScrollRef.current = e
				}}>
				{navigationConfig.map(({ href, Component }, index) => (
					<Wrapper
						id={href}
						key={href}
						ref={(el: HTMLDivElement) => {
							menuRef.current[index] = el
						}}>
						<Component />
					</Wrapper>
				))}
			</Main>

			<Footer />
		</Container>
	)
}

const Container = tw.div`relative h-screen z-10 overflow-y-auto scroll-m-2 scroll-smooth text-foreground antialiased scrollbar`
const Main = tw.div`mb-20 space-y-64`
const Wrapper = tw.div`relative h-full w-full`

export default PageComposition
