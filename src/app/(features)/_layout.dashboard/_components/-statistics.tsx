import { Card, CardContent, CardHeader, CardTitle, Div, Icon, Typography } from '@/components/ui'
import { i18n } from '@/i18n'
import { ResourceKey, ResourceKeys } from 'i18next'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart } from 'recharts'

const data = new Array(6).fill(null).map(() => ({
	inventory_number: Math.round(Math.random() * 10000),
	import_number: Math.round(Math.random() * 10000),
	export_number: Math.round(Math.random() * 10000),
	defective_rate: Math.round(Math.random() * 100)
}))

type TStatistic = {
	category: string
	value: number | string
	dataField: 'inventory_number' | 'import_number' | 'export_number' | 'defective_rate'
	icon: React.ComponentProps<typeof Icon>['name']
	comparision: number
}

const Statistics: React.FC = () => {
	const { t, i18n } = useTranslation(['ns_dashboard'])

	const statistics = useMemo<TStatistic[]>(
		() => [
			{
				category: t('ns_dashboard:statistic.inventory_number'),
				dataField: 'inventory_number',
				value: new Intl.NumberFormat().format(Math.round(Math.random() * 10000)),
				icon: 'Container',
				comparision: 25
			},
			{
				category: t('ns_dashboard:statistic.wh_import_receipt_number'),
				dataField: 'import_number',
				value: new Intl.NumberFormat().format(Math.round(Math.random() * 10000)),
				icon: 'GitPullRequestCreate',
				comparision: 5
			},
			{
				category: t('ns_dashboard:statistic.wh_export_receipt_number'),
				dataField: 'export_number',
				value: new Intl.NumberFormat().format(Math.round(Math.random() * 10000)),
				icon: 'GitBranchPlus',
				comparision: 8
			}
		],
		[t, i18n.language]
	)

	return (
		<Div className='grid grid-cols-3 gap-4 sm:grid-cols-1'>
			{statistics.map((stats) => (
				<Card className='rounded-lg border border-border shadow'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 p-4'>
						<CardTitle className='text-sm font-medium'>{stats.category}</CardTitle>
						<Icon name={stats.icon} size={18} />
					</CardHeader>
					<CardContent className='px-4'>
						<Div className='flex justify-between gap-x-4'>
							<Div className='space-y-0.5'>
								<Typography variant='h5' className='font-bold'>
									{stats.value}
								</Typography>
								<Typography variant='small' color='muted'>
									{t('ns_dashboard:compare_from_last_month', { value: stats.comparision + '%' })}
								</Typography>
							</Div>

							<AreaChart width={16 * 10} height={16 * 4} data={data}>
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
						</Div>
					</CardContent>
				</Card>
			))}
		</Div>
	)
}

export default Statistics
