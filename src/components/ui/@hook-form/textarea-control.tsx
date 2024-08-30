import { cn } from '@/common/utils/cn'
import { forwardRef, useId, useRef } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Textarea } from '..'
import { BaseFieldControl } from '../../../common/types/hook-form'
import { TextareaProps } from '../@core/textarea'

export type TextareaFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & TextareaProps

function TextareaFieldControl<T extends FieldValues>(
	props: TextareaFieldControlProps<T> & React.PropsWithoutRef<T> & React.RefAttributes<T>,
	ref: React.ForwardedRef<HTMLTextAreaElement>
) {
	const { getFieldState, getValues } = useFormContext()

	const {
		label,
		name,
		className,
		disabled,
		control,
		placeholder,
		description,
		hidden,
		orientation,
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
					className={cn({
						hidden,
						'grid grid-cols-[1fr_2fr] items-center gap-x-2 space-y-0': orientation === 'horizontal'
					})}>
					{label && <FormLabel htmlFor={id}>{label}</FormLabel>}
					<FormControl>
						<Textarea
							{...field}
							id={id}
							placeholder={placeholder}
							className={cn(
								className,
								getFieldState(name).error && 'border-destructive focus:border-destructive'
							)}
							value={field.value}
							disabled={disabled}
							onChange={(e) => {
								field.onChange(e)
								if (onChange) onChange(e)
							}}
							ref={(e) => {
								field.ref(e)
								resolvedRef.current = e
							}}
							{...restProps}>
							{defaultValue}
						</Textarea>
					</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

TextareaFieldControl.displayName = 'TextareaFieldControl'

const ForwardedRefTextareaFieldControl = forwardRef(TextareaFieldControl)

export { ForwardedRefTextareaFieldControl }
