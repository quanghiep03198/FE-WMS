import { useContext } from 'react'
import { DebouncedInput } from './debounced-input'
import { TableContext } from '../context/table.context'
import { Separator, Div } from '@/components/ui'
import { Column } from '@tanstack/react-table'

type NumberRangeFilterProps<TData, TValue> = { column: Column<TData, TValue> }

export function NumberRangeFilter<TData, TValue>({ column }: NumberRangeFilterProps<TData, TValue>) {
	const { hasNoFilter } = useContext(TableContext)

	return (
		<Div className='flex items-center'>
			<DebouncedInput
				type='number'
				tabIndex={0}
				className='rounded-none border-none px-3 text-xs shadow-none placeholder:text-xs placeholder:text-muted-foreground/80 hover:text-foreground'
				min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
				max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
				value={(hasNoFilter ? '' : (column.getFilterValue() as [number, number]))?.[0] ?? ''}
				onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
				placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
			/>
			<Separator orientation='vertical' className='h-6 w-1' />
			<DebouncedInput
				type='number'
				tabIndex={0}
				className='rounded-none border-none px-3 text-xs shadow-none placeholder:text-xs placeholder:text-muted-foreground/80 hover:text-foreground'
				min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
				max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
				value={(hasNoFilter ? '' : (column.getFilterValue() as [number, number]))?.[1] ?? ''}
				onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
				placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
			/>
		</Div>
	)
}
