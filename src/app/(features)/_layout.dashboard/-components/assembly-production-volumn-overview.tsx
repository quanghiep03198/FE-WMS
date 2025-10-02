import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	Div,
	Icon,
	Label,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Skeleton,
	Typography
} from '@/components/ui'

import { cn } from '@/common/utils/cn'
import { format, subDays, subMonths } from 'date-fns'
import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetDailyAssemblyProductivityQuery } from '../-hooks/use-statistic-asm'

export const description = 'An interactive line chart'

const chartConfig = {
	UGG: {
		label: 'UGG',
		color: 'hsl(var(--chart-1))'
	},
	TEVA: {
		label: 'TEVA',
		color: 'hsl(var(--chart-2))'
	},
	KOOLABURRA: {
		label: 'KOOLABURRA',
		color: 'hsl(var(--chart-3))'
	}
} satisfies ChartConfig

export function AssemblyProductivityOverview() {
	const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>('UGG')
	const [activePeriod, setActivePeriod] = useState<string>(format(subMonths(new Date(), 3), 'yyyy-MM-dd'))
	const { data, isLoading } = useGetDailyAssemblyProductivityQuery()
	const { t, i18n } = useTranslation(['ns_dashboard'])

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

	return (
		<Card className='@container/card'>
			<CardHeader className='flex flex-col items-stretch divide-y border-b !p-0 sm:flex-row'>
				<Div className='flex items-center justify-between px-6 pb-3 sm:pb-0'>
					<Div className='flex flex-1 flex-col justify-center gap-1'>
						<CardTitle>{t('ns_dashboard:assembly_productivity_overview')}</CardTitle>
						<CardDescription>{t('ns_dashboard:assembly_productivity_description')}</CardDescription>
					</Div>
					<CardAction>
						<RadioGroup
							value={activePeriod}
							onValueChange={setActivePeriod}
							className={cn(
								'isolate hidden grid-cols-3 gap-0 divide-x overflow-clip rounded-lg border @4xl/card:inline-grid [&_*]:!cursor-pointer',
								'[&>div:has([data-state=checked])]:bg-accent [&>div:has([data-state=checked])]:text-accent-foreground [&>div]:h-9 [&>div]:px-3 [&>div]:py-1.5 [&>div]:text-center [&_button[role=radio]]:hidden'
							)}>
							<Div role='radio'>
								<Label htmlFor='last-3m-option'>{t('ns_dashboard:period_options.last_3_months')}</Label>
								<RadioGroupItem value={format(subMonths(new Date(), 3), 'yyyy-MM-dd')} id='last-3m-option' />
							</Div>
							<Div role='radio'>
								<Label htmlFor='last-30d-option'>{t('ns_dashboard:period_options.last_30_days')}</Label>
								<RadioGroupItem value={format(subDays(new Date(), 30), 'yyyy-MM-dd')} id='last-30d-option' />
							</Div>
							<Div role='radio'>
								<Label htmlFor='last-7d-option'>{t('ns_dashboard:period_options.last_7_days')}</Label>
								<RadioGroupItem value={format(subDays(new Date(), 7), 'yyyy-MM-dd')} id='last-7d-option' />
							</Div>
						</RadioGroup>
						<Select defaultValue={format(subMonths(new Date(), 3), 'yyyy-MM-dd')}>
							<SelectTrigger className='flex w-full min-w-40 @4xl/card:hidden'>
								<SelectValue placeholder='Select' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={format(subMonths(new Date(), 3), 'yyyy-MM-dd')}>
									{t('ns_dashboard:period_options.last_3_months' as any)}
								</SelectItem>
								<SelectItem value={format(subDays(new Date(), 30), 'yyyy-MM-dd')}>
									{t('ns_dashboard:period_options.last_30_days' as any)}
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
										key={chart}
										data-active={activeChart === chart}
										onClick={() => setActiveChart(chart)}>
										<Typography variant='small' className='text-xs uppercase text-muted-foreground'>
											{chartConfig[chart].label}
										</Typography>
										<Typography variant='h3' as='span'>
											{volumn.toLocaleString()}
										</Typography>
									</TabsTrigger>
								)
							})}
				</Tabs>
			</CardHeader>
			<CardContent className='px-2 sm:p-6'>
				{isLoading ? (
					<Skeleton className='h-[250px] w-full' />
				) : !Array.isArray(chartData) || chartData.length === 0 ? (
					<Div className='mx-3 flex h-64 items-center justify-center gap-x-2 rounded-lg bg-muted text-muted-foreground'>
						<Icon name='ChartArea' size={32} strokeWidth={1} />
						{t('ns_common:table.no_data')}
					</Div>
				) : (
					<ChartContainer config={chartConfig} className='aspect-auto h-72 w-full'>
						<AreaChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 12,
								right: 12
							}}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='work_date'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={(value) => {
									const date = new Date(value)
									return capitalize(
										date.toLocaleDateString(locale, {
											month: 'short',
											day: 'numeric'
										})
									)
								}}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										className='w-[150px]'
										nameKey='brand_name'
										labelFormatter={(value) => {
											return capitalize(
												new Date(value).toLocaleDateString(locale, {
													month: 'short',
													day: 'numeric',
													year: 'numeric'
												})
											)
										}}
									/>
								}
							/>
							<defs>
								<linearGradient id={`fill-${activeChart}`} x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor={`var(--color-${activeChart})`} stopOpacity={0.8} />
									<stop offset='95%' stopColor={`var(--color-${activeChart})`} stopOpacity={0.2} />
								</linearGradient>
							</defs>
							<Area
								dataKey='volumn'
								type='natural'
								fill={`url(#fill-${activeChart})`}
								fillOpacity={0.6}
								stroke={`var(--color-${activeChart})`}
								stackId='a'
							/>
						</AreaChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	)
}

const Tabs = tw.div`flex divide-x`
const TabsTrigger = tw.button`flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left tabular-nums even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6`
