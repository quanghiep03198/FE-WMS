import tw from 'tailwind-styled-components'
import { navigationConfig, usePageContext } from '../_contexts/-page-context'
import Footer from './-footer'
import Header from './-header'
import Spotlight from './-spotlight'

const PageComposition: React.FC = () => {
	const { menuRef, parentScrollRef, contentScrollRef } = usePageContext()

	return (
		<Container ref={parentScrollRef}>
			<Spotlight fill='white' className='-top-20 left-0 xl:-top-40' />

			<Main ref={contentScrollRef}>
				<Header />
				{navigationConfig.map(({ href, SectionComponent }, index) => (
					<Wrapper
						id={href}
						key={href}
						ref={(el: HTMLDivElement) => {
							menuRef.current[index] = el
						}}>
						<SectionComponent />
					</Wrapper>
				))}
				<Footer />
			</Main>
		</Container>
	)
}

const Container = tw.div`relative h-screen z-10 overflow-hidden scroll-m-2 text-foreground antialiased`
const Main = tw.div`overflow-y-auto h-full scroll-smooth scrollbar-none`
const Wrapper = tw.div`relative w-full mb-64`

export default PageComposition
