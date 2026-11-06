import { ChartContainer, ChartPlot } from '@components/ui/chart'
import { defineChart } from '@tanstack/charts'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
import { tooltip } from '@tanstack/charts/tooltip'
import { useMemo, useState } from 'react'

type ActivePieDatum = {
	name: string
	value: number
	fill?: string
}

export function ActiveShapePieChart<T extends ActivePieDatum>({
	data,
	children
}: {
	data: T[]
	children?: React.ReactNode
}) {
	const [activeIndex, setActiveIndex] = useState(0)
	const slices = useMemo(
		() =>
			pie(
				data.map((item) => ({ ...item, fill: item.fill ?? 'var(--primary)' })),
				{ value: (item) => item.value }
			),
		[data]
	)
	const activeSlice = slices[activeIndex]
	const chartDefinition = useMemo(
		() =>
			defineChart({
				marks: [
					polar({
						inset: 16,
						marks: [
							radialArc(slices, {
								innerRadius: 64,
								fill: (item) => item.fill,
								stroke: 'var(--border)'
							}),
							...(activeSlice
								? [
										radialArc([activeSlice], {
											innerRadius: 64,
											outerRadius: ({ radius }) => radius + 6,
											fill: (item) => item.fill,
											stroke: 'var(--border)'
										})
									]
								: [])
						],
						scales: { angle: null, radius: null }
					})
				],
				scales: { x: null, y: null },
				svgAnimation: { duration: 300, easing: 'ease-out' },
				tooltip
			}),
		[activeSlice, slices]
	)

	return (
		<ChartContainer className='mx-auto aspect-square max-h-80 w-full' config={{ pie: { color: 'var(--primary)' } }}>
			<ChartPlot
				ariaLabel='Active pie chart'
				definition={chartDefinition}
				onFocusChange={(point) => {
					if (point) setActiveIndex(point.datum.index)
				}}
			/>
			<div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
				<span className='font-medium'>{activeSlice?.name}</span>
				<span>{activeSlice?.value.toLocaleString()}</span>
			</div>
			{children}
		</ChartContainer>
	)
}

export default ActiveShapePieChart
