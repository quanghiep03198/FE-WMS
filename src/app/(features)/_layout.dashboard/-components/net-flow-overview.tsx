import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { useDateLocale } from '@/common/hooks/use-date-locale'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	Div,
	Icon,
	Skeleton,
	Typography
} from '@/components/ui'
import { format } from 'date-fns'
import { capitalize } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDashboardFilterSessionState } from '../-hooks/use-dashboard-filter-session-state'
import { useGetAnnualInoutboundOverviewQuery } from '../-hooks/use-statistic-asm'

export function NetFlowOverview() {
	const { t } = useTranslation()
	const { data, isLoading } = useGetAnnualInoutboundOverviewQuery()
	const dateLocale = useDateLocale()
	const [dashboardFilters] = useDashboardFilterSessionState()

	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.sort((a, b) => a.month - b.month).filter((period) => period.month <= new Date().getMonth() + 1)
	}, [data])

	return (
		<Card className='h-full transition-colors duration-300 ease-in-out hover:border-primary/50'>
			<CardHeader>
				<CardTitle>{t('ns_dashboard:statistic.net_flow')}</CardTitle>
				<CardDescription>{t('ns_dashboard:net_flow_description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={{
						net_flow: {
							label: t('ns_dashboard:statistic.net_flow'),
							color: 'hsl(var(--chart-1))'
						}
					}}
					className={'w-full @xs:h-72 @xl:h-80 @3xl:max-h-full @3xl:min-h-80'}>
					{isLoading ? (
						<Skeleton className='w-full place-content-center place-items-center @xs:h-72 @xl:h-80' />
					) : !Array.isArray(data) || data.length === 0 ? (
						<Div className='flex h-full w-full items-center justify-center gap-x-2 text-sm'>
							<Icon name='ChartLine' size={32} strokeWidth={1.5} />
							{t('ns_common:table.no_data')}
						</Div>
					) : (
						<LineChart
							accessibilityLayer
							data={filteredData.map((period) => ({
								...period,
								month: capitalize(format(new Date(new Date().getFullYear(), period.month - 1), 'MMM'))
							}))}
							margin={{
								top: 12,
								bottom: 12,
								left: 12,
								right: 12
							}}>
							<CartesianGrid vertical={false} />
							<XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent className='min-w-48' />}
								useTranslate3d
							/>
							<Line
								dataKey='net_flow'
								type='natural'
								stroke='var(--color-net_flow)'
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					)}
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<Div className='space-y-1 *:text-sm'>
					<Typography className='flex items-center gap-2 font-medium leading-loose'>
						Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
					</Typography>
					<Typography color='muted' className='flex items-center gap-2 leading-none text-muted-foreground'>
						{format(new Date(new Date().getFullYear(), filteredData.at(0)?.month - 1), 'MMMM', {
							locale: dateLocale
						})}
						{' - '}
						{format(new Date(new Date().getFullYear(), filteredData.at(-1)?.month - 1), 'MMMM', {
							locale: dateLocale
						})}{' '}
						{dashboardFilters.inoutboundOverviewYear}
					</Typography>
				</Div>
			</CardFooter>
		</Card>
	)
}
