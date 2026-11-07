import { useMemo, useState } from 'react'

import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import type { ChartConfig } from '@components/ui/chart'
import { ChartContainer, chartMarkRenderer, ChartPlot } from '@components/ui/chart'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Skeleton } from '@components/ui/skeleton'

import { cn } from '@common/utils/cn'
import { areaY, defineChart } from '@tanstack/charts'
import { d3Curve } from '@tanstack/charts/d3/shape'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { scalePoint } from '@tanstack/charts/scales/point'
import { tooltip } from '@tanstack/charts/tooltip'
import { curveMonotoneX } from 'd3-shape'
import { format, subDays, subMonths } from 'date-fns'
import { capitalize } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetDailyAssemblyProductivityQuery } from '../hooks/use-statistic-request'

export const description = 'An interactive line chart'

const chartConfig = {
	UGG: {
		label: 'UGG',
		color: 'var(--chart-1)'
	},
	TEVA: {
		label: 'TEVA',
		color: 'var(--chart-2)'
	},
	KOOLABURRA: {
		label: 'KOOLABURRA',
		color: 'var(--chart-3)'
	}
} satisfies ChartConfig

const AssemblyProductivityOverview: React.FC = () => {
	const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>('UGG')
	const [activePeriod, setActivePeriod] = useState<string>(format(subMonths(new Date(), 3), 'yyyy-MM-dd'))
	const { data, isLoading } = useGetDailyAssemblyProductivityQuery()
	const { t, i18n } = useTranslation()

	const total = useMemo(() => {
		if (!Array.isArray(data)) return { UGG: 0, KOOLABURRA: 0, TEVA: 0 }
		return {
			UGG: data.filter((item) => item.brand_name === 'UGG').reduce((acc, curr) => acc + curr.volumn, 0),
			TEVA: data.filter((item) => item.brand_name === 'TEVA').reduce((acc, curr) => acc + curr.volumn, 0),
			KOOLABURRA: data.filter((item) => item.brand_name === 'KOOLABURRA').reduce((acc, curr) => acc + curr.volumn, 0)
		}
	}, [data])

	const chartData = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.filter((item) => item.brand_name === activeChart && item.work_date >= activePeriod)
	}, [data, activeChart, activePeriod])

	const locale = useMemo(() => {
		switch (i18n.language) {
			case 'vi':
				return 'vi-VN'
			case 'cn':
				return 'zh-CN'
			case 'en':
				return 'en-US'
			default:
				return 'en-US'
		}
	}, [i18n.language])
	// areaY stacks by default and requires one row per x position
	const seriesData = useMemo(() => {
		const volumeByDate = new Map<string, number>()
		for (const item of chartData) {
			volumeByDate.set(item.work_date, (volumeByDate.get(item.work_date) ?? 0) + item.volumn)
		}
		return Array.from(volumeByDate, ([work_date, volumn]) => ({ work_date, volumn })).sort((a, b) =>
			a.work_date.localeCompare(b.work_date)
		)
	}, [chartData])

	const chartDefinition = useMemo(
		() =>
			defineChart({
				marks: [
					areaY(seriesData, {
						id: 'assembly-volumn-area',
						renderer: chartMarkRenderer,
						key: (row) => row.work_date,
						x: 'work_date',
						y: 'volumn',
						fill: `var(--color-${activeChart})`,
						fillOpacity: 0.2,
						stroke: `var(--color-${activeChart})`,
						strokeWidth: 1,
						curve: d3Curve(curveMonotoneX)
					})
				],
				scales: {
					x: {
						scale: () => scalePoint<string>().padding(0.2),
						axis: {
							line: false,
							ticks: {
								format: (value) =>
									capitalize(
										new Date(String(value)).toLocaleDateString(locale, {
											month: 'short',
											day: 'numeric'
										})
									)
							}
						}
					},
					y: { scale: scaleLinear, nice: true, grid: true }
				},
				svgAnimation: { duration: 500, easing: 'ease-out', respectReducedMotion: true, resize: false },
				tooltip: {
					use: tooltip,
					content: (points) => ({
						title: capitalize(
							new Date(String(points[0]?.xValue)).toLocaleDateString(locale, {
								day: 'numeric',
								month: 'short'
							})
						),
						rows: points.map((point) => ({
							label: chartConfig[activeChart].label,
							value: Number(point.yValue ?? 0).toLocaleString(locale),
							color: `var(--color-${activeChart})`
						}))
					})
				}
			}),
		[activeChart, seriesData, locale]
	)

	return (
		<Card className='@container/card'>
			<CardHeader className='flex flex-col items-stretch divide-y border-b p-0! sm:flex-row gap-0'>
				<Div className='flex items-center justify-between px-6 pb-3 sm:pb-0'>
					<Div className='flex flex-1 flex-col justify-center gap-1'>
						<CardTitle>{t('ns_dashboard:assembly_productivity_overview')}</CardTitle>
						<CardDescription>{t('ns_dashboard:assembly_productivity_description')}</CardDescription>
					</Div>
					<CardAction>
						<RadioGroup
							value={activePeriod}
							className={cn(
								'isolate hidden grid-cols-3 gap-0 divide-x overflow-clip rounded-lg border **:cursor-pointer! @4xl/card:inline-grid',
								'[&>div:has([data-state=checked])]:bg-accent [&>div:has([data-state=checked])]:text-accent-foreground [&_button[role=radio]]:hidden [&>div]:h-9 [&>div]:px-3 [&>div]:py-1.5 [&>div]:text-center'
							)}
							onValueChange={setActivePeriod}>
							<Div role='radio'>
								<Label htmlFor='last-3m-option'>{t('ns_dashboard:period_options.last_3_months')}</Label>
								<RadioGroupItem id='last-3m-option' value={format(subMonths(new Date(), 3), 'yyyy-MM-dd')} />
							</Div>
							<Div role='radio'>
								<Label htmlFor='last-30d-option'>{t('ns_dashboard:period_options.last_30_days')}</Label>
								<RadioGroupItem id='last-30d-option' value={format(subDays(new Date(), 30), 'yyyy-MM-dd')} />
							</Div>
							<Div role='radio'>
								<Label htmlFor='last-7d-option'>{t('ns_dashboard:period_options.last_7_days')}</Label>
								<RadioGroupItem id='last-7d-option' value={format(subDays(new Date(), 7), 'yyyy-MM-dd')} />
							</Div>
						</RadioGroup>
						<Select defaultValue={format(subMonths(new Date(), 3), 'yyyy-MM-dd')}>
							<SelectTrigger className='flex w-full min-w-40 @4xl/card:hidden'>
								<SelectValue placeholder='Select' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={format(subMonths(new Date(), 3), 'yyyy-MM-dd')}>
									{t('ns_dashboard:period_options.last_3_months')}
								</SelectItem>
								<SelectItem value={format(subDays(new Date(), 30), 'yyyy-MM-dd')}>
									{t('ns_dashboard:period_options.last_30_days')}
								</SelectItem>
								<SelectItem value={format(subDays(new Date(), 7), 'yyyy-MM-dd')}>
									{t('ns_dashboard:period_options.last_7_days')}
								</SelectItem>
							</SelectContent>
						</Select>
					</CardAction>
				</Div>
				<Tabs>
					{isLoading
						? Array.from({ length: 3 }).map((_, index) => (
								<TabsTrigger key={index.toString()}>
									<Skeleton className='h-3 w-12' />
									<Skeleton className='h-8 w-24' />
								</TabsTrigger>
							))
						: Object.entries(total).map(([brand, volumn]) => {
								const chart = brand as keyof typeof chartConfig
								return (
									<TabsTrigger
										data-active={activeChart === chart}
										key={chart}
										onClick={() => setActiveChart(chart)}>
										<Typography className='text-muted-foreground text-xs uppercase' variant='small'>
											{chartConfig[chart].label}
										</Typography>
										<Typography as='span' variant='h3'>
											{volumn.toLocaleString()}
										</Typography>
									</TabsTrigger>
								)
							})}
				</Tabs>
			</CardHeader>
			<CardContent className='px-2 sm:p-6'>
				{isLoading ? (
					<Skeleton className='h-62.5 w-full' />
				) : !Array.isArray(chartData) || chartData.length === 0 ? (
					<Div className='bg-muted text-muted-foreground mx-3 flex h-64 items-center justify-center gap-x-2 rounded-lg'>
						<Icon name='ChartArea' size={32} strokeWidth={1} />
						{t('ns_common:table.no_data')}
					</Div>
				) : (
					<ChartContainer className='xxl:h-80 aspect-auto h-72 w-full' config={chartConfig}>
						<ChartPlot
							reveal
							ariaLabel={t('ns_dashboard:assembly_productivity_overview')}
							definition={chartDefinition}
							height={280}
						/>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	)
}

const Tabs = tw.div`flex divide-x`
const TabsTrigger = tw.button`flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left tabular-nums even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6`

export default AssemblyProductivityOverview
