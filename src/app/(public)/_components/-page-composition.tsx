import { Div } from '@/components/ui'
import tw from 'tailwind-styled-components'
import { navigationConfig, usePageContext } from '../_contexts/-page-context'
import Footer from './-footer'
import Header from './-header'
import Spotlight from './-spotlight'

const PageComposition: React.FC = () => {
	const pageContext = usePageContext()

	return (
		<Container ref={pageContext?.parentScrollRef}>
			<Spotlight fill='white' className='-top-20 left-0 z-[-1] xl:-top-40' />

			<Main ref={pageContext?.contentScrollRef}>
				<Header />
				<Div>
					{navigationConfig.map(({ href, SectionComponent }, index) => (
						<Wrapper
							id={href}
							key={href}
							ref={(el: HTMLDivElement) => {
								if (pageContext?.menuRef) pageContext.menuRef.current[index] = el
							}}>
							<SectionComponent />
						</Wrapper>
					))}
				</Div>
				<Footer />
			</Main>
		</Container>
	)
}

const Container = tw.div`relative h-screen z-10 overflow-hidden scroll-m-2 text-foreground antialiased`
const Main = tw.div`overflow-y-auto h-full scroll-smooth scrollbar-none flex flex-col items-stretch`
const Wrapper = tw.div`relative z-0 py-20 first:py-10 xxl:min-h-[70vh] sm:py-4 px-4 sm:mb-10 flex flex-grow justify-center items-stretch max-w-7xl xxl:max-w-8xl w-full mx-auto`

export default PageComposition
