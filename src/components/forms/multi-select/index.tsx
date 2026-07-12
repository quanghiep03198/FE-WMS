'use no memo'

import { Div, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui'
import type { BaseFieldControl } from '@common/types/hook-form'
import { cn } from '@common/utils/cn'
import { useId } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import type { MultiSelectProps } from '../../ui/@custom/multi-select'
import { MultiSelect } from '../../ui/@custom/multi-select'

export type MultipleSelectFieldControlProps<T extends FieldValues, D = Record<string, any>> = Omit<
	BaseFieldControl<T>,
	'control'
> &
	Partial<MultiSelectProps<D>>

export function MultiSelectFieldControl<T, D>(props: MultipleSelectFieldControlProps<T, D>) {
	const id = useId()
	const { control, formState, trigger } = useFormContext()
	const {
		name,
		placeholder,
		description,
		label,
		datalist,
		labelField,
		valueField,
		shouldFilter = true,
		defaultValue = [],
		orientation,
		hidden,
		classNames,
		onValueChange,
		onInput
	} = props

	const isInvalid = Boolean(formState.errors[name])

	return (
		<FormField
			name={name}
			control={control}
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
							<MultiSelect
								{...props}
								id={id}
								shouldFilter={shouldFilter}
								placeholder={placeholder}
								aria-invalid={isInvalid}
								datalist={datalist}
								labelField={labelField}
								valueField={valueField}
								defaultValue={defaultValue}
								classNames={classNames}
								value={field.value}
								onInput={(value) => {
									if (typeof onInput === 'function') onInput(value)
								}}
								onValueChange={(value) => {
									field.onChange(value)
									if (typeof onValueChange === 'function') onValueChange(value)
									if (formState.isSubmitted) trigger(name)
								}}
							/>
							<FormDescription>{description}</FormDescription>
							<FormMessage />
						</Div>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}
