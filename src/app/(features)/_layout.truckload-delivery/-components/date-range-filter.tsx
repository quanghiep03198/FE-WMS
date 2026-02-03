import { DateRangePicker } from '@/components/ui'
import { format, isValid } from 'date-fns'
import { isNil, omitBy } from 'lodash-es'
import { usePageQueryParams } from '../-hooks/use-page-query-params'

const DateRangeFilter: React.FC = () => {
	const { searchParams, setParams } = usePageQueryParams()

	return (
		<DateRangePicker
			triggerProps={{ className: 'max-w-72' }}
			calendarProps={{
				selected: {
					from: isValid(new Date(searchParams.from)) ? new Date(searchParams.from) : undefined,
					to: isValid(new Date(searchParams.to)) ? new Date(searchParams.to) : undefined
				},
				onSelect: (value) => {
					const update = {
						...searchParams,
						...(isValid(value?.from) && { from: format(value?.from, 'yyyy-MM-dd') }),
						...(isValid(value?.to) && { to: format(value?.to, 'yyyy-MM-dd') })
					}
					setParams(omitBy(update, isNil))
				}
			}}
		/>
	)
}

export default DateRangeFilter
