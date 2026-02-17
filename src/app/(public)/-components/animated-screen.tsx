import AppLogo from '@/app/-components/-shared/app-logo'
import formatIntlNumber from '@/common/utils/format-intl-number'
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
import { HomeIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { capitalize } from 'lodash-es'
import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const inoutboundOverviewData = [
	{ month: 1, inbound_qty: 4000, outbound_qty: 2400 },
	{ month: 2, inbound_qty: 3000, outbound_qty: 1398 },
	{ month: 3, inbound_qty: 2000, outbound_qty: 9800 },
	{ month: 4, inbound_qty: 2780, outbound_qty: 3908 },
	{ month: 5, inbound_qty: 1890, outbound_qty: 4800 },
	{ month: 6, inbound_qty: 2390, outbound_qty: 3800 },
	{ month: 7, inbound_qty: 3490, outbound_qty: 4300 },
	{ month: 8, inbound_qty: 3000, outbound_qty: 1398 },
	{ month: 9, inbound_qty: 2000, outbound_qty: 9800 },
	{ month: 10, inbound_qty: 2780, outbound_qty: 3908 },
	{ month: 11, inbound_qty: 1890, outbound_qty: 4800 },
	{ month: 12, inbound_qty: 2390, outbound_qty: 3800 }
]

const AnimatedScreen: React.FC = () => {
	return (
		<div
			style={{
				maskImage: 'linear-gradient(to right, hsl(var(--background)) 10%,hsl(var(--background)) 90%, transparent)',
				transform: 'translateX(10%) translateY(-5%) rotateX(50deg) rotateY(-5deg) rotateZ(-45deg)'
			}}
			className='pointer-events-none relative grid aspect-square max-w-3xl rotate-45 select-none grid-cols-[1fr_2fr] grid-rows-[64px_auto] rounded-md border bg-background antialiased *:pointer-events-none *:select-none xxl:[zoom:1.15]'>
			<style>
				{
					/* CSS */ `
                  @keyframes fly-down{
                     0%{
                        opacity: 0.5;
                        filter: blur(4px);
                        transform: translate3d(12rem, -12rem, -24rem);
                     }
                     100%{
                        opacity: 1;
                        filter: blur(0px);
                        transform: translate3d(0, 0, 0);
                     }
                  }
                  `
				}
			</style>
			<aside className='col-start-1 row-span-full animate-[fly-down_0.5s_ease_forwards] space-y-6 border-r p-4 text-sm duration-500'>
				<div data-slot='sidebar-header'>
					<AppLogo />
				</div>
				<div
					data-slot='sidebar-menu'
					className='space-y-6 [&_*[data-slot=menu-item]]:flex [&_*[data-slot=menu-item]]:items-center [&_*[data-slot=menu-item]]:gap-x-2 [&_*[data-slot=menu-label]]:font-medium [&_*[data-slot=menu-label]]:text-muted-foreground [&_*[data-slot=menu]]:space-y-2'>
					<div data-slot='sidebar-menu-group' className='space-y-2'>
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
								<Icon name='Truck' /> Deliver management
							</li>
							<li data-slot='menu-item'>
								<Icon name='FileSearch' /> Seeking
							</li>
						</ul>
					</div>
					<Separator />
					<div data-slot='sidebar-menu-group' className='space-y-2'>
						<h4 data-slot='menu-label'>Integration</h4>
						<ul data-slot='menu'>
							<li data-slot='menu-item'>
								<Icon name='Link' /> i-MES system
							</li>
						</ul>
					</div>
					<Separator />
					<div data-slot='sidebar-menu-group' className='space-y-2'>
						<h4 data-slot='menu-label'>Administration</h4>
						<ul data-slot='menu'>
							<li data-slot='menu-item'>
								<Icon name='Users' /> Access management
							</li>
							<li data-slot='menu-item'>
								<Icon name='ChartSpline' /> System monitoring
							</li>
						</ul>
					</div>
				</div>
			</aside>
			<header className='col-start-2 animate-[fly-down_0.5s_ease_forwards] p-4'>
				<nav className='flex items-center gap-x-2 rounded-md border p-2'>
					<button>
						<Icon name='Menu' />
					</button>
					<Separator orientation='vertical' className='h-4' />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbLink href='#'>
								<HomeIcon className='size-[1.135rem]' />
							</BreadcrumbLink>
							<BreadcrumbSeparator />
							<BreadcrumbLink>Dashboard</BreadcrumbLink>
						</BreadcrumbList>
					</Breadcrumb>
				</nav>
			</header>
			<main
				style={{
					maskImage:
						'linear-gradient(to bottom, hsl(var(--background)) 10%, hsl(var(--background)) 90%,transparent)'
				}}
				className='col-start-2 space-y-4 overflow-hidden p-4 pt-0 @container'>
				<section className='flex flex-nowrap gap-x-4 [&>*[data-slot=card]]:min-w-72 [&>*[data-slot=card]]:flex-1'>
					<Card className='animate-[fly-down_0.75s_ease-in-out_forwards]'>
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
					<Card className='animate-[fly-down_0.85s_ease-in-out_forwards]'>
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
					<Card data-role='card' className='animate-[fly-down_0.95s_ease-in-out_forwards]'>
						<CardHeader>
							<CardTitle>Inbound overview</CardTitle>
							<CardDescription className='capitalize'>
								{format(new Date(new Date().getFullYear(), 0), 'MMMM')}
								{' - '}
								{format(new Date(new Date().getFullYear(), 11), 'MMMM')} {new Date().getFullYear()}
							</CardDescription>
						</CardHeader>
						<CardContent className='relative w-full'>
							<ChartContainer
								className='w-full @xs:h-72 @xl:h-96 @3xl:max-h-full @3xl:min-h-[26rem]'
								config={{
									inbound_qty: {
										label: 'Inbound Quantity',
										color: 'hsl(var(--chart-1))'
									},
									outbound_qty: {
										label: 'Outbound Quantity',
										color: 'hsl(var(--chart-2))'
									}
								}}>
								<BarChart
									accessibilityLayer
									data={inoutboundOverviewData.map((item) => ({
										...item,
										month: capitalize(format(new Date(new Date().getFullYear(), item.month - 1), 'MMMM'))
									}))}>
									<CartesianGrid vertical={false} />
									<XAxis dataKey='month' tickLine={false} tickMargin={10} axisLine={false} />

									<YAxis stroke='hsl(var(--muted-foreground))' tickFormatter={formatIntlNumber} />
									<Bar dataKey='inbound_qty' fill='var(--color-inbound_qty)' radius={3} />
									<Bar dataKey='outbound_qty' fill='var(--color-outbound_qty)' radius={3} />
									<ChartLegend content={<ChartLegendContent />} formatter={capitalize} />
								</BarChart>
							</ChartContainer>
						</CardContent>
					</Card>
				</section>
			</main>
		</div>
	)
}

export default AnimatedScreen
