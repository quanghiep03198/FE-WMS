import { Div, Icon, Skeleton } from '@/components/ui'
import tw from 'tailwind-styled-components'

const BrowserMockup: React.FC = () => {
	return (
		<Browser>
			<BrowserToolbar>
				<BrowserToolbarButton />
				<BrowserToolbarButton />
				<BrowserToolbarButton />
			</BrowserToolbar>
			<Layout>
				<LayoutSidebar className='sm:hidden'>
					<Icon name='Boxes' stroke='hsl(var(--border))' strokeWidth={0.75} size={36} className='mb-4' />
					<Skeleton className='h-3 w-full' />
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
						<ContentGridItem className='col-span-4 flex items-center justify-center sm:col-span-5'>
							<Icon
								name='ScanBarcode'
								strokeWidth={0.75}
								stroke='hsl(var(--border))'
								className='size-16 sm:size-12'
							/>
						</ContentGridItem>
						<ContentGridItem className='col-span-6 flex items-center justify-center sm:col-span-5'>
							<Icon
								name='ChartNoAxesCombined'
								strokeWidth={0.75}
								stroke='hsl(var(--border))'
								className='size-16 sm:size-14'
							/>
						</ContentGridItem>
						<ContentGridItem className='col-span-6 grid grid-cols-4 items-center gap-x-2 gap-y-3 p-6 sm:gap-x-4 sm:p-4'>
							{Array.from(new Array(12)).map((_, index) => (
								<Skeleton className='h-1.5 bg-secondary' key={index} />
							))}
						</ContentGridItem>
						<ContentGridItem className='col-span-4 flex items-center justify-center'>
							<Icon
								name='ChartPie'
								strokeWidth={0.75}
								stroke='hsl(var(--border))'
								className='size-16 sm:size-14'
							/>
						</ContentGridItem>
					</ContentGrid>
				</LayoutContent>
			</Layout>
		</Browser>
	)
}

const Browser = tw.div`grid xxl:h-[30rem] h-[26rem]  overflow-hidden w-full xxl:max-w-2xl max-w-xl grid-rows-[40px_auto] shadow-2xl divide-y divide-border rounded-[var(--radius)] border bg-background relative`
const BrowserToolbar = tw.div`relative z-10 flex items-center gap-x-2 bg-secondary p-4 h-full`
const BrowserToolbarButton = tw.div`size-3 rounded-full bg-background relative z-10`
const Layout = tw.div`grid flex-1 sm:grid-cols-1 grid-cols-[1fr_2.5fr] overflow-hidden items-stretch`
const LayoutSidebar = tw.div`flex h-full flex-col gap-4 border-r p-4 transition-height bg-background`
const LayoutContent = tw.div`flex w-full flex-col items-stretch space-y-2 bg-secondary/20`
const ContentGridItem = tw.div`relative w-full rounded-lg border fill-mode-both bg-background `
const ContentGrid = tw.div`grid h-full w-full flex-1 basis-full grid-cols-10 gap-3 overflow-hidden p-4`

export default BrowserMockup
