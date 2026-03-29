import type { ClassValue } from 'clsx'
import type { FieldValues } from 'react-hook-form'

export interface BaseFieldControl<T extends FieldValues> {
	name: Path<T>
	label?: string
	description?: string
	hidden?: boolean
	disabled?: boolean
	placeholder?: string
	defaultValue?: string
	className?: ClassValue
	orientation?: 'vertical' | 'horizontal'
	errorMessageVariant?: 'tooltip' | 'inline'
}
