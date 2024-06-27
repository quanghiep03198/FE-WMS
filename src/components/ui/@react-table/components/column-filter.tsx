import { cn } from '@/common/utils/cn'
import { Column } from '@tanstack/react-table'
import { useContext, useMemo } from 'react'
import { Div, DropdownSelect, Icon, buttonVariants, Tooltip, Separator } from '../..'
import { TableContext } from '../context/table.context'
import { ComboboxFilter } from './combobox-filter'
import { DebouncedInput } from './debounced-input'
import { useTranslation } from 'react-i18next'

type ColumnFilterProps<TData, TValue> = {
	column: Column<TData, TValue>
}

export function ColumnFilter<TData, TValue>({ column }: ColumnFilterProps<TData, TValue>) {
	const { columnFilters, globalFilter } = useContext(TableContext)
	const { t } = useTranslation()

	const filterType = column.columnDef.filterFn
	const columnFilterValue = column.getFilterValue()

	const sortedUniqueValues = useMemo(
		() => (filterType === 'inNumberRange' ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
		[column.getFacetedUniqueValues()]
	)

	const hasNoFilter = useMemo(() => columnFilters.length === 0 && globalFilter.length === 0, [])

	if (!column.columnDef.enableColumnFilter)
		return (
			<Div className='flex h-full select-none items-center justify-center px-2 text-xs font-medium text-muted-foreground/50'>
				<Icon name='Minus' />
			</Div>
		)

	switch (filterType) {
		case 'inNumberRange':
			return (
				<Div className='flex items-center'>
					<DebouncedInput
						type='number'
						className='rounded-none border-none px-3 text-xs shadow-none placeholder:text-muted-foreground/50 hover:text-foreground'
						min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
						max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
						value={(hasNoFilter ? '' : (columnFilterValue as [number, number]))?.[0] ?? ''}
						onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
						placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
					/>
					<Separator orientation='vertical' className='h-6' />
					<DebouncedInput
						type='number'
						className='rounded-none border-none px-3 text-xs shadow-none placeholder:text-muted-foreground/50 hover:text-foreground'
						min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
						max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
						value={(hasNoFilter ? '' : (columnFilterValue as [number, number]))?.[1] ?? ''}
						onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
						placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
					/>
				</Div>
			)

		case 'equals':
			return (
				<DropdownSelect
					selectTriggerProps={{
						className:
							'min-w-[8rem] rounded-none border-none text-xs font-medium text-muted-foreground/50 shadow-none hover:text-foreground focus:border-none ring-0'
					}}
					placeholder={t('ns_common:table.search_in_column')}
					options={sortedUniqueValues
						.filter((value) => Boolean(value))
						.map((value: any) => ({
							label: value,
							value: value
						}))}
					onValueChange={(value) => column.setFilterValue(value)}
				/>
			)

		default:
			return (
				<ComboboxFilter
					placeholder='Tìm kiếm trong cột ...'
					className='h-9 w-full rounded-none border-none pl-2 text-xs shadow-none'
					onChange={(value) => column.setFilterValue(value)}
					options={sortedUniqueValues
						.filter((value) => Boolean(value))
						.map((value: any) => ({
							label: value,
							value: value
						}))}
				/>
			)
	}
}
