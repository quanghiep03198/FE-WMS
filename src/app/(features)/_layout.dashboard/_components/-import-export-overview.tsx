import { Div, Icon, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Typography } from '@/components/ui'
import { annuallIPStatistics } from '@/mocks/dashboard.data'
import _ from 'lodash'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const ImportExportOverview: React.FC = () => {
	return (
		<Div className='rounded-lg border border-border'>
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
				<Div className='h-96 w-full p-6'>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart data={annuallIPStatistics}>
							<CartesianGrid strokeDasharray='1 1' stroke='hsl(var(--border))' />
							<XAxis dataKey='name' stroke='hsl(var(--muted-foreground))' className='capitalize' />
							<YAxis stroke='hsl(var(--muted-foreground))' />
							<Tooltip
								contentStyle={{
									backgroundColor: 'hsl(var(--popover))',
									border: '1px solid hsl(var(--border))',
									textTransform: 'capitalize'
								}}
							/>
							<Line
								type='monotone'
								dataKey='import'
								className='stroke-primary/50'
								stroke='hsl(var(--primary))'
								strokeWidth={1}
								activeDot={{ r: 4 }}
							/>
							<Line
								type='monotone'
								dataKey='export'
								stroke='hsl(var(--destructive))'
								strokeWidth={1}
								activeDot={{ r: 4 }}
							/>
							<Legend align='center' margin={{ top: 32 }} formatter={(value) => _.capitalize(value)} />
						</LineChart>
					</ResponsiveContainer>
				</Div>
			</Div>
		</Div>
	)
}

export default ImportExportOverview
