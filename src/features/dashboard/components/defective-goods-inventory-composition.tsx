'use client'

import { Label, Pie, PieChart, Sector } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'

import {
	Card,
	CardAction,
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Skeleton
} from '@/components/ui'
import type { SelectProps } from '@radix-ui/react-select'
import { capitalize } from 'lodash-es'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDefectiveCategoryChartConfig } from '../hooks/use-defective-category-chart-configs'
import { useGetDefectiveGoodsInventoryCompositionQuery } from '../hooks/use-statistic-request'
import { DefectiveCategory } from '../../defective-goods/constants/enums'
import { useDefectiveCategoryList } from '../../defective-goods/hooks/use-defective-category-list'

const DefectiveGoodsInventoryOverview: React.FC = () => {
	const { t } = useTranslation()
	const [activeCategory, setActiveCategory] = useState<DefectiveCategory>(DefectiveCategory.B_GRADE)
	const chartConfig = useDefectiveCategoryChartConfig()
	const { data, isLoading } = useGetDefectiveGoodsInventoryCompositionQuery()

	const chartData = useMemo(() => {
		if (!data) return []
		return data.map((item) => ({ ...item, fill: `var(--color-${item.defective_category})` }))
	}, [data])

	const activeIndex = useMemo(() => {
		if (!chartData || chartData.length === 0) return 0
		return data.findIndex((item) => item.defective_category === activeCategory)
	}, [activeCategory, chartData])

	const isEmpty = !Array.isArray(chartData) || chartData.every((item) => item.qty === 0)

	return (
		<Card className='h-full @container/card'>
			<CardHeader>
				<CardTitle>{t('ns_dashboard:defective_goods_inventory_overview')}</CardTitle>
				<CardDescription className='text-pretty'>
					{t('ns_dashboard:defective_goods_inventory_overview_description')}
				</CardDescription>
				<CardAction className='hidden w-full @2xl/card:block'>
					{isLoading ? (
						<Skeleton className='h-9 w-full max-w-56' />
					) : (
						!isEmpty && (
							<PieCateogrySelect
								value={activeCategory}
								onValueChange={(value) => setActiveCategory(value as DefectiveCategory)}
							/>
						)
					)}
				</CardAction>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				{isLoading ? (
					<Skeleton className='mx-auto aspect-square max-h-64 rounded-full @xl/card:max-h-80' />
				) : isEmpty ? (
					<Div className='mx-auto flex h-full min-h-64 items-center justify-center gap-2 rounded-lg bg-muted text-muted-foreground'>
						<Icon name='ChartPie' size={32} strokeWidth={1} />
						{t('ns_common:table.no_data')}
					</Div>
				) : (
					<ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-64 @xl/card:max-h-80'>
						<PieChart>
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<Pie
								data={chartData}
								dataKey='qty'
								nameKey='defective_category'
								innerRadius={64}
								strokeWidth={8}
								activeIndex={activeIndex}
								activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
									<g>
										<Sector {...props} outerRadius={outerRadius + 6} />
										<Sector {...props} outerRadius={outerRadius + 16} innerRadius={outerRadius + 8} />
									</g>
								)}>
								<Label
									content={({ viewBox }) => {
										if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
											return (
												<text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
													<tspan
														x={viewBox.cx}
														y={viewBox.cy}
														className='fill-foreground text-3xl font-bold tabular-nums'>
														{chartData[activeIndex]?.qty?.toLocaleString()}
													</tspan>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy || 0) + 24}
														className='fill-muted-foreground'>
														{capitalize(
															activeCategory === DefectiveCategory.C_GRADE
																? t('ns_common:unit.pcs')
																: t('ns_common:unit.prs')
														)}
													</tspan>
												</text>
											)
										}
									}}
								/>
							</Pie>
						</PieChart>
					</ChartContainer>
				)}
				{isLoading ? (
					<Skeleton className='h-9 w-full max-w-56' />
				) : (
					!isEmpty && (
						<Div className='block w-full @2xl/card:hidden'>
							<PieCateogrySelect
								value={activeCategory}
								onValueChange={(value) => setActiveCategory(value as DefectiveCategory)}
							/>
						</Div>
					)
				)}
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'>
				<Div className='font-medium leading-none'>
					{t('ns_erp:fields.actual_inventory_qty')} {' : '}
					{isEmpty ? 0 : chartData.reduce((acc, curr) => acc + curr.qty, 0).toLocaleString()} (prs/pcs)
				</Div>
				<Div className='leading-none text-muted-foreground'>
					{t('ns_dashboard:all_time_defective_goods_inventory_qty')}
				</Div>
			</CardFooter>
		</Card>
	)
}

const PieCateogrySelect: React.FC<SelectProps> = ({ value, onValueChange }) => {
	const defectiveCategoryList = useDefectiveCategoryList()

	return (
		<Select
			defaultValue={DefectiveCategory.B_GRADE}
			value={value}
			onValueChange={(value) => onValueChange(value as DefectiveCategory)}>
			<SelectTrigger className='mx-auto max-w-56 @xl/card:ml-auto @2xl/card:mr-0'>
				<SelectValue placeholder='Select category' />
			</SelectTrigger>
			<SelectContent>
				{defectiveCategoryList.map((category, index) => (
					<SelectItem key={category.value} value={category.value}>
						<Div className='flex flex-nowrap items-center gap-x-2 text-ellipsis'>
							<Div
								className='aspect-square size-3! rounded'
								style={{ backgroundColor: `var(--chart-${index + 1})` }}
							/>
							{category.label}
						</Div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default DefectiveGoodsInventoryOverview
