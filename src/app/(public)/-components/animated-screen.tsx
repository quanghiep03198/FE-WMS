import AppLogo from '@/components/shared/app-logo'
import {
	Badge,
	Breadcrumb,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	Icon,
	Separator,
	Typography
} from '@/components/ui'
import { cn } from '@common/utils/cn'
import formatIntlNumber from '@common/utils/format-intl-number'
import { HomeIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { capitalize } from 'lodash-es'
import React from 'react'
import { createPortal } from 'react-dom'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const inoutboundOverviewData = [
	{ month: 1, inbound_qty: 5000, outbound_qty: 6000 },
	{ month: 2, inbound_qty: 7000, outbound_qty: 4000 },
	{ month: 3, inbound_qty: 7500, outbound_qty: 4000 },
	{ month: 4, inbound_qty: 6500, outbound_qty: 7000 },
	{ month: 5, inbound_qty: 5000, outbound_qty: 8000 },
	{ month: 6, inbound_qty: 7000, outbound_qty: 4000 },
	{ month: 7, inbound_qty: 10000, outbound_qty: 5000 },
	{ month: 8, inbound_qty: 4000, outbound_qty: 5500 },
	{ month: 9, inbound_qty: 8500, outbound_qty: 6500 },
	{ month: 10, inbound_qty: 7500, outbound_qty: 4000 },
	{ month: 11, inbound_qty: 4000, outbound_qty: 3000 },
	{ month: 12, inbound_qty: 6000, outbound_qty: 2500 }
]

const AnimatedScreen: React.FC = () => {
	return (
		<>
			{createPortal(
				<style>
					{
						/* CSS */ `
                  @keyframes fly-down {
                     from {
                        opacity: 0.25;
                        filter: blur(4px);
                        transform: perspective(1024px) translate3d(8rem, -16rem, 8rem) scale(0.8);
                     }
                     to {
                        opacity: 1;
                        filter: none;
                        transform: perspective(1920px) translate3d(0, 0, 0) scale(1);
                     }
                  }
                  `
					}
				</style>,
				document.head
			)}
			<div
				style={{
					overflow: 'visible',
					transformStyle: 'preserve-3d'
				}}
				className={cn(
					'pointer-events-none relative grid aspect-square h-auto max-h-240 rotate-45 select-none grid-cols-[18rem_auto] grid-rows-[80px_auto] gap-y-4 overflow-visible rounded-xl border bg-background antialiased *:pointer-events-none *:select-none',
					'sm:zoom-[0.5] md:zoom-[0.8] lg:zoom-[0.6] xl:zoom-[0.8] xxl:zoom-[1]',
					'transform-[perspective(1920px)_translateX(15%)_translateY(-20%)_rotateX(50deg)_rotateY(-20deg)_rotateZ(-35deg)]',
					'lg:transform-[perspective(1920px)_translateX(10%)_translateY(-30%)_rotateX(50deg)_rotateY(-20deg)_rotateZ(-35deg)]',
					'md:transform-[perspective(1920px)_translateX(10%)_translateY(-35%)_rotateX(50deg)_rotateY(-20deg)_rotateZ(-35deg)]',
					'sm:transform-[perspective(1920px)_translateX(15%)_translateY(-40%)_rotateX(50deg)_rotateY(-20deg)_rotateZ(-35deg)]',
					'via-25% to-50% after:absolute after:inset-0 after:z-10 after:h-[calc(100%+4px)] after:w-[200%] after:-translate-y-px after:bg-linear-to-l after:from-background after:via-background/80 after:to-transparent md:via-65% md:after:to-background/50 lg:after:via-background lg:after:via-60% lg:after:to-70%'
				)}>
				<aside className='z-0 col-start-1 row-span-full animate-[fly-down_0.7s_ease_forwards] space-y-10 border-r p-4 text-sm paused group-aria-current/cta:running'>
					<div data-slot='sidebar-header'>
						<AppLogo />
					</div>
					<div
						data-slot='sidebar-menu'
						className='space-y-8 [&>*[data-slot=sidebar-menu-group]]:space-y-4 [&_*[data-slot=menu-item]>svg]:size-[18px] [&_*[data-slot=menu-item]]:flex [&_*[data-slot=menu-item]]:items-center [&_*[data-slot=menu-item]]:gap-x-2 [&_*[data-slot=menu-label]]:text-xs [&_*[data-slot=menu-label]]:font-medium [&_*[data-slot=menu-label]]:text-muted-foreground [&_*[data-slot=menu]]:space-y-3'>
						<div data-slot='sidebar-menu-group'>
							<h4 data-slot='menu-label'>Main</h4>
							<ul data-slot='menu'>
								<li data-slot='menu-item'>
									<Icon name='Gauge' /> Dashboard
								</li>
								<li data-slot='menu-item'>
									<Icon name='LayoutList' /> Common management
								</li>
								<li data-slot='menu-item'>
									<Icon name='Blocks' /> RFID system
								</li>
								<li data-slot='menu-item'>
									<Icon name='Files' /> Reports
								</li>
								<li data-slot='menu-item'>
									<Icon name='Container' /> Truckload delivery management
								</li>
								<li data-slot='menu-item'>
									<Icon name='FileSearch' /> Seeking
								</li>
							</ul>
						</div>
						<Separator />
						<div data-slot='sidebar-menu-group'>
							<h4 data-slot='menu-label'>Integration</h4>
							<ul data-slot='menu'>
								<li data-slot='menu-item'>
									<Icon name='Link' /> i-MES system
								</li>
							</ul>
						</div>
						<Separator />
						<div data-slot='sidebar-menu-group'>
							<h4 data-slot='menu-label'>Administration</h4>
							<ul data-slot='menu'>
								<li data-slot='menu-item'>
									<Icon name='Users' /> Access management
								</li>
								<li data-slot='menu-item'>
									<Icon name='ChartNetwork' /> System monitoring
								</li>
							</ul>
						</div>
						<Separator />
						<div data-slot='sidebar-menu-group'>
							<h4 data-slot='menu-label'>Preference</h4>
							<ul data-slot='menu'>
								<li data-slot='menu-item'>
									<Icon name='Keyboard' /> Keyboard shortcuts
								</li>
								<li data-slot='menu-item'>
									<Icon name='Settings' /> Settings
								</li>
							</ul>
						</div>
					</div>
				</aside>
				<header className='z-0 col-start-2 mb-4 animate-[fly-down_0.7s_ease_forwards] p-4 paused group-aria-current/cta:running'>
					<nav className='flex items-center gap-x-2 rounded-md border px-4 py-3'>
						<button>
							<Icon name='Menu' />
						</button>
						<Separator orientation='vertical' className='h-4 w-1' />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbLink href='#'>
									<HomeIcon className='size-[1.135rem]' />
								</BreadcrumbLink>
								<BreadcrumbSeparator />
								<BreadcrumbLink className='text-primary'>Dashboard</BreadcrumbLink>
							</BreadcrumbList>
						</Breadcrumb>
					</nav>
				</header>
				<main className='z-0 col-start-2 h-fit space-y-6 p-4 pt-0'>
					<div className='animate-[fly-down_0.7s_ease_forwards] space-y-1 paused group-aria-current/cta:running'>
						<h1 className='text-xl font-semibold'>Dashboard</h1>
						<small className='line-clamp-1 leading-none text-muted-foreground'>
							Providing an overview of key metrics including statistics, analysis, inbound/outbound operations
							and more.
						</small>
					</div>
					<Separator />
					<section className='flex items-stretch gap-x-4 [&>*[data-slot=card]]:min-w-72'>
						<Card className='animate-[fly-down_0.8s_ease-in-out_forwards] paused group-aria-current/cta:running'>
							<CardHeader>
								<CardDescription>Inbound Quantity</CardDescription>
								<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
									{formatIntlNumber(61204)}
								</CardTitle>
								<CardAction>
									<Badge variant='outline'>
										<Icon name='TrendingUp' className='stroke-success' /> +12%
									</Badge>
								</CardAction>
							</CardHeader>
							<CardFooter className='flex-col items-start gap-1.5 text-sm'>
								<Typography variant='small' className='line-clamp-1 flex gap-2 font-medium'>
									Higher than last month
									<Icon name='TrendingUp' />
								</Typography>
								<Typography variant='small' className='lowercase text-muted-foreground first-letter:uppercase'>
									Significantly increased by 612 (prs) compared to previous period
								</Typography>
							</CardFooter>
						</Card>
						<Card className='animate-[fly-down_0.9s_ease-in-out_forwards] paused group-aria-current/cta:running'>
							<CardHeader>
								<CardDescription>Outbound Quantity</CardDescription>
								<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
									{formatIntlNumber(3198)}
								</CardTitle>
								<CardAction>
									<Badge variant='outline'>
										<Icon name='TrendingDown' className='stroke-success' /> +19%
									</Badge>
								</CardAction>
							</CardHeader>
							<CardFooter className='flex-col items-start gap-1.5 text-sm'>
								<Typography variant='small' className='line-clamp-1 flex gap-2 font-medium'>
									Higher than last month
									<Icon name='TrendingUp' />
								</Typography>
								<Typography variant='small' className='lowercase text-muted-foreground first-letter:uppercase'>
									Slightly decreased by 608 (prs) compared to previous period
								</Typography>
							</CardFooter>
						</Card>
					</section>
					<section>
						<Card
							data-role='card'
							className='min-w-128 animate-[fly-down_1s_ease-in-out_forwards] paused group-aria-current/cta:running'>
							<CardHeader>
								<CardTitle>Inbound overview</CardTitle>
								<CardDescription className='capitalize'>
									{format(new Date(new Date().getFullYear(), 0), 'MMMM')}
									{' - '}
									{format(new Date(new Date().getFullYear(), 11), 'MMMM')} {new Date().getFullYear()}
								</CardDescription>
							</CardHeader>
							<CardContent className='relative w-full max-w-2xl'>
								<ChartContainer
									className='h-96 xl:h-80'
									config={{
										inbound_qty: {
											label: 'Inbound Quantity',
											color: 'var(--chart-1)'
										},
										outbound_qty: {
											label: 'Outbound Quantity',
											color: 'var(--chart-2)'
										}
									}}>
									<BarChart
										accessibilityLayer
										data={inoutboundOverviewData.map((item) => ({
											...item,
											month: capitalize(format(new Date(new Date().getFullYear(), item.month - 1), 'MMM'))
										}))}>
										<CartesianGrid vertical={false} />
										<XAxis dataKey='month' tickLine={false} tickMargin={10} axisLine={false} />
										<YAxis stroke='var(--muted-foreground)' tickFormatter={formatIntlNumber} />
										<Bar
											dataKey='inbound_qty'
											fill='var(--color-inbound_qty)'
											radius={3}
											isAnimationActive={false}
										/>
										<Bar
											dataKey='outbound_qty'
											fill='var(--color-outbound_qty)'
											radius={3}
											isAnimationActive={false}
										/>
										<ChartLegend content={<ChartLegendContent />} formatter={capitalize} />
									</BarChart>
								</ChartContainer>
							</CardContent>
						</Card>
					</section>
				</main>
			</div>
		</>
	)
}

export default AnimatedScreen
