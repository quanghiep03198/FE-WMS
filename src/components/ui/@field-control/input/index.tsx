'use no memo'

import { cn } from '@/common/utils/cn'
import React, { useEffect, useId, useRef, useState } from 'react'
import { ControllerRenderProps, FieldValues, Path, useFormContext } from 'react-hook-form'
import { Div, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Icon, Toggle } from '../..'
import { BaseFieldControl } from '../../../../common/types/hook-form'
import { Input } from '../../@core/input'

export type InputFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & React.ComponentProps<'input'>

export function InputFieldControl<T extends FieldValues>(props: InputFieldControlProps<T>) {
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
		ref,
		...restProps
	} = props

	const id = useId()
	const [value, setValue] = useState<string>(defaultValue)
	const localRef = useRef<typeof Input.prototype>(null)
	const resolvedRef = (ref ?? localRef) as typeof localRef
	const [currentType, setCurrentType] = useState<React.HTMLInputTypeAttribute>(type)

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
						className={cn(
							orientation === 'horizontal'
								? 'grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0'
								: 'space-y-2',
							(type === 'hidden' || hidden) && 'hidden'
						)}>
						{label && (
							<FormLabel
								htmlFor={id}
								className={orientation === 'horizontal' && 'translate-y-3/4 align-middle leading-none'}>
								{label}
							</FormLabel>
						)}
						<FormControl>
							<Div className='space-y-2'>
								<Div className='relative'>
									<Input
										id={id}
										aria-invalid={!!getFieldState(name).error}
										type={currentType}
										ref={(e) => {
											field.ref(e)
											if (resolvedRef.current) {
												resolvedRef.current = e
											}
										}}
										value={value}
										placeholder={placeholder}
										disabled={disabled}
										className={cn(
											className,
											'aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-within:border-destructive',
											orientation === 'horizontal' && 'mb-2 block',
											type === 'password' && 'placeholder:font-pass'
										)}
										style={{ ...props.style, letterSpacing: type === 'password' ? '1px' : 'normal' }}
										onChange={(e) => handleChange(e, field)}
										{...restProps}
									/>
									{type === 'password' && (
										<Toggle
											className={cn(
												'absolute inset-y-0 right-0 z-20 data-[state=on]:bg-transparent hover:bg-transparent'
											)}
											type='button'
											onPressedChange={(pressed) => setCurrentType(pressed ? 'text' : 'password')}>
											<Icon name={currentType === 'password' ? 'Eye' : 'EyeOff'} />
										</Toggle>
									)}
								</Div>
								{description && <FormDescription>{description}</FormDescription>}
								{!!getFieldState(name).error && <FormMessage />}
							</Div>
						</FormControl>
					</FormItem>
				)
			}}
		/>
	)
}

InputFieldControl.displayName = 'InputFieldControl'
