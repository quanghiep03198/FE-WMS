'use client'

import { TrendingUp } from 'lucide-react'
import { Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui'

export const description = 'A donut chart with an active sector'

const chartData = [
	{ browser: 'completed', visitors: 275, fill: 'var(--color-completed)' },
	{ browser: 'incomplete', visitors: 200, fill: 'var(--color-incomplete)' }
]

const chartConfig = {
	visitors: {
		label: 'Visitors'
	},
	completed: {
		label: 'Chrome',
		color: 'hsl(var(--chart-1))'
	},
	incomplete: {
		label: 'Safari',
		color: 'hsl(var(--chart-2))'
	}
} satisfies ChartConfig

export function ChartPieDonutActive() {
	return (
		<Card className='flex flex-col'>
			<CardHeader className='items-center pb-0'>
				<CardTitle>Pie Chart - Donut Active</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px]'>
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Pie
							data={chartData}
							dataKey='visitors'
							nameKey='browser'
							innerRadius={60}
							strokeWidth={5}
							activeIndex={0}
							activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
								<Sector {...props} outerRadius={outerRadius + 10} />
							)}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className='flex-col gap-2 text-sm'>
				<div className='flex items-center gap-2 font-medium leading-none'>
					Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
				</div>
				<div className='leading-none text-muted-foreground'>Showing total visitors for the last 6 months</div>
			</CardFooter>
		</Card>
	)
}
