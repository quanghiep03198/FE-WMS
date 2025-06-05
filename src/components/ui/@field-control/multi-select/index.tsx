'use no memo'

import { BaseFieldControl } from '@/common/types/hook-form'
import { cn } from '@/common/utils/cn'
import { useId } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../@core/form'
import { Div } from '../../@custom/div'
import { MultiSelect, MultiSelectProps } from '../../@custom/multi-select'

export type MultipleSelectFieldControlProps<T extends FieldValues, D = Record<string, any>> = Omit<
	BaseFieldControl<T>,
	'control'
> &
	Partial<MultiSelectProps<D>>

export function MultiSelectFieldControl<T, D>(props: MultipleSelectFieldControlProps<T, D>) {
	const { control, trigger } = useFormContext()
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
		onValueChange,
		onInput
	} = props

	const id = useId()

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
								id={id}
								shouldFilter={shouldFilter}
								placeholder={placeholder}
								datalist={datalist}
								labelField={labelField}
								valueField={valueField}
								value={field.value}
								defaultValue={defaultValue}
								onInput={(value) => {
									if (typeof onInput === 'function') onInput(value)
								}}
								onValueChange={(value) => {
									field.onChange(value)
									if (typeof onValueChange === 'function') onValueChange(value)
									trigger(name)
								}}
								{...props}
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
// xuất tách đơn 分單出貨

// xuất gộp đơn 出貨單
