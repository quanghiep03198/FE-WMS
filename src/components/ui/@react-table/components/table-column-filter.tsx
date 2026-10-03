import type { Column } from '@tanstack/react-table'
import { useUpdate } from 'ahooks'
import { pick } from 'lodash-es'
import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { useTranslation } from 'react-i18next'
import { Div, DropdownSelect, Icon } from '../..'
import { DateRangePicker } from '../../@core/date-range-picker'
import type { DebouncedInputProps } from '../../@custom/debounced-input'
import { DebouncedInput } from '../../@custom/debounced-input'
import { DEFAULT_ESTIMATE_SIZE } from '../constants'
import { useTableContext } from '../context/table.context'
import MultiSelectColumnFilter from './multi-select-column-filter'
import { NumberRangeFilter } from './number-range-filter'

type ColumnFilterProps<TData, TValue> = {
	column: Column<TData, TValue>
}

export function TableColumnFilter<TData, TValue>({ column }: ColumnFilterProps<TData, TValue>) {
	const { t } = useTranslation()
	const filterVariant = column.columnDef.meta?.filterVariant
	const columnFilterValue = column.getFilterValue()
	const [isAllFiltersCleared, setIsAllFiltersCleared] = useState(true)
	const { table, event$ } = useTableContext('table', 'event$')
	const rerender = useUpdate()

	event$.useSubscription((value) => {
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

	useEffect(() => {
		event$.emit(pick(table.getState(), ['rowSelection']))
	}, [columnFilterValue])

	// * Useful for server side filtering
	const metaUniqueValues = column.columnDef.meta?.facetedUniqueValues
	if (!column.columnDef.enableColumnFilter)
		return (
			<Div className='text-muted-foreground/50 flex h-full items-center justify-center px-2 text-xs font-medium select-none'>
				<Icon name='Minus' />
			</Div>
		)

	switch (filterVariant) {
		case 'range': {
			return <NumberRangeFilter column={column} />
		}
		case 'date': {
			const date = columnFilterValue as DateRange | undefined

			return (
				<DateRangePicker
					calendarProps={{
						defaultMonth: date?.from ?? new Date(),
						numberOfMonths: 1,
						selected: date,
						onSelect: (value) => {
							column.setFilterValue(value)
							rerender()
						}
					}}
					triggerProps={{
						className: 'border-none shadow-none hover:bg-background flex text-xs! font-medium'
					}}
				/>
			)
		}
		case 'select': {
			return (
				<DropdownSelect
					labelField='label'
					placeholder={t('ns_common:table.search_in_column')}
					valueField='value'
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
					selectProps={{
						defaultValue: '',
						value: isAllFiltersCleared ? '' : (column.getFilterValue() as string),
						onValueChange: (value) => {
							column.setFilterValue(value)
						}
					}}
					selectTriggerProps={{
						className:
							'min-w-32 px-4 rounded-none border-none text-xs font-medium text-muted-foreground ring-0 focus:ring-0 outline-none shadow-none hover:text-foreground focus:border-none ring-0',
						tabIndex: 0,
						style: { height: DEFAULT_ESTIMATE_SIZE }
					}}
				/>
			)
		}

		case 'multi-select': {
			return (
				<MultiSelectColumnFilter
					value={(columnFilterValue ?? []) as string[]}
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
					onValueChange={(value) => {
						column.setFilterValue(value)
					}}
				/>
			)
		}

		default: {
			return (
				<DebouncedInput
					id={column.id}
					placeholder={t('ns_common:table.search_in_column')}
					value={(isAllFiltersCleared ? '' : (columnFilterValue as DebouncedInputProps['value'])) ?? ''}
					onChange={(value) => column.setFilterValue(value)}
				/>
			)
		}
	}
}
