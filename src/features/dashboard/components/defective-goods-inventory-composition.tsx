import { Div } from '@components/customs/div'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card'
import { ChartContainer, chartMarkRenderer, ChartPlot } from '@components/ui/chart'
import { useAnimatedChartValues } from '@components/ui/use-animated-chart-values'
import { Icon } from '@components/ui/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'
import { Skeleton } from '@components/ui/skeleton'
import type { SelectProps } from '@radix-ui/react-select'
import { defineChart } from '@tanstack/charts'
import { focusGroupAngle, pie, polar, radialArc } from '@tanstack/charts/polar'
import { tooltip } from '@tanstack/charts/tooltip'
import { capitalize } from 'lodash-es'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DefectiveCategory } from '../../defective-goods/constants/enums'
import { useDefectiveCategoryList } from '../../defective-goods/hooks/use-defective-category-list'
import { clipPieSweep } from '../helpers/clip-pie-sweep'
import { useDefectiveCategoryChartConfig } from '../hooks/use-defective-category-chart-configs'
import { useGetDefectiveGoodsInventoryCompositionQuery } from '../hooks/use-statistic-request'

type DefectiveChartDatum = { defective_category: DefectiveCategory; qty: number; fill: string }

const valueAccessors = {
	key: (row: DefectiveChartDatum) => row.defective_category,
	value: (row: DefectiveChartDatum) => row.qty,
	withValue: (row: DefectiveChartDatum, qty: number): DefectiveChartDatum => ({ ...row, qty })
}

const DefectiveGoodsInventoryOverview: React.FC = () => {
	const { t } = useTranslation()
	const [activeCategory, setActiveCategory] = useState<DefectiveCategory>(DefectiveCategory.B_GRADE)
	const chartConfig = useDefectiveCategoryChartConfig()
	const { data, isLoading } = useGetDefectiveGoodsInventoryCompositionQuery()

	const chartData = useMemo(() => {
		if (!data) return []
		return data.map((item) => ({ ...item, fill: `var(--color-${item.defective_category})` }))
	}, [data])
	const { values: animatedData, visibility } = useAnimatedChartValues(data ? chartData : undefined, valueAccessors)
	const slices = useMemo(
		() => clipPieSweep(
			pie(animatedData, { value: 'qty', startAngle: Math.PI / 2, endAngle: (-Math.PI * 3) / 2 }),
			visibility
		),
		[animatedData, visibility]
	)

	const activeIndex = useMemo(() => {
		if (!chartData || chartData.length === 0) return 0
		return chartData.findIndex((item) => item.defective_category === activeCategory)
	}, [activeCategory, chartData])
	const activeSlices = useMemo(
		() => slices.filter((item) => item.defective_category === activeCategory),
		[activeCategory, slices]
	)
	const unitLabel = capitalize(
		activeCategory === DefectiveCategory.C_GRADE ? t('ns_common:unit.pcs') : t('ns_common:unit.prs')
	)
	const activeQty = chartData[activeIndex]?.qty ?? 0
	const chartDefinition = useMemo(
		() =>
			defineChart({
				marks: [
					polar({
						radiusRatio: 0.78,
						scales: { angle: null, radius: null },
						marks: [
							radialArc(slices, {
								id: 'category-slices',
								renderer: chartMarkRenderer,
								key: 'defective_category',
								innerRadius: 60,
								cornerRadius: 6,
								fill: (item) => item.fill,
								stroke: 'var(--background)',
								strokeWidth: 4
							}),
							radialArc(activeSlices, {
								id: 'active-category',
								renderer: chartMarkRenderer,
								key: 'defective_category',
								innerRadius: 60,
								cornerRadius: 6,
								outerRadius: ({ radius }) => radius + 10,
								fill: (item) => item.fill,
								stroke: 'var(--background)',
								strokeWidth: 4
							}),
							radialArc(activeSlices, {
								id: 'active-category-ring',
								renderer: chartMarkRenderer,
								key: 'defective_category',
								innerRadius: ({ radius }) => radius + 12,
								outerRadius: ({ radius }) => radius + 22,
								cornerRadius: 4,
								fill: (item) => item.fill,
								stroke: 'var(--background)',
								strokeWidth: 3
							})
						]
					})
				],
				scales: { x: null, y: null },
				margin: 0,
				focus: focusGroupAngle,
				tooltip: {
					use: tooltip,
					anchor: 'group-center',
					placement: 'auto',
					content: (points) => {
						const point = points.find((candidate) => candidate.datum?.['defective_category'])
						if (!point) return { rows: [] }
						const category = point.datum['defective_category'] as DefectiveCategory
						const label = chartConfig[category]?.label ?? category
						return {
							title: String(label),

							rows: [
								{
									label: String(label),
									value: (chartData.find((item) => item.defective_category === category)?.qty ?? 0).toLocaleString(),
									color: `var(--color-${category})`
								}
							]
						}
					}
				}
			}),
		[activeSlices, slices, chartConfig, chartData]
	)

	const isEmpty = chartData.every((item) => item.qty === 0) && animatedData.every((item) => item.qty === 0)

	return (
		<Card className='@container/card h-full'>
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
			<CardContent className='flex-1 pb-0 flex flex-col items-center'>
				{isLoading ? (
					<Skeleton className='mx-auto size-64 m-6 self-center aspect-square rounded-full' />
				) : isEmpty ? (
					<Div className='bg-muted text-muted-foreground mx-auto flex h-full w-full items-center justify-center gap-2 rounded-lg'>
						<Icon name='ChartPie' size={32} strokeWidth={1} />
						{t('ns_common:table.no_data')}
					</Div>
				) : (
					<ChartContainer className='mx-auto relative aspect-square max-h-64' config={chartConfig}>
						<ChartPlot
							valueAnimation
							ariaLabel={t('ns_dashboard:defective_goods_inventory_overview')}
							className='self-center'
							definition={chartDefinition}
							height={256}
						/>
						<div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
							<span className='text-3xl font-bold tabular-nums'>{activeQty.toLocaleString()}</span>
							<span className='text-muted-foreground'>{unitLabel}</span>
						</div>
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
				<Div className='leading-none font-medium'>
					{t('ns_erp:fields.actual_inventory_qty')} {' : '}
					{isEmpty ? 0 : chartData.reduce((acc, curr) => acc + curr.qty, 0).toLocaleString()} (prs/pcs)
				</Div>
				<Div className='text-muted-foreground leading-none'>
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
			onValueChange={(value) => {
				if (typeof onValueChange === 'function') onValueChange(value)
			}}>
			<SelectTrigger className='mx-auto w-full max-w-56 @xl/card:ml-auto @2xl/card:mr-0'>
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
