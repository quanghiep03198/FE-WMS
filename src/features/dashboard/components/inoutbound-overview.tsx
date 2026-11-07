import formatIntlNumber from '@common/utils/format-intl-number'
import { Div } from '@components/customs/div'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { ChartContainer, ChartLegendContent, chartMarkRenderer, ChartPlot } from '@components/ui/chart'
import { Icon } from '@components/ui/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Skeleton } from '@components/ui/skeleton'
import { useAnimatedChartValues } from '@hooks/use-animated-chart-values'
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

type InoutboundChartDatum = {
	month: string
	monthNumber: number
	series: 'inbound_qty' | 'outbound_qty'
	value: number
}

const valueAccessors = {
	key: (row: InoutboundChartDatum) => `${row.monthNumber}:${row.series}`,
	value: (row: InoutboundChartDatum) => row.value,
	withValue: (row: InoutboundChartDatum, value: number): InoutboundChartDatum => ({ ...row, value })
}

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
					{ month, monthNumber: item.month, series: 'inbound_qty' as const, value: item.inbound_qty },
					{ month, monthNumber: item.month, series: 'outbound_qty' as const, value: item.outbound_qty }
				]
			}),
		[data, dateLocale]
	)
	const {
		values: animatedData,
		visibility,
		extent
	} = useAnimatedChartValues(data ? chartData : undefined, valueAccessors)
	const actualValues = useMemo(
		() => new Map(chartData.map((row) => [valueAccessors.key(row), row.value])),
		[chartData]
	)
	const chartDefinition = useMemo(
		() =>
			defineChart({
				marks: [
					barY(animatedData, {
						id: 'inoutbound-bars',
						renderer: chartMarkRenderer,
						key: valueAccessors.key,
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
					x: {
						scale: () => scaleBand<string>().padding(0.08),
						axis: { line: false }
					},
					y: {
						scale:
							visibility < 1 && chartData.length
								? scaleLinear().domain(
										extent ?? [
											Math.min(
												0,
												...chartData.map((item) => item.value),
												...animatedData.map((item) => item.value)
											),
											Math.max(
												1,
												...chartData.map((item) => item.value),
												...animatedData.map((item) => item.value)
											)
										]
									)
								: scaleLinear,
						nice: true,
						grid: true,
						line: false,
						axis: { ticks: { format: formatIntlNumber } }
					}
				},
				svgAnimation: false,
				focus: 'group-x',
				tooltip: {
					use: tooltip,
					content: (points) => ({
						title: String(points[0]?.xValue ?? ''),
						rows: points.map((point) => ({
							label: chartConfig[point.datum.series].label,
							value: formatIntlNumber(actualValues.get(valueAccessors.key(point.datum)) ?? 0),
							color: `var(--color-${point.datum.series})`,
							active: false
						}))
					})
				}
			}),
		[animatedData, actualValues, chartConfig, chartData, visibility, extent]
	)

	const isEmpty = chartData.every((item) => item.value === 0) && animatedData.every((item) => item.value === 0)

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
								valueAnimation
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
