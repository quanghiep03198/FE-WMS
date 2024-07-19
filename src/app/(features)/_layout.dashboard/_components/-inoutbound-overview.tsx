import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	Div,
	Icon,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui'
import _ from 'lodash'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import tw from 'tailwind-styled-components'
import { annuallInOutBoundStatistics } from '../_mocks/-dashboard.data'

const chartConfig = {
	import: {
		label: 'Import',
		color: 'hsl(var(--chart-1))'
	},
	export: {
		label: 'Export',
		color: 'hsl(var(--chart-2))'
	}
} satisfies ChartConfig

const InoutboundOverview: React.FC = () => {
	return (
		<Card className='col-span-full max-h-full xl:col-span-2'>
			<CardHeader>
				<CardTitle>Import/Export Overview</CardTitle>
				<Div className='inline-flex items-center gap-x-3'>
					<Icon name='CalendarDays' size={18} />
					<Select defaultValue='2024'>
						<SelectTrigger className='w-[180px]' defaultChecked>
							<SelectValue placeholder='-- Select --' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='2024'>2024</SelectItem>
							<SelectItem value='2023'>2023</SelectItem>
							<SelectItem value='2022'>2022</SelectItem>
						</SelectContent>
					</Select>
				</Div>
			</CardHeader>
			<CardContent className='@container-norma @container'>
				<ChartContainer className='@xs:h-72 @xl:h-80 @3xl:h-96 @5xl:h-[468px]' config={chartConfig}>
					<BarChart accessibilityLayer data={annuallInOutBoundStatistics}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='month'
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<YAxis stroke='hsl(var(--muted-foreground))' />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Bar dataKey='import' fill='var(--color-import)' radius={3} />
						<Bar dataKey='export' fill='var(--color-export)' radius={3} />
						<ChartLegend content={<ChartLegendContent />} formatter={(value) => _.capitalize(value)} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

const Card = tw.div`rounded-[var(--radius)] p-4 flex flex-col gap-4 shadow border justify-between bg-background`
const CardContent = tw.div`flex flex-col gap-6`
const CardHeader = tw.div`flex flex-row items-center justify-between space-y-0 font-medium text-sm`
const CardTitle = tw.h6`font-medium text-sm`

export default InoutboundOverview
