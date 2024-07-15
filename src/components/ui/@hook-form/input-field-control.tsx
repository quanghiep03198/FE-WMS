import { cn } from '@/common/utils/cn'
import React, { forwardRef, memo, useId, useRef, useState } from 'react'
import { ControllerRenderProps, FieldValues, Path, useFormContext } from 'react-hook-form'
import { Div, FormControl, FormDescription, FormField, FormItem, FormMessage } from '..'
import { BaseFieldControl } from '../../../common/types/hook-form'
import { Input, InputProps } from '../@core/input'
import FormLabel from './alternative-form-label'

export type InputFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & InputProps

export function InputFieldControl<T extends FieldValues>(
	props: InputFieldControlProps<T> & React.PropsWithRef<T> & React.RefAttributes<T>,
	ref?: React.ForwardedRef<HTMLInputElement>
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
		type,
		hidden,
		orientation,
		defaultValue = getValues(name),
		messageType = 'alternative',
		...restProps
	} = props

	const id = useId()
	const [value, setValue] = useState<string>(defaultValue)
	const localRef = useRef<typeof Input.prototype>(null)
	const resolvedRef = (ref ?? localRef) as typeof localRef

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: ControllerRenderProps<FieldValues, Path<FieldValues>>
	) => {
		setValue(e.target.value)
		if (restProps.onChange) restProps.onChange(e)
		if (type === 'file') {
			field.onChange(e.target.files)
		} else if (type === 'number') {
			field.onChange(+e.target.value)
		} else {
			field.onChange(e)
		}
	}

	return (
		<FormField
			control={control}
			name={name}
			defaultValue={defaultValue}
			render={({ field }) => {
				return (
					<FormItem
						className={cn({
							'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': orientation === 'horizontal',
							hidden: type === 'hidden' || hidden
						})}>
						{label && <FormLabel htmlFor={id} labelText={label} messageType={messageType} />}
						<FormControl>
							<Div className='relative'>
								<Input
									id={id}
									className={cn(className, {
										'border-destructive focus:!border-destructive': !!getFieldState(name).error
									})}
									value={value}
									placeholder={placeholder}
									ref={(e) => {
										field.ref(e)
										if (resolvedRef.current) {
											resolvedRef.current = e
										}
									}}
									disabled={disabled}
									type={type ?? 'text'}
									onChange={(e) => handleChange(e, field)}
									{...restProps}
								/>
							</Div>
						</FormControl>
						<FormDescription>{description}</FormDescription>
						{messageType === 'standard' && <FormMessage />}
					</FormItem>
				)
			}}
		/>
	)
}

InputFieldControl.displayName = 'InputFieldControl'

export const ForwardedRefInputFieldControl = memo(
	forwardRef<HTMLInputElement, InputFieldControlProps<any>>(InputFieldControl)
)
