import useQueryParams from '@/common/hooks/use-query-params'
import { DatePicker } from '@/components/ui'
import { format } from 'date-fns'
import { memo } from 'react'

const DatePickerFilter: React.FC = () => {
	const { searchParams, setParams } = useQueryParams<{ 'date.eq': string }>({
		'date.eq': format(new Date(), 'yyyy-MM-dd')
	})

	return (
		<DatePicker
			value={searchParams['date.eq']}
			onValueChange={(value) => setParams({ 'date.eq': format(value, 'yyyy-MM-dd') })}
		/>
	)
}

export default memo(DatePickerFilter)
