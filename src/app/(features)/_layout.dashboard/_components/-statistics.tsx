import { Div, Icon, TDivProps, Typography } from '@/components/ui'
import { i18n } from '@/i18n'
import { ResourceKey, ResourceKeys } from 'i18next'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import tw from 'tailwind-styled-components'

const data = new Array(6).fill(null).map(() => ({
	order_number: Math.round(Math.random() * 10000),
	inventory_number: Math.round(Math.random() * 10000),
	import_number: Math.round(Math.random() * 10000),
	export_number: Math.round(Math.random() * 10000),
	defective_rate: Math.round(Math.random() * 100)
}))

type TStatistic = {
	category: string
	value: number | string
	dataField: 'order_number' | 'inventory_number' | 'import_number' | 'export_number' | 'defective_rate'
	icon: React.ComponentProps<typeof Icon>['name']
	comparision: number
}

const Statistics: React.FC = () => {
	const { t, i18n } = useTranslation(['ns_dashboard'])

	const statistics = useMemo<TStatistic[]>(
		() => [
			{
				category: t('ns_dashboard:statistic.order_number'),
				dataField: 'order_number',
				value: new Intl.NumberFormat().format(Math.round(Math.random() * 10000)),
				icon: 'Receipt',
				comparision: 25
			},
			{
				category: t('ns_dashboard:statistic.inventory_number'),
				dataField: 'inventory_number',
				value: new Intl.NumberFormat().format(Math.round(Math.random() * 10000)),
				icon: 'Container',
				comparision: 25
			},
			{
				category: t('ns_dashboard:statistic.inbound_number'),
				dataField: 'import_number',
				value: new Intl.NumberFormat().format(Math.round(Math.random() * 10000)),
				icon: 'GitPullRequestCreate',
				comparision: 5
			},
			{
				category: t('ns_dashboard:statistic.outbound_number'),
				dataField: 'export_number',
				value: new Intl.NumberFormat().format(Math.round(Math.random() * 10000)),
				icon: 'GitBranchPlus',
				comparision: 8
			}
		],
		[t, i18n.language]
	)

	return (
		<Div className='col-span-full grid grid-cols-2 gap-2 @container lg:grid-cols-4 xl:col-span-1'>
			{statistics.map((stats, index) => (
				<Card key={index}>
					<CardHeader className='@container'>
						<CardTitle className='@[200px]:text-sm'>{stats.category}</CardTitle>
						<Icon name={stats.icon} size={18} />
					</CardHeader>
					<CardContent>
						<Div className='space-y-0.5'>
							<Typography variant='h5' className='font-bold'>
								{stats.value}
							</Typography>
							<Typography variant='small' color='muted' className='text-xs'>
								{t('ns_dashboard:compare_from_last_month', { value: stats.comparision + '%' })}
							</Typography>
						</Div>

						<ResponsiveContainer className='mt-auto' height={48}>
							<AreaChart data={data}>
								<defs>
									<linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='100%'>
										<stop offset='1%' stopColor='hsl(var(--primary))' stopOpacity={0.8} />
										<stop offset='99%' stopColor='hsl(var(--primary))' stopOpacity={0} />
									</linearGradient>
								</defs>
								<Area
									type='monotone'
									dataKey={stats.dataField}
									fillOpacity={0.8}
									stroke='hsl(var(--primary))'
									fill='url(#colorPv)'
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			))}
		</Div>
	)
}

const Card = tw.div`rounded-[var(--radius)] p-3 aspect-square flex flex-col gap-2 xxl:gap-3 shadow border bg-background md:aspect-[2/1] lg:aspect-[2/1]`
const CardContent = tw.div`flex flex-col gap-6 justify-between flex-1`
const CardHeader = tw.div`flex flex-row items-center justify-between space-y-0 font-medium text-sm`
const CardTitle = tw.h6`font-medium text-xs`

export default Statistics
