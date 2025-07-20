import { Column } from '@tanstack/react-table'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import { Div, DropdownSelect, Icon } from '../..'
import { DateRangePicker } from '../../@core/date-range-picker'
import { DEFAULT_ESTIMATE_SIZE } from '../constants'
import { useTableContext } from '../context/table.context'
import { DebouncedInput } from './debounced-input'
import MultiSelectColumnFilter from './multi-select-column-filter'
import { NumberRangeFilter } from './number-range-filter'

type ColumnFilterProps<TData, TValue> = {
	column: Column<TData, TValue>
}

export function ColumnFilter<TData, TValue>({ column }: ColumnFilterProps<TData, TValue>) {
	const { t } = useTranslation()
	const filterVariant = column.columnDef.meta?.filterVariant
	const [isAllFiltersCleared, setIsAllFiltersCleared] = useState(true)
	const { event$ } = useTableContext('event$')

	event$.useSubscription((value: { isAllFiltersCleared?: boolean }) => {
		if (typeof value.isAllFiltersCleared === 'boolean') setIsAllFiltersCleared(value.isAllFiltersCleared)
	})

	const getFacetedUniqueValues = () => {
		try {
			return column.getFacetedUniqueValues()
		} catch {
			return new Map()
		}
	}

	const getSortedUniqueValues = () => {
		const facetedUniqueValues = getFacetedUniqueValues()
		const uniqueValues = Array.from(facetedUniqueValues?.keys())
		uniqueValues.sort((a, b) => {
			if (a === b) return 0
			return a > b ? 1 : -1
		})
		return uniqueValues
	}

	// * Useful for server side filtering
	const metaUniqueValues = column.columnDef.meta?.facetedUniqueValues
	if (!column.columnDef.enableColumnFilter)
		return (
			<Div className='flex h-full select-none items-center justify-center px-2 text-xs font-medium text-muted-foreground/50'>
				<Icon name='Minus' />
			</Div>
		)

	switch (filterVariant) {
		case 'range': {
			return <NumberRangeFilter column={column} />
		}
		case 'date': {
			const date = column.getFilterValue() as DateRange | undefined

			return (
				<DateRangePicker
					triggerProps={{
						className: 'border-none shadow-none hover:bg-background flex !text-xs font-medium'
					}}
					calendarProps={{
						defaultMonth: date?.from ?? new Date(),
						numberOfMonths: 1,
						selected: date,
						onSelect: (value) => column.setFilterValue(value)
					}}
				/>
			)
		}
		case 'select': {
			return (
				<DropdownSelect
					selectTriggerProps={{
						className:
							'min-w-[8rem] px-4 rounded-none border-none text-xs font-medium text-muted-foreground ring-0 focus:ring-0 outline-none shadow-none hover:text-foreground focus:border-none ring-0',
						tabIndex: 0,
						style: { height: DEFAULT_ESTIMATE_SIZE }
					}}
					selectProps={{
						defaultValue: '',
						value: isAllFiltersCleared ? '' : (column.getFilterValue() as string),
						onValueChange: (value) => {
							column.setFilterValue(value)
						}
					}}
					placeholder={t('ns_common:table.search_in_column')}
					datalist={
						Array.isArray(metaUniqueValues)
							? metaUniqueValues
							: getSortedUniqueValues()
									.filter((value) => Boolean(value))
									.map((value: any) => ({
										label: value,
										value: value
									}))
					}
					labelField='label'
					valueField='value'
				/>
			)
		}

		case 'multi-select': {
			return (
				<MultiSelectColumnFilter
					value={(column.getFilterValue() ?? []) as string[]}
					onValueChange={(value) => column.setFilterValue(value)}
					datalist={
						Array.isArray(metaUniqueValues)
							? metaUniqueValues
							: getSortedUniqueValues()
									.filter((value) => Boolean(value))
									.map((value: any) => ({
										label: value,
										value: value
									}))
					}
				/>
			)
		}

		default: {
			return (
				<DebouncedInput
					value={(isAllFiltersCleared ? '' : (column.getFilterValue() as any)) ?? ''}
					placeholder={t('ns_common:table.search_in_column')}
					onChange={(value) => column.setFilterValue(value)}
				/>
			)
		}
	}
}
