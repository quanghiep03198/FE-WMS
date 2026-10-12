import formatIntlNumber from '@common/utils/format-intl-number'
import { Div } from '@components/customs/div'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent
} from '@components/ui/chart'
import { Icon } from '@components/ui/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Skeleton } from '@components/ui/skeleton'
import { useDateLocale } from '@hooks/use-date-locale'
import { format } from 'date-fns'
import { capitalize } from 'lodash-es'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
						<Skeleton className='w-full place-content-center place-items-center @xs:h-72 @xl:h-96 @3xl:max-h-full @3xl:min-h-104' />
					) : isEmpty ? (
						<Div className='bg-muted text-muted-foreground flex w-full items-center justify-center gap-x-2 rounded-lg @xs:h-72 @xl:h-96 @3xl:min-h-104'>
							<Icon name='ChartColumnBig' size={32} strokeWidth={1} />
							{t('ns_common:table.no_data')}
						</Div>
					) : (
						<ChartContainer
							className='w-full @xs:h-72 @xl:h-96 @3xl:max-h-full @3xl:min-h-104'
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
								<XAxis axisLine={false} dataKey='month' tickLine={false} tickMargin={10} />
								<ChartTooltip
									content={<ChartTooltipContent className='min-w-48' indicator='dot' />}
									cursor={false}
								/>
								<YAxis stroke='var(--muted-foreground)' tickFormatter={formatIntlNumber} />
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
