import { cn } from '@/common/utils/cn'
import { Header } from '@tanstack/react-table'
import { Div } from '../../@custom/div'
import { Separator } from '../../@shadcn/separator'

type ColumnResizerProps<TData, TValue> = {
	header: Header<TData, TValue>
}

export default function ColumnResizer<TData, TValue>({ header }: ColumnResizerProps<TData, TValue>) {
	return (
		<Separator
			onDoubleClick={header.column.resetSize}
			onMouseDown={header.getResizeHandler()}
			onTouchStart={header.getResizeHandler()}
			onTouchMove={header.getResizeHandler()}
			className={cn(
				'absolute right-0 top-1/2 z-10 h-3/5 w-1 -translate-y-1/2 !cursor-col-resize bg-border opacity-50 transition-opacity hover:opacity-100',
				header.column.columnDef.enableResizing && header.column.getCanResize() && 'hover:bg-primary',
				header.column.getIsResizing() && 'bg-primary !opacity-100'
			)}
		/>
	)
}
