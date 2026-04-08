import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	Badge,
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Div,
	Icon,
	Skeleton,
	Typography
} from '@/components/ui'

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
	formatPercentageChange,
	getAnalysisSentence,
	getDetailDescription,
	getIconColor,
	getTrendingIcon
} from '../-helpers'
import { useGetStatisticsQuery } from '../-hooks/use-statistic-asm'

const PercentageBadge: React.FC<{ percentage: number | null }> = ({ percentage }) => (
	<Badge variant='outline' className='gap-x-2'>
		<Icon size={12} name={getTrendingIcon(percentage)} style={{ color: getIconColor(percentage) }} />
		{formatPercentageChange(percentage)}
	</Badge>
)

const Statistics: React.FC = () => {
	const { t } = useTranslation(['ns_dashboard'])
	const { data, isLoading } = useGetStatisticsQuery()

	if (isLoading)
		return (
			<Div className='grid h-full w-full grid-cols-2 gap-4 @6xl/statistics:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, idx) => (
					<Card key={idx} className='min-h-52'>
						<CardHeader>
							<CardDescription>
								<Skeleton className='h-3' />
							</CardDescription>
							<CardTitle>
								<Skeleton className='h-9 w-32' />
							</CardTitle>
							<CardAction>
								<Skeleton className='h-6 w-12' />
							</CardAction>
						</CardHeader>
						<CardFooter className='flex-col items-start gap-1.5 text-sm'>
							<Skeleton className='h-5 w-3/4' />
							<Skeleton className='h-3 w-2/3' />
							<Skeleton className='h-3 w-1/2' />
						</CardFooter>
					</Card>
				))}
			</Div>
		)

	return (
		<Div className='grid h-full w-full grid-cols-2 gap-4 @6xl/statistics:grid-cols-4 [&_div[data-slot=card-description]]:!capitalize'>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>{t('ns_dashboard:statistic.inbound_quantity')}</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						{formatIntlNumber(data?.curr_month_inbound ?? 0)}
					</CardTitle>
					<CardAction>
						<PercentageBadge percentage={data?.inbound_percentage_change} />
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<Typography variant='small' className='line-clamp-1 flex gap-2 font-medium'>
						{t(getAnalysisSentence(data?.inbound_percentage_change), { ns: 'ns_dashboard', defaultValue: null })}{' '}
						<Icon name={getTrendingIcon(data?.inbound_percentage_change)} />
					</Typography>
					<Typography variant='small' className='lowercase text-muted-foreground first-letter:uppercase'>
						{t(
							...getDetailDescription(
								data?.inbound_percentage_change,
								data?.inbound_difference,
								t('ns_common:unit.prs')
							)
						)}
					</Typography>
				</CardFooter>
			</Card>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>{t('ns_dashboard:statistic.outbound_quantity')}</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						{formatIntlNumber(data?.curr_month_outbound ?? 0)}
					</CardTitle>
					<CardAction>
						<PercentageBadge percentage={data?.outbound_percentage_change} />
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<Typography variant='small' className='line-clamp-1 flex gap-2 font-medium'>
						{t(getAnalysisSentence(data?.outbound_percentage_change), { ns: 'ns_dashboard', defaultValue: null })}{' '}
						<Icon name={getTrendingIcon(data?.outbound_percentage_change)} />
					</Typography>
					<Typography variant='small' className='lowercase text-muted-foreground first-letter:uppercase'>
						{t(
							...getDetailDescription(
								data?.outbound_percentage_change,
								data?.outbound_difference,
								t('ns_common:unit.prs')
							)
						)}
					</Typography>
				</CardFooter>
			</Card>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>{t('ns_dashboard:statistic.inventory_number')}</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						{formatIntlNumber(data?.curr_month_final_qty ?? 0)}
					</CardTitle>
					<CardAction>
						<PercentageBadge percentage={data?.inventory_percentage_change} />
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<Typography variant='small' className='line-clamp-1 flex gap-2 font-medium'>
						{t(getAnalysisSentence(data?.inventory_percentage_change), {
							ns: 'ns_dashboard',
							defaultValue: null
						})}
						<Icon name={getTrendingIcon(data?.inventory_percentage_change)} />
					</Typography>
					<Typography variant='small' className='lowercase text-muted-foreground first-letter:uppercase'>
						{t(
							...getDetailDescription(
								data?.inventory_percentage_change,
								data?.inventory_difference,
								t('ns_common:unit.prs')
							)
						)}
					</Typography>
				</CardFooter>
			</Card>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>{t('ns_dashboard:statistic.inventory_turnover')}</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						{formatIntlNumber(data?.curr_month_turnover ?? 0)}
					</CardTitle>
					<CardAction>
						<PercentageBadge percentage={data?.turnover_percentage_change} />
					</CardAction>
				</CardHeader>
				<CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<Typography variant='small' className='line-clamp-1 flex gap-2 font-medium'>
						{t(getAnalysisSentence(data?.turnover_percentage_change), {
							ns: 'ns_dashboard',
							defaultValue: null
						})}
						<Icon name={getTrendingIcon(data?.turnover_percentage_change)} />
					</Typography>
					<Typography variant='small' className='lowercase text-muted-foreground first-letter:uppercase'>
						{t(
							...getDetailDescription(
								data?.turnover_percentage_change,
								data?.inventory_turnover_difference,
								t('ns_common:unit.times')
							)
						)}
					</Typography>
				</CardFooter>
			</Card>
		</Div>
	)
}

export default Statistics
