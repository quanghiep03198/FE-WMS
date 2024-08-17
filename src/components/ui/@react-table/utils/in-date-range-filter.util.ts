import { FilterFn } from '@tanstack/react-table'
import { isWithinInterval } from 'date-fns'
import { DateRange } from 'react-day-picker'

export const dateRangeFilter: FilterFn<DateRange> = (row, columnId, filterValue: DateRange) => {
	console.log(row.getValue(columnId))
	return isWithinInterval(row.getValue(columnId), { start: filterValue?.from, end: filterValue?.to })
}
