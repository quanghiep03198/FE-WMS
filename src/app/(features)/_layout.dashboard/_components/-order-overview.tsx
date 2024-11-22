import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	Div,
	Typography
} from '@/components/ui'
import React, { useMemo } from 'react'
import { Label, Pie, PieChart } from 'recharts'
import { transactionOverview } from '../_mocks/-dashboard.data'

const chartConfig = {
	pending: {
		label: 'Pending',
		color: 'hsl(var(--chart-1))'
	},
	completed: {
		label: 'Completed',
		color: 'hsl(var(--chart-3))'
	},
	cancelled: {
		label: 'Cancelled',
		color: 'hsl(var(--chart-5))'
	}
} satisfies ChartConfig

const TransactionOverview: React.FC = () => {
	const totalVisitors = useMemo(() => {
		return transactionOverview.reduce((acc, curr) => acc + curr.quantity, 0)
	}, [])

	return (
		<Div className='col-span-full flex flex-col items-center justify-center space-y-6 lg:col-span-1 xl:col-span-1'>
			<Typography className='text-center font-medium'>Order Status Overview</Typography>
			<ChartContainer className='aspect-square h-full max-h-60' config={chartConfig}>
				<PieChart>
					<Pie
						data={transactionOverview}
						innerRadius={48}
						outerRadius={96}
						paddingAngle={2}
						nameKey='status'
						dataKey='quantity'>
						<Label
							content={({ viewBox }) => {
								if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
									return (
										<text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
											<tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-3xl font-bold'>
												{totalVisitors.toLocaleString()}
											</tspan>
											<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground'>
												Orders
											</tspan>
										</text>
									)
								}
							}}
						/>
					</Pie>
					<ChartTooltip content={<ChartTooltipContent />} />
					<ChartLegend content={<ChartLegendContent />} />
				</PieChart>
			</ChartContainer>
		</Div>
	)
}

export default TransactionOverview
