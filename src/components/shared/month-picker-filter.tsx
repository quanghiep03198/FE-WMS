import { MonthPicker } from '@/components/ui'
import useQueryParams from '@/hooks/use-query-params'
import { format, subYears } from 'date-fns'

export const MonthPickerFilter: React.FC = () => {
	const { searchParams, setParams } = useQueryParams<{ 'month:eq': string; 'auto-refresh': false | number }>()

	return (
		<MonthPicker
			maxDate={new Date(format(new Date(), 'yyyy-MM'))}
			minDate={new Date(format(subYears(new Date(), 3), 'yyyy-MM'))}
			selectedMonth={searchParams['month:eq'] ? new Date(searchParams['month:eq']) : new Date()}
			onMonthSelect={(date) => {
				setParams({ ...searchParams, 'month:eq': format(date, 'yyyy-MM') })
			}}
		/>
	)
}
