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
import { getTrendingIcon, getTrendingPercentageChange } from '../-helpers'
import { useGetLastSixMonthsNetFlow } from '../-hooks/use-statistic-asm'

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

	return (
		<Card data-role='card' className='h-full'>
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
						<Div className='flex h-full w-full flex-1 items-center justify-center gap-x-2 rounded-lg text-base text-muted-foreground'>
							<Icon name='ChartSpline' size={32} strokeWidth={1} />
							{t('ns_common:table.no_data')}
						</Div>
					) : (
						<LineChart
							accessibilityLayer
							data={data.map((period) => ({
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
							<Line dataKey='net_flow' type='natural' stroke='var(--color-net_flow)' strokeWidth={2} />
						</LineChart>
					)}
				</ChartContainer>
			</CardContent>

			{isLoading ? (
				<CardFooter>
					<Div className='space-y-1'>
						<Skeleton className='h-4 w-40' />
						<Skeleton className='h-4 w-20' />
					</Div>
				</CardFooter>
			) : (
				Array.isArray(data) &&
				data.length > 0 && (
					<CardFooter>
						<Div className='space-y-1 *:text-sm'>
							<Typography className='flex items-center gap-2 font-medium leading-loose'>
								{(() => {
									const { key, params } = getTrendingPercentageChange(percentageChange)
									return t(key, params)
								})()}
								<Icon name={getTrendingIcon(percentageChange)} />
							</Typography>
							<Typography
								color='muted'
								className='flex items-center gap-2 capitalize leading-none text-muted-foreground'>
								{format(new Date(new Date().getFullYear(), data.at(0).month - 1, 1), 'PPP', {
									locale: dateLocale
								})}
								{' - '}
								{format(new Date(), 'PPP', {
									locale: dateLocale
								})}{' '}
							</Typography>
						</Div>
					</CardFooter>
				)
			)}
		</Card>
	)
}
