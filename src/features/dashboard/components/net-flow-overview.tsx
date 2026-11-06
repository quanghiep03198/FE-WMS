import formatIntlNumber from '@common/utils/format-intl-number'
import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import { ChartContainer, ChartPlot } from '@components/ui/chart'
import { Icon } from '@components/ui/icon'
import { Skeleton } from '@components/ui/skeleton'
import { useDateLocale } from '@hooks/use-date-locale'
import { defineChart, lineY } from '@tanstack/charts'
import { d3Curve } from '@tanstack/charts/d3/shape'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import { curveMonotoneX } from 'd3-shape'
import { format } from 'date-fns'
import { capitalize } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getTrendingIcon, getTrendingPercentageChange } from '../helpers'
import { useGetLastSixMonthsNetFlow } from '../hooks/use-statistic-request'

const NetFlowOverview: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { data, isLoading } = useGetLastSixMonthsNetFlow()
	const dateLocale = useDateLocale()

	const chartData = useMemo(
		() =>
			(data ?? []).map((period) => ({
				...period,
				month: capitalize(format(new Date(new Date().getFullYear(), period.month - 1), 'MMM'))
			})),
		[data]
	)
	const chartConfig = useMemo(
		() => ({ net_flow: { label: t('ns_dashboard:statistic.net_flow'), color: 'var(--chart-1)' } }),
		[i18n.language]
	)
	const chartDefinition = useMemo(
		() =>
			defineChart({
				motion: true,
				marks: [
					lineY(chartData, {
						id: 'net-flow-line',
						key: (row) => row.month,
						x: 'month',
						y: 'net_flow',
						stroke: 'var(--color-net_flow)',
						strokeWidth: 2,
						curve: d3Curve(curveMonotoneX),
						lineCap: 'round',
						lineJoin: 'round',
						points: true
					})
				],
				scales: {
					x: {
						scale: () => scaleBand<string>().paddingInner(0.2).paddingOuter(0.1),
						axis: {
							line: false,
							ticks: {
								size: 0,
								padding: 10,
								format: (value: string) => value.slice(0, 3)
							}
						}
					},
					y: { scale: scaleLinear, nice: true, grid: true }
				},
				focus: 'nearest-y',
				svgAnimation: { duration: 500, easing: 'ease-out' },
				tooltip: {
					use: tooltip,
					content: (points) => ({
						title: String(points[0]?.xValue ?? ''),
						rows: points.map((point) => ({
							label: chartConfig.net_flow.label,
							value: formatIntlNumber(Number(point.yValue ?? 0)),
							color: 'var(--color-net_flow)'
						}))
					})
				}
			}),
		[chartData, chartConfig]
	)

	const percentageChange = useMemo(() => {
		if (!Array.isArray(data) || data.length === 0) return 0

		const percent =
			((data[data.length - 1].net_flow - data[data.length - 2].net_flow) /
				Math.abs(data[data.length - 2].net_flow)) *
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
						config={chartConfig}>
						<ChartPlot reveal ariaLabel={t('ns_dashboard:statistic.net_flow')} definition={chartDefinition} />
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
								{format(new Date(new Date().getFullYear(), data[0].month - 1, 1), 'PPP', {
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

export default NetFlowOverview
