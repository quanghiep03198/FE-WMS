'use no memo'

import { cn } from '@/common/utils/cn'
import { Div, Icon, InputFieldControl, SelectFieldControl } from '@/components/ui'
import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { use } from 'react'
import { UseFieldArrayRemove, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DecentralizedPoFormContext } from '../../-contexts/separated-form-context'

const DroppableFieldItem: React.FC<{
	id: string
	index: number
	onRemove: UseFieldArrayRemove
}> = ({ id, index, onRemove }) => {
	const { t } = useTranslation()
	const { sizes } = use(DecentralizedPoFormContext)
	const { watch, setValue } = useFormContext()

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		animateLayoutChanges: (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
		transition: {
			duration: 300, // milliseconds
			easing: 'cubic-bezier(0.25, 0.5, 0.5, 1.25)'
		}
	})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	}

	return (
		<Div style={style} {...attributes}>
			<Div className='flex items-stretch gap-x-2'>
				<button
					{...listeners}
					ref={setNodeRef}
					type='button'
					onClick={(e) => {
						e.stopPropagation()
						onRemove(index)
					}}
					className={cn(
						'inline-flex h-9 basis-4 items-center justify-center rounded text-muted-foreground transition-colors duration-200 hover:text-foreground',
						isDragging ? 'cursor-grabbing' : 'cursor-grab'
					)}>
					<Icon name='GripVertical' size={14} />
				</button>
				<Div className='flex-1'>
					<SelectFieldControl
						name={`sizes.${index}.size_numcode`}
						datalist={sizes}
						labelField='size_numcode'
						valueField='size_numcode'
						disabled={!watch('mo_no')}
						placeholder='Select size'
						onValueChange={(value) => {
							const maxSizeQty = sizes.find((item) => item.size_numcode === value)?.count ?? 0
							setValue(`sizes.${index}.size_qty`, maxSizeQty)
						}}
					/>
				</Div>
				<Div className='flex-1'>
					<InputFieldControl
						name={`sizes.${index}.qty`}
						type='number'
						disabled={!watch(`sizes.${index}.size_numcode`)}
						placeholder={t('ns_common:common_fields.quantity_with_limit', {
							limit: watch(`sizes.${index}.size_qty`) || 0,
							defaultValue: `Quantity (max ${watch(`sizes.${index}.size_qty`)})`
						})}
					/>
				</Div>
				<button
					type='button'
					onClick={() => onRemove(index)}
					className='inline-flex h-9 basis-4 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-destructive'>
					<Icon name='X' size={14} strokeWidth={3} />
				</button>
			</Div>
		</Div>
	)
}

export default DroppableFieldItem
