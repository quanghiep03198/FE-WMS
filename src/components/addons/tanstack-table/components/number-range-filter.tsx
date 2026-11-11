import { Div } from '@components/customs/div'
import { Separator } from '@components/ui/separator'
import type { Column } from '@tanstack/react-table'
import { useState } from 'react'
import { DebouncedInput } from '../../../customs/debounced-input'
import { useTableContext } from '../context/table.context'

export type NumberRangeFilterProps = { column: Column<any, any> }

export const NumberRangeFilter: React.FC<NumberRangeFilterProps> = ({ column }) => {
	const [isAllFiltersCleared, setIsAllFiltersCleared] = useState<boolean>(true)
	const { event$ } = useTableContext('event$')

	event$.useSubscription((value: { isAllFiltersCleared?: boolean }) => {
		if (typeof value.isAllFiltersCleared === 'boolean') setIsAllFiltersCleared(value.isAllFiltersCleared)
	})

	return (
		<Div className='flex items-center'>
			<DebouncedInput
				className='placeholder:text-muted-foreground/80 hover:text-foreground rounded-none border-none px-3 text-xs shadow-none placeholder:text-xs'
				placeholder={`Min ${!column.columnDef.meta?.disableFacetedRangeLimits && column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
				tabIndex={0}
				type='number'
				value={(isAllFiltersCleared ? '' : (column.getFilterValue() as [number, number]))?.[0] ?? ''}
				max={
					column.columnDef.meta?.disableFacetedRangeLimits
						? undefined
						: Number(column.getFacetedMinMaxValues()?.[1] ?? '')
				}
				min={
					column.columnDef.meta?.disableFacetedRangeLimits
						? undefined
						: Number(column.getFacetedMinMaxValues()?.[0] ?? '')
				}
				onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
			/>
			<Separator className='h-6 w-1' orientation='vertical' />
			<DebouncedInput
				className='placeholder:text-muted-foreground/80 hover:text-foreground rounded-none border-none px-3 text-xs shadow-none placeholder:text-xs'
				placeholder={`Max ${!column.columnDef.meta?.disableFacetedRangeLimits && column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
				tabIndex={0}
				type='number'
				value={(isAllFiltersCleared ? '' : (column.getFilterValue() as [number, number]))?.[1] ?? ''}
				max={
					column.columnDef.meta?.disableFacetedRangeLimits
						? undefined
						: Number(column.getFacetedMinMaxValues()?.[1] ?? '')
				}
				min={
					column.columnDef.meta?.disableFacetedRangeLimits
						? undefined
						: Number(column.getFacetedMinMaxValues()?.[0] ?? '')
				}
				onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
			/>
		</Div>
	)
}
