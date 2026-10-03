import { DatePicker } from '@components/ui'
import { format } from 'date-fns'
import { useReportPageQueryParams } from '../../features/report/hooks/use-report-page-query-params'

const DatePickerFilter: React.FC = () => {
	const { searchParams, setParams } = useReportPageQueryParams()

	return (
		<DatePicker
			disabled={{ after: new Date() }}
			selected={searchParams['date:eq'] ? new Date(searchParams['date:eq']) : new Date()}
			onSelect={(value) => setParams({ ...searchParams, 'date:eq': format(value, 'yyyy-MM-dd') })}
		/>
	)
}

export default DatePickerFilter
