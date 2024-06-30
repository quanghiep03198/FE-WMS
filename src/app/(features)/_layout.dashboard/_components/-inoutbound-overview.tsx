import useMediaQuery from '@/common/hooks/use-media-query'
import { $mediaQuery } from '@/common/utils/media-query'
import { Div, Icon, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Typography } from '@/components/ui'
import { annuallIPStatistics } from '@/mocks/dashboard.data'
import { curveCardinal } from 'd3-shape'
import _ from 'lodash'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import tw from 'tailwind-styled-components'

const cardinal = curveCardinal.tension(0.2)

const InoutboundOverview: React.FC = () => {
	const isExtraLargeScreen = useMediaQuery($mediaQuery({ minWidth: 1920 }))

	return (
		<Card className='col-span-full max-h-full xl:col-span-2'>
			<CardHeader>
				<CardTitle>Import/Export Overview</CardTitle>
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
			</CardHeader>
			<CardContent>
				<ResponsiveContainer height={isExtraLargeScreen ? 384 : 288}>
					<AreaChart
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
						<defs>
							<linearGradient id='primary' x1='0' y1='0' x2='0' y2='100%'>
								<stop offset='1%' stopColor='hsl(var(--primary))' stopOpacity={0.8} />
								<stop offset='99%' stopColor='hsl(var(--primary))' stopOpacity={0} />
							</linearGradient>
						</defs>
						<defs>
							<linearGradient id='foreground' x1='0' y1='0' x2='0' y2='100%'>
								<stop offset='1%' stopColor='hsl(var(--foreground))' stopOpacity={0.3} />
								<stop offset='99%' stopColor='hsl(var(--foreground))' stopOpacity={0} />
							</linearGradient>
						</defs>
						<Area type='monotone' dataKey='import' stroke='hsl(var(--foreground)/0.3)' fill='url(#foreground)' />
						<Area type={cardinal} dataKey='export' stroke='hsl(var(--primary))' fill='url(#primary)' />
						<Legend align='center' margin={{ top: 80 }} formatter={(value) => _.capitalize(value)} />
					</AreaChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	)
}

const Card = tw.div`rounded-[var(--radius)] p-6 flex flex-col gap-4 shadow border justify-between bg-background`
const CardContent = tw.div`flex flex-col gap-6`
const CardHeader = tw.div`flex flex-row items-center justify-between space-y-0 font-medium text-sm`
const CardTitle = tw.h6`font-medium text-sm`

export default InoutboundOverview
