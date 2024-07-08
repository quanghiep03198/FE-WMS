import { Column } from '@tanstack/react-table'
import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Div, DropdownSelect, Icon } from '../..'
import { TableContext } from '../context/table.context'
import { DebouncedInput } from './debounced-input'
import { NumberRangeFilter } from './number-range-filter'

type ColumnFilterProps<TData, TValue> = {
	column: Column<TData, TValue>
}

export function ColumnFilter<TData, TValue>({ column }: ColumnFilterProps<TData, TValue>) {
	const { t } = useTranslation()
	const filterType = column.columnDef.filterFn
	const { hasNoFilter } = useContext(TableContext)
	const metaFilterValues = column.columnDef.meta?.facetedUniqueValues

	const sortedUniqueValues = useMemo(
		() => (filterType === 'inNumberRange' ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
		[column.getFacetedUniqueValues()]
	)

	if (!column.columnDef.enableColumnFilter)
		return (
			<Div className='flex h-full select-none items-center justify-center px-2 text-xs font-medium text-muted-foreground/50'>
				<Icon name='Minus' />
			</Div>
		)

	switch (filterType) {
		case 'inNumberRange':
			return <NumberRangeFilter column={column} />

		case 'equals':
			return (
				<DropdownSelect
					selectTriggerProps={{
						className:
							'min-w-[8rem] px-4 rounded-none border-none text-xs font-medium text-muted-foreground/80 ring-0 focus:ring-0 outline-none shadow-none hover:text-foreground focus:border-none ring-0',
						tabIndex: 0
					}}
					placeholder={t('ns_common:table.search_in_column')}
					onValueChange={(value) => column.setFilterValue(value)}
					options={
						Array.isArray(metaFilterValues)
							? metaFilterValues
							: sortedUniqueValues
									.filter((value) => Boolean(value))
									.map((value: any) => ({
										label: value,
										value: value
									}))
					}
				/>
			)

		default:
			return (
				<DebouncedInput
					value={(hasNoFilter ? '' : (column.getFilterValue() as any)) ?? ''}
					placeholder={t('ns_common:table.search_in_column')}
					onChange={(value) => column.setFilterValue(value)}
				/>
			)
	}
}
