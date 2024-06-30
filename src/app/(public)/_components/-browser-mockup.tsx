import { Div, Icon, Skeleton } from '@/components/ui'
import { useCallback, useState } from 'react'
import tw from 'tailwind-styled-components'

const BrowserMockup: React.FC = () => {
	const [isLeftSidePlaying, setLeftSidePlaying] = useState<boolean>(true)
	const [isRightSidePlaying, setIsRightSidePlaying] = useState<boolean>(false)

	setInterval(() => {
		setLeftSidePlaying(!isLeftSidePlaying)
	}, 2000)

	setInterval(() => {
		setIsRightSidePlaying(!isRightSidePlaying)
	}, 2000)

	const getAnimationPlayState = useCallback((isPlaying: boolean) => (isPlaying ? 'running' : 'paused'), [])

	return (
		<Browser>
			<BrowserToolbar>
				<BrowserToolbarButton />
				<BrowserToolbarButton />
				<BrowserToolbarButton />
			</BrowserToolbar>
			<Layout>
				<LayoutSidebar>
					<Icon name='Boxes' stroke='hsl(var(--border))' strokeWidth={1} size={36} className='mb-4' />
					<Skeleton className='h-3 w-1/2' />
					<Skeleton className='h-3 w-3/4' />
					<Skeleton className='h-3 w-full' />
					<Skeleton className='h-3 w-1/2' />
					<Skeleton className='h-3 w-3/4' />
					<Skeleton className='h-3 w-full' />
					<Skeleton className='h-3 w-1/2' />
				</LayoutSidebar>
				<LayoutContent>
					<Div className='flex items-start justify-between p-4'>
						<Div className='space-y-1'>
							<Skeleton className='h-2 w-36' />
							<Skeleton className='h-2 w-24' />
						</Div>
						<Div className='flex gap-x-1'>
							<Skeleton className='h-6 w-12 rounded' />
							<Skeleton className='h-6 w-12 rounded' />
						</Div>
					</Div>
					<ContentGrid>
						<ContentGridColumn>
							<AnimatedSection
								className='direction-alternate'
								style={{ animationPlayState: getAnimationPlayState(isLeftSidePlaying) }}
							/>
							<AnimatedSection
								className='direction-alternate'
								style={{ animationPlayState: getAnimationPlayState(isLeftSidePlaying) }}
							/>
							<AnimatedSection
								className='direction-alternate'
								style={{ animationPlayState: getAnimationPlayState(isLeftSidePlaying) }}
							/>
						</ContentGridColumn>
						<ContentGridColumn>
							<AnimatedSection
								className='direction-alternate-reverse'
								style={{ animationPlayState: getAnimationPlayState(isRightSidePlaying) }}
							/>
							<AnimatedSection
								className='direction-alternate-reverse'
								style={{ animationPlayState: getAnimationPlayState(isRightSidePlaying) }}
							/>
							<AnimatedSection
								className='direction-alternate-reverse'
								style={{ animationPlayState: getAnimationPlayState(isRightSidePlaying) }}
							/>
						</ContentGridColumn>
					</ContentGrid>
				</LayoutContent>
			</Layout>
		</Browser>
	)
}

const Browser = tw.div`grid h-[32rem] sm:h-[24rem] overflow-hidden w-full max-w-3xl grid-rows-[40px_auto] divide-y divide-border rounded-[var(--radius)] border bg-background relative`
const BrowserToolbar = tw.div`relative z-10 flex items-center gap-x-2 bg-secondary p-4 h-full`
const BrowserToolbarButton = tw.div`size-3 rounded-full bg-background relative z-10`
const Layout = tw.div`grid flex-1 grid-cols-[1fr_2.5fr] overflow-hidden items-stretch`
const LayoutSidebar = tw.div`flex h-full flex-col gap-4 border-r p-4 transition-height bg-background`
const LayoutContent = tw.div`flex w-full flex-col items-stretch space-y-2 bg-secondary/20`
const AnimatedSection = tw.div`animate-scale-y relative min-h-24 w-full rounded-lg border fill-mode-both bg-background `
const ContentGrid = tw.div`grid h-full w-full flex-1 basis-full grid-cols-2 gap-4 overflow-hidden p-4`
const ContentGridColumn = tw.div`flex h-full flex-col items-stretch gap-4`

export default BrowserMockup
