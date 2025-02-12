'use no memo'

import { cn } from '@/common/utils/cn'
import React, { forwardRef, useEffect, useId, useRef, useState } from 'react'
import { ControllerRenderProps, FieldValues, Path, useFormContext } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '..'
import { BaseFieldControl } from '../../../common/types/hook-form'
import { Input, InputProps } from '../@core/input'

export type InputFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & InputProps

export function InputFieldControl<T extends FieldValues>(
	props: InputFieldControlProps<T> & React.PropsWithRef<T> & React.RefAttributes<T>,
	ref?: React.ForwardedRef<HTMLInputElement>
) {
	const { control, getFieldState, getValues, watch } = useFormContext()
	const {
		label,
		name,
		className,
		disabled,
		placeholder,
		description,
		type,
		hidden,
		orientation,
		defaultValue = getValues(name),
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
		if (type === 'file') {
			field.onChange(e.target.files)
		} else if (type === 'number') {
			field.onChange(+e.target.value)
		} else {
			field.onChange(e)
		}
		if (typeof restProps.onChange === 'function') restProps.onChange(e)
	}

	const currentValue = watch(name)

	useEffect(() => {
		setValue(currentValue)
	}, [currentValue])

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
						{label && <FormLabel htmlFor={id}>{label}</FormLabel>}
						<FormControl>
							<Input
								id={id}
								className={cn(
									className,
									getFieldState(name).error && 'border-destructive bg-background focus:border-destructive',
									orientation === 'horizontal' && 'mb-2 block'
								)}
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
						</FormControl>
						{description && <FormDescription>{description}</FormDescription>}
						<FormMessage />
					</FormItem>
				)
			}}
		/>
	)
}

InputFieldControl.displayName = 'InputFieldControl'

export const ForwardedRefInputFieldControl = forwardRef<HTMLInputElement, InputFieldControlProps<any>>(
	InputFieldControl
)
