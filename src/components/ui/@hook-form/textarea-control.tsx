import { forwardRef, useId, useRef } from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormMessage, Textarea } from '..'
import { FieldValues } from 'react-hook-form'
import { TextareaProps } from '../@shadcn/textarea'
import { cn } from '@/common/utils/cn'
import { BaseFieldControl } from '../../../common/types/hook-form'
import FormLabel from './alternative-form-label'

export type TextareaFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & TextareaProps

function TextareaFieldControl<T extends FieldValues>(
	props: TextareaFieldControlProps<T> & React.PropsWithoutRef<T> & React.RefAttributes<T>,
	ref: React.ForwardedRef<HTMLTextAreaElement>
) {
	const {
		label,
		name,
		className,
		disabled,
		type,
		control,
		placeholder,
		description,
		hidden,
		orientation,
		messageType = 'alternative',
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
						'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': orientation === 'horizontal'
					})}>
					<FormLabel htmlFor={id} labelText={String(label)} messageType={messageType} />
					<FormControl>
						<Textarea
							{...field}
							id={id}
							placeholder={placeholder}
							value={field.value}
							onChange={(e) => {
								field.onChange(e)
								if (onChange) onChange(e)
							}}
							ref={(e) => {
								field.ref(e)
								resolvedRef.current = e
							}}
							{...restProps}
						/>
					</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					{messageType === 'alternative' && <FormMessage />}
				</FormItem>
			)}
		/>
	)
}

TextareaFieldControl.displayName = 'TextareaFieldControl'

const ForwardedRefTextareaFieldControl = forwardRef(TextareaFieldControl)

export { ForwardedRefTextareaFieldControl }
