import { useState } from 'react'
import { Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'

export function ActiveShapePieChart<T>({ data, children }: { data: T[]; children?: React.ReactNode }) {
	const [activeIndex, setActiveIndex] = useState(0)

	return (
		<ResponsiveContainer height='100%' width='100%'>
			<PieChart height={320} width={320}>
				<Pie
					activeIndex={activeIndex}
					activeShape={renderActiveShape}
					data={data}
					dataKey='value'
					fill='var(--primary)'
					innerRadius={64}
					outerRadius={96}
					stroke='var(--border)'
					onMouseEnter={(_, index) => setActiveIndex(index)}
				/>
				{children}
			</PieChart>
		</ResponsiveContainer>
	)
}

export const renderActiveShape = (props) => {
	const RADIAN = Math.PI / 180
	const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
	const sin = Math.sin(-RADIAN * midAngle)
	const cos = Math.cos(-RADIAN * midAngle)
	const sx = cx + (outerRadius + 10) * cos
	const sy = cy + (outerRadius + 10) * sin
	const mx = cx + (outerRadius + 30) * cos
	const my = cy + (outerRadius + 30) * sin
	const ex = mx + (cos >= 0 ? 1 : -1) * 24
	const ey = my
	const textAnchor = cos >= 0 ? 'start' : 'end'

	return (
		<g>
			<text dy={8} fill={fill} textAnchor='middle' x={cx} y={cy}>
				{payload.name}
			</text>
			<Sector
				cx={cx}
				cy={cy}
				endAngle={endAngle}
				fill={fill}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
			/>
			<Sector
				cx={cx}
				cy={cy}
				endAngle={endAngle}
				fill={fill}
				innerRadius={outerRadius + 6}
				outerRadius={outerRadius + 10}
				startAngle={startAngle}
			/>
			<path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} fill='none' stroke={fill} />
			<circle cx={ex} cy={ey} fill={fill} r={2} stroke='none' />
			<text textAnchor={textAnchor} x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey}>
				{`PV ${value}`}
			</text>
			<text dy={18} fill='var(--foreground)' textAnchor={textAnchor} x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey}>
				{`(Rate ${(percent * 100).toFixed(2)}%)`}
			</text>
		</g>
	)
}

export default ActiveShapePieChart
