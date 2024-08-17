/* eslint-disable react-hooks/rules-of-hooks */
import { Column } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Div, DropdownSelect, Icon } from '../..'
import { DateRangePicker } from '../../@core/date-range-picker'
import { useTableContext } from '../context/table.context'
import { DebouncedInput } from './debounced-input'
import { NumberRangeFilter } from './number-range-filter'
import { ESTIMATE_SIZE } from './table'

type ColumnFilterProps<TData, TValue> = {
	column: Column<TData, TValue>
}

export function ColumnFilter<TData, TValue>({ column }: ColumnFilterProps<TData, TValue>) {
	const { t } = useTranslation()
	const filterVariant = column.columnDef.meta?.filterVariant
	const { hasNoFilter } = useTableContext()

	const sortedUniqueValues = useMemo(() => {
		if (column && column.getFacetedUniqueValues && column.getFilterValue) {
			const facedUniqueValue = column.getFacetedUniqueValues() ?? new Map()
			const uniqueValues = Array.from(facedUniqueValue.keys())

			uniqueValues.sort((a, b) => {
				if (a === b) return 0
				return a > b ? 1 : -1
			})

			return uniqueValues
		} else return []
	}, [column])

	const metaFilterValues = column.columnDef.meta?.facetedUniqueValues

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
			return (
				<DateRangePicker
					triggerProps={{
						className: 'border-none shadow-none hover:bg-background flex !text-xs font-medium'
					}}
					calendarProps={{
						selected: column.getFilterValue(),
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
						style: { height: ESTIMATE_SIZE }
					}}
					selectProps={{
						defaultValue: '',
						onValueChange: (value) => {
							column.setFilterValue(value)
						}
					}}
					placeholder={t('ns_common:table.search_in_column')}
					data={
						Array.isArray(metaFilterValues)
							? metaFilterValues
							: sortedUniqueValues
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
		default: {
			return (
				<DebouncedInput
					value={(hasNoFilter ? '' : (column.getFilterValue() as any)) ?? ''}
					placeholder={t('ns_common:table.search_in_column')}
					onChange={(value) => column.setFilterValue(value)}
				/>
			)
		}
	}
}
