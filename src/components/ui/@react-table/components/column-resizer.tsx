import { cn } from '@/common/utils/cn'
import { Header } from '@tanstack/react-table'
import { Separator } from '../../@core/separator'

type ColumnResizerProps<TData, TValue> = {
	header: Header<TData, TValue>
	visible: boolean
}

export default function ColumnResizer<TData, TValue>({ header, visible }: ColumnResizerProps<TData, TValue>) {
	return (
		visible && (
			<Separator
				onDoubleClick={header.column.resetSize}
				onMouseDown={header.getResizeHandler()}
				onTouchStart={header.getResizeHandler()}
				onTouchMove={header.getResizeHandler()}
				className={cn(
					'absolute right-0 top-0 z-0 h-full w-1 !cursor-col-resize touch-none select-none bg-border opacity-0 transition-opacity group-hover:opacity-100',
					header.column.columnDef.enableResizing && header.column.getCanResize() && 'hover:bg-primary',
					header.column.getIsResizing() && 'bg-primary !opacity-100'
				)}
			/>
		)
	)
}
