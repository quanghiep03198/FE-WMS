import { useDateLocale } from '@/common/hooks/use-date-locale'
import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
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
	SelectValue,
	Skeleton
} from '@/components/ui'
import { format } from 'date-fns'
import { capitalize } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { useDashboardFilterSessionState } from '../-hooks/use-dashboard-filter-session-state'
import { useGetAnnualInoutboundOverviewQuery } from '../-hooks/use-statistic-asm'

const InoutboundOverview: React.FC = () => {
	const { t, i18n } = useTranslation()
	const dateLocale = useDateLocale()
	const { data, isLoading } = useGetAnnualInoutboundOverviewQuery()
	const [dashboardFilters, setDashboardFilters] = useDashboardFilterSessionState()

	const chartConfig = useMemo(
		() => ({
			inbound_qty: {
				label: t('ns_dashboard:statistic.inbound_quantity'),
				color: 'hsl(var(--chart-1))'
			},
			outbound_qty: {
				label: t('ns_dashboard:statistic.outbound_quantity'),
				color: 'hsl(var(--chart-2))'
			}
		}),
		[i18n.language]
	)

	return (
		<Div className='flex h-full flex-col items-stretch justify-end'>
			<Card className='ease transition-colors duration-200 hover:border-primary/50'>
				<CardHeader>
					<CardTitle>{t('ns_dashboard:inoutbound_overview')}</CardTitle>
					<CardDescription className='capitalize'>
						{format(new Date(new Date().getFullYear(), 0), 'MMMM', { locale: dateLocale })}
						{' - '}
						{format(new Date(new Date().getFullYear(), 11), 'MMMM', { locale: dateLocale })}{' '}
						{dashboardFilters.inoutboundOverviewYear}
					</CardDescription>
					<CardAction className='inline-flex items-center gap-x-3'>
						<Select
							defaultValue={new Date().getFullYear().toString()}
							onValueChange={(value) =>
								setDashboardFilters({ ...dashboardFilters, inoutboundOverviewYear: Number.parseInt(value) })
							}>
							<SelectTrigger className='inline-flex w-[180px] items-center gap-x-2' defaultChecked>
								<Icon name='CalendarDays' size={18} />
								<SelectValue placeholder='Select' />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: 3 }).map((_, index) => (
									<SelectItem
										key={new Date().getFullYear() - index}
										value={String(new Date().getFullYear() - index)}>
										{new Date().getFullYear() - index}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CardAction>
				</CardHeader>
				<CardContent className='relative w-full'>
					{isLoading ? (
						<Skeleton className='w-full place-content-center place-items-center @xs:h-72 @xl:h-96 @3xl:max-h-full @3xl:min-h-[26rem]' />
					) : !Array.isArray(data) || data.length === 0 ? (
						<Div className='flex w-full items-center justify-center gap-x-2 text-sm @xs:h-72 @xl:h-96 @3xl:max-h-full @3xl:min-h-[26rem]'>
							<Icon name='ChartColumnBig' size={28} strokeWidth={1.5} />
							{t('ns_common:table.no_data')}
						</Div>
					) : (
						<ChartContainer
							className='w-full @xs:h-72 @xl:h-96 @3xl:max-h-full @3xl:min-h-[26rem]'
							config={chartConfig}>
							<BarChart
								accessibilityLayer
								data={data.map((item) => ({
									...item,
									month: capitalize(
										format(new Date(new Date().getFullYear(), item.month - 1), 'MMMM', { locale: dateLocale })
									)
								}))}>
								<CartesianGrid vertical={false} />
								<XAxis dataKey='month' tickLine={false} tickMargin={10} axisLine={false} />
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent indicator='dot' className='min-w-48' />}
								/>
								<YAxis stroke='hsl(var(--muted-foreground))' tickFormatter={formatIntlNumber} />
								<Bar dataKey='inbound_qty' fill='var(--color-inbound_qty)' radius={3} />
								<Bar dataKey='outbound_qty' fill='var(--color-outbound_qty)' radius={3} />
								<ChartLegend content={<ChartLegendContent />} formatter={capitalize} />
							</BarChart>
						</ChartContainer>
					)}
				</CardContent>
			</Card>
		</Div>
	)
}

export default InoutboundOverview
