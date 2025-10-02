'use client'

import { Label, Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui'
import { SelectProps } from '@radix-ui/react-select'
import { capitalize } from 'lodash'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDefectiveCategoryChartConfig } from '../-hooks/use-defective-category-chart-configs'
import { useGetDefectiveGoodsInventoryCompositionQuery } from '../-hooks/use-statistic-asm'
import { DefectiveCategory } from '../../_layout.(defective-goods)/-constants'
import { useDefectiveCategoryList } from '../../_layout.(defective-goods)/-hooks/use-defective-category-list'

export const description = 'A donut chart with an active sector'

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

	console.log(activeCategory)

	return (
		<Card className='h-full @container/card'>
			<CardHeader>
				<CardTitle>{t('ns_dashboard:defective_goods_inventory_overview')}</CardTitle>
				<CardDescription className='text-pretty'>
					{t('ns_dashboard:defective_goods_inventory_overview_description')}
				</CardDescription>
				<CardAction className='hidden w-full @2xl:block'>
					<PieCateogrySelect
						value={activeCategory}
						onValueChange={(value) => setActiveCategory(value as DefectiveCategory)}
					/>
				</CardAction>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-72 @2xl/card:max-h-80'>
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
												<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground'>
													{capitalize(t('ns_common:unit.prs'))}
												</tspan>
											</text>
										)
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
				<Div className='block @2xl:hidden'>
					<PieCateogrySelect
						value={activeCategory}
						onValueChange={(value) => setActiveCategory(value as DefectiveCategory)}
					/>
				</Div>
			</CardContent>
			<CardFooter className='flex-col items-start gap-2 text-sm'>
				<Div className='flex items-start gap-2 font-medium leading-none'>
					{t('ns_erp:fields.actual_inventory_qty')} -{' '}
					{chartData.reduce((acc, curr) => acc + curr.qty, 0).toLocaleString()} {t('ns_common:unit.prs')}
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
			<SelectTrigger className='mx-auto w-2/3 max-w-1/2 @md/card:max-w-full @2xl/card:ml-auto @2xl/card:max-w-full @2xl:mr-0'>
				<SelectValue placeholder='Select category' />
			</SelectTrigger>
			<SelectContent>
				{defectiveCategoryList.map((category, index) => (
					<SelectItem key={category.value} value={category.value}>
						<Div className='flex flex-nowrap items-center gap-x-2 overflow-ellipsis'>
							<Div
								className='aspect-square !size-3 rounded'
								style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }}
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
