import { Div } from '@/components/ui'
import tw from 'tailwind-styled-components'
import { navigationConfig, usePageContext } from '../-contexts/page-context'
import Footer from './footer'
import Header from './header'
import LogoCloud from './logo-cloud'

const PageComposition: React.FC = () => {
	const pageContext = usePageContext()

	return (
		<Container
			ref={pageContext?.parentScrollRef}
			data-state='expanded'
			style={{
				'--primary-alt': 'hsl(var(--success))'
			}}>
			{/* <Spotlight fill='white' className='-top-20 left-0 z-[-1] xl:-left-40 xl:-top-40' /> */}
			<Main ref={pageContext?.contentScrollRef}>
				<Header />
				<Div>
					{navigationConfig.map(({ href, SectionComponent }, index) => (
						<Wrapper
							id={href}
							key={href}
							ref={(el: HTMLDivElement) => {
								if (pageContext?.menuRef?.current) pageContext.menuRef.current[index] = el
							}}>
							<SectionComponent />
						</Wrapper>
					))}
				</Div>
				<LogoCloud />
				<Footer />
			</Main>
		</Container>
	)
}

const Container = tw.div`relative h-screen z-10 overflow-hidden scroll-m-2 text-foreground antialiased group`
const Main = tw.div`overflow-y-auto h-full scrollbar-none flex flex-col items-stretch`
const Wrapper = tw.div`relative z-0 py-20 first:py-10 xxl:min-h-[85vh] xl:min-h-[75vh] sm:mb-10 flex flex-grow justify-center items-stretch`

export default PageComposition
