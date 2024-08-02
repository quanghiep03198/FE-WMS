import { cn } from '@/common/utils/cn'
import { TableCell } from '@/components/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Cell, Row } from '@tanstack/react-table'
import React from 'react'

type DraggableCellProps<TData = unknown, TValue = unknown> = {
	cell: Cell<TData, TValue>
	row: Row<TData>
} & React.PropsWithChildren &
	Partial<React.ComponentProps<typeof TableCell>>

const DraggableCell: React.FC<DraggableCellProps> = ({ cell, row, style, children, ...props }) => {
	const { setNodeRef, transform, isDragging } = useSortable({
		id: cell.column.id
	})

	return (
		<TableCell
			{...props}
			key={cell.id}
			ref={setNodeRef}
			className={cn(isDragging && 'z-10 !border-x')}
			style={{
				transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
				transition: 'width transform 0.2s ease-in-out',
				...style
			}}>
			{children}
		</TableCell>
	)
}

export default DraggableCell
