import {
	Div,
	Icon,
	ScrollArea,
	ScrollBar,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Typography
} from '@/components/ui'
import { annuallIPStatistics, transactionOverview } from '@/mocks/dashboard.data'
import { curveCardinal } from 'd3-shape'
import _ from 'lodash'
import { Area, AreaChart, Cell, Pie, PieChart } from 'recharts'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const cardinal = curveCardinal.tension(0.2)

const ImportExportOverview: React.FC = () => {
	return (
		<Div className=''>
			<Div className='flex items-center justify-between p-6'>
				<Typography className='font-medium'>Import/Export Overview</Typography>
				<Div className='inline-flex items-center gap-x-3'>
					<Icon name='CalendarDays' size={18} />
					<Select defaultValue='2024'>
						<SelectTrigger className='w-[180px]' defaultChecked>
							<SelectValue placeholder='-- Select --' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='2024'>2024</SelectItem>
							<SelectItem value='2023'>2023</SelectItem>
							<SelectItem value='2022'>2022</SelectItem>
						</SelectContent>
					</Select>
				</Div>
			</Div>
			<Div>
				<Div className='h-[400px] w-full p-6 sm:p-2'>
					<ResponsiveContainer width='100%' height='100%' minWidth='100%'>
						<AreaChart
							width={500}
							height={400}
							data={annuallIPStatistics}
							margin={{
								top: 0,
								right: 0,
								left: 0,
								bottom: 0
							}}>
							<CartesianGrid strokeDasharray='1 1' stroke='hsl(var(--border))' />
							<XAxis dataKey='name' stroke='hsl(var(--muted-foreground))' className='capitalize' />
							<YAxis stroke='hsl(var(--muted-foreground))' />
							<Tooltip />
							<Area
								type='monotone'
								dataKey='import'
								stroke='hsl(var(--foreground)/0.3)'
								fill='hsl(var(--foreground))'
								fillOpacity={0.1}
							/>
							<Area
								type={cardinal}
								dataKey='export'
								stroke='hsl(var(--primary))'
								fill='hsl(var(--primary))'
								fillOpacity={0.3}
							/>
							<Legend align='center' margin={{ top: 80 }} formatter={(value) => _.capitalize(value)} />
						</AreaChart>
					</ResponsiveContainer>
				</Div>
			</Div>
		</Div>
	)
}

export default ImportExportOverview
