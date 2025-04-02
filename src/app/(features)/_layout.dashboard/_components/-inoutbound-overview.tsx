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
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import tw from 'tailwind-styled-components'
import { annuallInOutBoundStatistics } from '../_mocks/-dashboard.data'

const chartConfig = {
	import: {
		label: 'Inbound',
		color: 'hsl(var(--chart-1))'
	},
	export: {
		label: 'Outbound',
		color: 'hsl(var(--chart-2))'
	}
} satisfies ChartConfig

const InoutboundOverview: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='flex h-full flex-col items-stretch justify-end'>
			<Card className='col-span-full max-h-full w-full flex-1 basis-full self-end xl:col-span-2'>
				<CardHeader>
					<CardTitle>{t('ns_dashboard:inoutbound_overview')}</CardTitle>
					<Div className='inline-flex items-center gap-x-3'>
						<Icon name='CalendarDays' size={18} />
						<Select defaultValue={new Date().getFullYear().toString()}>
							<SelectTrigger className='w-[180px]' defaultChecked>
								<SelectValue placeholder='-- Select --' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={new Date().getFullYear().toString()}>
									{new Date().getFullYear().toString()}
								</SelectItem>
							</SelectContent>
						</Select>
					</Div>
				</CardHeader>
				<CardContent className='@container-norma @container'>
					<ChartContainer className='@xs:h-72 @xl:h-80 @3xl:max-h-full @3xl:min-h-[400px]' config={chartConfig}>
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
		</Div>
	)
}

const Card = tw.div`rounded-[var(--radius)] p-4 flex flex-col gap-4 shadow border justify-between bg-background`
const CardHeader = tw.div`flex flex-row items-center justify-between space-y-0 font-medium text-sm`
const CardContent = tw.div`flex flex-col gap-6`
const CardTitle = tw.h6`font-medium text-sm`

export default InoutboundOverview
