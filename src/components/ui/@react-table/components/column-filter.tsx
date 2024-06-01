import { cn } from '@/common/utils/cn';
import { Column } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import { Box, DropdownSelect, Icon, buttonVariants } from '../..';
import { TableContext } from '../context/table.context';
import { ComboboxFilter } from './combobox-filter';
import { DebouncedInput } from './debounced-input';
import Tooltip from '../../@override/tooltip';

type ColumnFilterProps<TData, TValue> = {
	column: Column<TData, TValue>;
};

export function ColumnFilter<TData, TValue>({ column }: ColumnFilterProps<TData, TValue>) {
	const { isScrolling, areAllFiltersCleared } = useContext(TableContext);

	const filterType = column.columnDef.filterFn;
	const columnFilterValue = column.getFilterValue();

	const sortedUniqueValues = useMemo(
		() => (filterType === 'inNumberRange' ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
		[column.getFacetedUniqueValues()]
	);

	if (!column.columnDef.enableColumnFilter)
		return (
			<Tooltip content='Bộ lọc không được áp dụng'>
				<Box className='cursor- flex h-9 select-none items-center justify-center px-2 text-xs font-medium text-muted-foreground/50'>
					<Icon name='Minus' />
				</Box>
			</Tooltip>
		);

	switch (filterType) {
		case 'inNumberRange':
			return (
				<Box>
					<Box className='flex items-stretch'>
						<DebouncedInput
							type='number'
							className={cn(buttonVariants({ variant: 'ghost' }), 'h-9 rounded-none border-none pl-2 text-xs hover:text-foreground')}
							min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
							max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
							value={(areAllFiltersCleared ? '' : (columnFilterValue as [number, number]))?.[0] ?? ''}
							onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
							placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
						/>
						<DebouncedInput
							type='number'
							className={cn(buttonVariants({ variant: 'ghost' }), 'h-9 rounded-none border-none pl-2 text-xs hover:text-foreground')}
							min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
							max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
							value={(areAllFiltersCleared ? '' : (columnFilterValue as [number, number]))?.[1] ?? ''}
							onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
							placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
						/>
					</Box>
				</Box>
			);

		case 'equals':
			return (
				<DropdownSelect
					selectTriggerProps={{
						className:
							'h-9 min-w-[8rem] rounded-none border-none text-xs font-medium text-muted-foreground/50 shadow-none hover:text-foreground focus:border-none'
					}}
					placeholder='Chọn ...'
					options={sortedUniqueValues
						.filter((value) => Boolean(value))
						.map((value: any) => ({
							label: value,
							value: value
						}))}
					onValueChange={(value) => column.setFilterValue(value)}
				/>
			);

		default:
			return (
				<ComboboxFilter
					areAllFiltersCleared={areAllFiltersCleared}
					placeholder='Tìm kiếm trong cột ...'
					forceClose={isScrolling}
					options={sortedUniqueValues
						.slice(0, 1000)
						.filter((value) => Boolean(value))
						.map((value: any) => ({
							label: value,
							value: value
						}))}
					className='h-9 w-full rounded-none border-none pl-2 text-xs shadow-none'
					onChange={(value) => column.setFilterValue(value)}
				/>
			);
	}
}
