import { Div, Typography } from '@/components/ui'
import { transactionOverview } from '@/mocks/dashboard.data'
import React from 'react'
import { Cell, Legend, Pie, Tooltip } from 'recharts'
import { PieChart } from 'recharts'

const TransactionOverview: React.FC = () => {
	return (
		<Div className='col-span-full flex flex-col items-center justify-center space-y-6 lg:col-span-1 xl:col-span-1'>
			<Typography className='text-center font-medium'>Order Status Overview</Typography>
			<PieChart width={320} height={240}>
				<Pie
					data={transactionOverview}
					innerRadius={48}
					outerRadius={96}
					fill='hsl(var(--primary))'
					stroke='hsl(var(--border))'
					paddingAngle={2}
					dataKey='value'>
					{transactionOverview.map((item) => (
						<Cell key={item.name} fill={item.color} />
					))}
				</Pie>
				<Tooltip
					itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
					contentStyle={{
						background: 'hsl(var(--popover))',
						border: '1px solid hsl(var(--border))',
						borderRadius: '4px'
					}}
				/>
				<Legend />
			</PieChart>
		</Div>
	)
}

export default TransactionOverview
