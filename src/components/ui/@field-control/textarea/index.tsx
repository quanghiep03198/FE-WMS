import { cn } from '@/common/utils/cn'
import { useId, useRef } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { Div, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Textarea } from '../..'
import { BaseFieldControl } from '../../../../common/types/hook-form'

export type TextareaFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & React.ComponentProps<'textarea'>

export function TextareaFieldControl<T extends FieldValues>(props: TextareaFieldControlProps<T>) {
	const { control, getFieldState, getValues } = useFormContext()

	const {
		label,
		name,
		className,
		disabled,
		placeholder,
		description,
		hidden,
		ref,
		orientation,
		rows = 5,
		defaultValue = getValues(name),
		onChange,
		...restProps
	} = props
	const localRef = useRef<typeof Textarea.prototype>(null)
	const resolvedRef = (ref ?? localRef) as typeof localRef
	const id = useId()

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem
					className={cn(
						orientation === 'horizontal' ? 'grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0' : 'space-y-2',
						hidden && 'hidden'
					)}>
					{label && (
						<FormLabel
							htmlFor={id}
							className={cn(
								'text-pretty',
								orientation === 'horizontal' && 'translate-y-3/4 align-middle leading-none'
							)}>
							{label}
						</FormLabel>
					)}
					<FormControl>
						<Div className='space-y-2'>
							<Textarea
								{...field}
								id={id}
								placeholder={placeholder}
								className={cn(
									className,
									getFieldState(name).error && 'border-destructive focus-visible:ring-0'
								)}
								value={field.value}
								disabled={disabled}
								onChange={(e) => {
									field.onChange(e)
									if (typeof onChange === 'function') onChange(e)
								}}
								rows={rows}
								ref={(e) => {
									field.ref(e)
									resolvedRef.current = e
								}}
								{...restProps}>
								{defaultValue}
							</Textarea>
							{description && <FormDescription>{description}</FormDescription>}
							<FormMessage />
						</Div>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}

TextareaFieldControl.displayName = 'TextareaFieldControl'
