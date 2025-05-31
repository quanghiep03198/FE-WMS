'use no memo'

import { BaseFieldControl } from '@/common/types/hook-form'
import { FieldValues, useFormContext } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../@core/form'
import { MultiSelect, MultiSelectProps } from '../../@custom/multi-select'

type MultipleSelectFieldControlProps<T extends FieldValues, D = Record<string, any>> = Omit<
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
		onValueChange,
		onInput
	} = props

	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem className='max-w-full overflow-x-hidden'>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<MultiSelect
							{...props}
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
						/>
					</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
// xuất tách đơn 分單出貨

// xuất gộp đơn 出貨單
