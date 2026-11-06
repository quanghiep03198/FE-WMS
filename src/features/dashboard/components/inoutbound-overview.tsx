import formatIntlNumber from '@common/utils/format-intl-number'
import { Div } from '@components/customs/div'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { ChartContainer, ChartLegendContent, ChartPlot } from '@components/ui/chart'
import { Icon } from '@components/ui/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Skeleton } from '@components/ui/skeleton'
import { useDateLocale } from '@hooks/use-date-locale'
import { barY, defineChart, group } from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import { format } from 'date-fns'
import { capitalize } from 'lodash-es'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetAnnualInoutboundOverviewQuery } from '../hooks/use-statistic-request'

const InoutboundOverview: React.FC = () => {
	const { t, i18n } = useTranslation()
	const dateLocale = useDateLocale()
	const [year, setYear] = useState<number>(new Date().getFullYear())
	const { data, isLoading } = useGetAnnualInoutboundOverviewQuery(year)

	const chartConfig = useMemo(
		() => ({
			inbound_qty: {
				label: t('ns_dashboard:statistic.inbound_quantity'),
				color: 'var(--chart-1)'
			},
			outbound_qty: {
				label: t('ns_dashboard:statistic.outbound_quantity'),
				color: 'var(--chart-2)'
			}
		}),
		[i18n.language]
	)
	const chartData = useMemo(
		() =>
			(data ?? []).flatMap((item) => {
				const month = capitalize(
					format(new Date(new Date().getFullYear(), item.month - 1), 'MMMM', { locale: dateLocale })
				)

				return [
					{ month, series: 'inbound_qty' as const, value: item.inbound_qty },
					{ month, series: 'outbound_qty' as const, value: item.outbound_qty }
				]
			}),
		[data, dateLocale]
	)
	const chartDefinition = useMemo(
		() =>
			defineChart({
				marks: [
					barY(chartData, {
						id: 'inoutbound-bars',
						key: (row) => `${row.month}:${row.series}`,
						x: 'month',
						y: 'value',
						z: 'series',
						color: 'series',
						fill: (row) => `var(--color-${row.series})`,
						radius: 4,
						layout: group({
							scale: () =>
								scaleBand<string>().domain(['inbound_qty', 'outbound_qty']).paddingInner(0.08).paddingOuter(0)
						})
					})
				],
				scales: {
					x: { scale: () => scaleBand<string>().padding(0.08) },
					y: {
						scale: scaleLinear,
						nice: true,
						grid: true,
						axis: { ticks: { format: formatIntlNumber }, motion: () => false }
					}
				},
				focus: 'group-x',
				svgAnimation: { duration: 500, easing: 'ease-out' },
				tooltip: {
					use: tooltip,
					className: '',
					content: (points) => ({
						title: String(points[0]?.xValue ?? ''),
						rows: points.map((point) => ({
							label: chartConfig[point.datum.series].label,
							value: formatIntlNumber(point.datum.value),
							color: `var(--color-${point.datum.series})`,
							active: false
						}))
					})
				}
			}),
		[chartData, chartConfig]
	)

	const isEmpty = !Array.isArray(data) || data.every((item) => item.inbound_qty === 0 && item.outbound_qty === 0)

	return (
		<Div className='flex h-full flex-col items-stretch justify-end'>
			<Card data-role='card'>
				<CardHeader>
					<CardTitle>{t('ns_dashboard:inoutbound_overview')}</CardTitle>
					<CardDescription className='capitalize'>
						{format(new Date(new Date().getFullYear(), 0), 'MMMM', { locale: dateLocale })}
						{' - '}
						{format(new Date(new Date().getFullYear(), 11), 'MMMM', { locale: dateLocale })} {year}
					</CardDescription>
					<CardAction className='inline-flex items-center gap-x-3'>
						<Select
							defaultValue={new Date().getFullYear().toString()}
							value={year.toString()}
							onValueChange={(value) => setYear(Number.parseInt(value))}>
							<SelectTrigger defaultChecked className='inline-flex w-45 items-center gap-x-2'>
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
						<Skeleton className='w-full place-content-center place-items-center @xs:h-72 @xl:h-96 @3xl:max-h-full @3xl:min-h-96' />
					) : isEmpty ? (
						<Div className='bg-muted text-muted-foreground flex w-full items-center justify-center gap-x-2 rounded-lg @xs:h-72 @xl:h-96 @3xl:min-h-104'>
							<Icon name='ChartColumnBig' size={32} strokeWidth={1} />
							{t('ns_common:table.no_data')}
						</Div>
					) : (
						<ChartContainer
							className='w-full @xs:h-72 @xl:h-96 @3xl:max-h-full @3xl:min-h-104'
							config={chartConfig}>
							<ChartPlot
								ariaLabel={t('ns_dashboard:inoutbound_overview')}
								className='font-sans'
								definition={chartDefinition}
								height={385}
							/>
							<ChartLegendContent />
						</ChartContainer>
					)}
				</CardContent>
			</Card>
		</Div>
	)
}

export default InoutboundOverview
