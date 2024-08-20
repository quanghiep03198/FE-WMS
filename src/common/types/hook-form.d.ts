import { ClassValue } from 'clsx'
import { FieldValues } from 'react-hook-form'

export interface BaseFieldControl<T extends FieldValues> {
	name: Path<T>
	control: Control<T>
	label?: string
	description?: string
	hidden?: boolean
	placeholder?: string
	defaultValue?: string
	className?: ClassValue
	orientation?: 'vertical' | 'horizontal'
}
