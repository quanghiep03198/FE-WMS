import { Div } from '@/components/ui'
import tw from 'tailwind-styled-components'
import { navigationConfig, usePageContext } from '../-contexts/page-context'
import { ExploreRFIDAgentBanner } from './explore-rfid-agent-banner'
import Footer from './footer'
import Header from './header'
import LogoCloud from './logo-cloud'

const PageComposition: React.FC = () => {
	const pageContext = usePageContext()

	return (
		<Container
			ref={pageContext?.parentScrollRef}
			data-state='expanded'
			style={
				{
					'--primary-alt': 'hsl(var(--success))'
				} as React.CSSProperties
			}>
			<Main ref={pageContext?.contentScrollRef}>
				<ExploreRFIDAgentBanner />
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

const Container: React.FC<React.ComponentProps<'div'>> =
	tw.div`relative h-screen z-10 overflow-hidden scroll-m-2 text-foreground antialiased group`
const Main: React.FC<React.ComponentProps<'div'>> =
	tw.div`overflow-y-auto h-full scrollbar-none flex flex-col items-stretch`
const Wrapper: React.FC<React.ComponentProps<'div'>> = tw.div`relative z-0 xl:min-h-[80vh] xl:first:min-h-fit`

export default PageComposition
