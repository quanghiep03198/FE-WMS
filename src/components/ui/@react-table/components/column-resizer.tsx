import { cn } from '@/common/utils/cn';
import { Header } from '@tanstack/react-table';
import { useContext } from 'react';
import { TableContext } from '../context/table.context';

type ColumnResizerProps<TData, TValue> = {
	header: Header<TData, TValue>;
};

export default function ColumnResizer<TData, TValue>({ header }: ColumnResizerProps<TData, TValue>) {
	const { isFilterOpened } = useContext(TableContext);

	return (
		<div
			onDoubleClick={() => header.column.resetSize()}
			onMouseDown={header.getResizeHandler()}
			onTouchStart={header.getResizeHandler()}
			onTouchMove={header.getResizeHandler()}
			className={cn(
				'absolute right-0 top-1/2 z-10 w-1 -translate-y-1/2 cursor-col-resize bg-border',
				isFilterOpened ? 'h-12' : 'h-6',
				header.column.columnDef.enableResizing ? 'cursor-col-resize' : 'cursor-default',
				{
					'hover:bg-primary': header.column.columnDef.enableResizing,
					'cursor-col-resize bg-primary': header.column.getIsResizing()
				}
			)}
		/>
	);
}
