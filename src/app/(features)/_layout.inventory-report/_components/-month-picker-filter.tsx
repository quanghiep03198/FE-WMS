import useQueryParams from '@/common/hooks/use-query-params'
import { MonthPicker } from '@/components/ui'
import { format } from 'date-fns'

export const MonthPickerFilter: React.FC = () => {
	const { searchParams, setParams } = useQueryParams<{ 'month.eq': string; 'auto-refresh': false | number }>({
		'month.eq': format(new Date(), 'yyyy-MM'),
		'auto-refresh': false
	})

	return (
		<MonthPicker
			maxDate={new Date(format(new Date(), 'yyyy-MM'))}
			selectedMonth={new Date(searchParams['month.eq'])}
			onMonthSelect={(date) => {
				setParams({ ...searchParams, 'month.eq': format(date, 'yyyy-MM') })
			}}
		/>
	)
}
