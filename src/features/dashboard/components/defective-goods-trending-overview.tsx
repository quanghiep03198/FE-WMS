// import { TrendingUp } from 'lucide-react'
// import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

// import { useDateLocale } from '@common/hooks/use-date-locale'
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// 	ChartContainer,
// 	ChartLegend,
// 	ChartLegendContent,
// 	ChartTooltip,
// 	ChartTooltipContent
// } from '@components/ui'
// import { format } from 'date-fns'
// import { capitalize } from 'lodash-es'
// import { useDefectiveCategoryChartConfig } from '../-hooks/use-defective-category-chart-configs'

// export const description = 'A stacked bar chart with a legend'

// const chartData = [
// 	{ month: 1, B: 186, C: 80, RD: 10 },
// 	{ month: 2, B: 305, C: 200, RD: 15 },
// 	{ month: 3, B: 237, C: 120, RD: 12 },
// 	{ month: 4, B: 73, C: 190, RD: 8 },
// 	{ month: 5, B: 209, C: 130, RD: 16 },
// 	{ month: 6, B: 214, C: 140, RD: 20 },
// 	{ month: 7, B: 240, C: 150, RD: 18 },
// 	{ month: 8, B: 150, C: 160, RD: 14 },
// 	{ month: 9, B: 230, C: 170, RD: 19 },
// 	{ month: 10, B: 250, C: 180, RD: 22 },
// 	{ month: 11, B: 260, C: 190, RD: 25 },
// 	{ month: 12, B: 270, C: 200, RD: 30 }
// ]

// const DefectiveGoodsTrendingOverview: React.FC = () => {
// 	const chartConfig = useDefectiveCategoryChartConfig()
// 	const dateLocale = useDateLocale()

// 	return (
// 		<Card>
// 			<CardHeader>
// 				<CardTitle></CardTitle>
// 				<CardDescription>January - June 2024</CardDescription>
// 			</CardHeader>
// 			<CardContent>
// 				<ChartContainer config={chartConfig} className='h-96 w-full'>
// 					<BarChart
// 						accessibilityLayer
// 						data={chartData.map((item) => ({
// 							...item,
// 							month: capitalize(
// 								format(new Date(new Date().getFullYear(), item.month - 1), 'MMMM', { locale: dateLocale })
// 							)
// 						}))}>
// 						<CartesianGrid vertical={false} />
// 						<XAxis dataKey='month' tickLine={false} tickMargin={10} axisLine={false} />
// 						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
// 						<ChartLegend content={<ChartLegendContent />} />
// 						<Bar dataKey='B' stackId='a' fill='var(--color-B)' radius={[0, 0, 3, 3]} />
// 						<Bar dataKey='C' stackId='a' fill='var(--color-C)' radius={[0, 0, 0, 0]} />
// 						<Bar dataKey='RD' stackId='a' fill='var(--color-RD)' radius={[3, 3, 0, 0]} />
// 					</BarChart>
// 				</ChartContainer>
// 			</CardContent>
// 			<CardFooter className='flex-col items-start gap-2 text-sm'>
// 				<div className='flex gap-2 font-medium leading-none'>
// 					Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
// 				</div>
// 				<div className='leading-none text-muted-foreground'>Showing total visitors for the last 6 months</div>
// 			</CardFooter>
// 		</Card>
// 	)
// }

// export default DefectiveGoodsTrendingOverview
