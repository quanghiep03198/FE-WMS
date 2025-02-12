import useQueryParams from '@/common/hooks/use-query-params'
import { DatePicker } from '@/components/ui'
import { format } from 'date-fns'

const DatePickerFilter: React.FC = () => {
	const { searchParams, setParams } = useQueryParams<{ 'date.eq': string }>({
		'date.eq': format(new Date(), 'yyyy-MM-dd')
	})
	return (
		<DatePicker
			selected={searchParams['date.eq'] ? new Date(searchParams['date.eq']) : new Date()}
			onSelect={(value) => setParams({ 'date.eq': format(value, 'yyyy-MM-dd') })}
			disabled={{ after: new Date() }}
		/>
	)
}

export default DatePickerFilter
