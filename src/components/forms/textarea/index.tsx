import { cn } from '@common/utils/cn'
import { useId, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import type { BaseFieldControl } from '../../../common/types/hook-form'
import { Div, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Textarea } from '../../ui'

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
					aria-hidden={hidden}
					aria-orientation={orientation}
					className='space-y-2 aria-hidden:hidden aria-[orientation=horizontal]:grid aria-[orientation=horizontal]:grid-cols-[1fr_2fr] aria-[orientation=horizontal]:items-start aria-[orientation=horizontal]:gap-2 aria-[orientation=horizontal]:space-y-0'>
					{label && (
						<FormLabel
							htmlFor={id}
							aria-orientation={orientation}
							className='text-pretty aria-[orientation=horizontal]:translate-y-3/4 aria-[orientation=horizontal]:align-middle aria-[orientation=horizontal]:leading-none'>
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
