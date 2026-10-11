import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@components/ui/chart'
import { Icon } from '@components/ui/icon'
import { Skeleton } from '@components/ui/skeleton'
import { useDateLocale } from '@hooks/use-date-locale'
import { format } from 'date-fns'
import { capitalize } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getTrendingIcon, getTrendingPercentageChange } from '../helpers'
import { useGetLastSixMonthsNetFlow } from '../hooks/use-statistic-request'

export function NetFlowOverview() {
	const { t } = useTranslation('ns_dashboard')
	const { data, isLoading } = useGetLastSixMonthsNetFlow()
	const dateLocale = useDateLocale()

	const percentageChange = useMemo(() => {
		if (!Array.isArray(data) || data.length === 0) return 0
		const percent =
			((data.at(-1).net_flow - data.at(data.length - 2).net_flow) / Math.abs(data.at(data.length - 2).net_flow)) *
			100
		return Number.parseFloat(percent.toFixed(2))
	}, [data])

	const isEmpty = !Array.isArray(data) || data.length === 0

	return (
		<Card className='h-full' data-role='card'>
			<CardHeader>
				<CardTitle>{t('ns_dashboard:statistic.net_flow')}</CardTitle>
				<CardDescription>{t('ns_dashboard:net_flow_description')}</CardDescription>
			</CardHeader>
			<CardContent className='flex-1'>
				{isLoading ? (
					<Skeleton className='w-full place-content-center place-items-center @xs:h-72 @xl:h-80' />
				) : isEmpty ? (
					<Div className='bg-muted text-muted-foreground flex h-full min-h-80 w-full flex-1 items-center justify-center gap-x-2 rounded-lg text-base'>
						<Icon name='ChartSpline' size={32} strokeWidth={1} />
						{t('ns_common:table.no_data')}
					</Div>
				) : (
					<ChartContainer
						className={isEmpty ? 'h-full max-w-full' : 'w-full @xs:h-72 @xl:h-80 @3xl:max-h-full @3xl:min-h-80'}
						config={{
							net_flow: {
								label: t('ns_dashboard:statistic.net_flow'),
								color: 'var(--chart-1)'
							}
						}}>
						<LineChart
							accessibilityLayer
							data={data.map((period) => ({
								...period,
								month: capitalize(format(new Date(new Date().getFullYear(), period.month - 1), 'MMM'))
							}))}
							margin={{
								top: 24,
								bottom: 0,
								left: 12,
								right: 12
							}}>
							<CartesianGrid vertical={false} />
							<XAxis axisLine={false} dataKey='month' minTickGap={32} tickLine={false} tickMargin={8} />
							<ChartTooltip
								useTranslate3d
								content={<ChartTooltipContent className='min-w-48' />}
								cursor={false}
							/>
							<Line dataKey='net_flow' stroke='var(--color-net_flow)' strokeWidth={2} type='natural' />
						</LineChart>
					</ChartContainer>
				)}
			</CardContent>
			{isLoading ? (
				<CardFooter>
					<Div className='space-y-1'>
						<Skeleton className='h-4 w-40' />
						<Skeleton className='h-4 w-20' />
					</Div>
				</CardFooter>
			) : (
				!isEmpty && (
					<CardFooter>
						<Div className='space-y-1 *:text-sm'>
							<Typography className='flex items-center gap-2 leading-loose font-medium'>
								{t(...getTrendingPercentageChange(percentageChange))}
								<Icon name={getTrendingIcon(percentageChange)} />
							</Typography>
							<Typography
								className='text-muted-foreground flex items-center gap-2 leading-none capitalize'
								color='muted'>
								{format(new Date(new Date().getFullYear(), data.at(0).month - 1, 1), 'PPP', {
									locale: dateLocale
								})}
								{' - '}
								{format(new Date(), 'PPP', {
									locale: dateLocale
								})}
							</Typography>
						</Div>
					</CardFooter>
				)
			)}
		</Card>
	)
}
