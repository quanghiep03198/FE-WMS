'use client'

import { TrendingUp } from 'lucide-react'
import { Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	Div,
	Select,
	SelectTrigger,
	SelectValue
} from '@/components/ui'
import { DefectiveCategory } from '../../_layout.(defective-goods)/-constants'

export const description = 'A donut chart with an active sector'

const chartData = [
	{ category: 'B', visitors: 275, fill: 'var(--color-B)' },
	{ category: 'C', visitors: 200, fill: 'var(--color-C)' },
	{ category: 'RD', visitors: 187, fill: 'var(--color-RD)' }
]

const chartConfig = {
	B: {
		label: 'B',
		color: 'hsl(var(--chart-1))'
	},
	C: {
		label: 'C',
		color: 'hsl(var(--chart-2))'
	},
	RD: {
		label: 'RD',
		color: 'hsl(var(--chart-3))'
	}
} satisfies ChartConfig

export function ChartPieDonutActive() {
	return (
		<Card className='flex h-full flex-col'>
			<CardHeader className='items-center pb-0'>
				<CardTitle>Defective goods inventory overview</CardTitle>
				<CardDescription>January - June 2024</CardDescription>
				<CardAction>
					<Select defaultValue={DefectiveCategory.B_GRADE}>
						<SelectTrigger>
							<SelectValue placeholder='Select category' />
						</SelectTrigger>
					</Select>
				</CardAction>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-64'>
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
				<Div className='flex items-center gap-2 font-medium leading-none'>
					Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
				</Div>
				<Div className='leading-none text-muted-foreground'>Showing total visitors for the last 6 months</Div>
			</CardFooter>
		</Card>
	)
}
