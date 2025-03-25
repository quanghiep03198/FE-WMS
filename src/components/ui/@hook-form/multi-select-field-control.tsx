import { BaseFieldControl } from '@/common/types/hook-form'
import { cn } from '@/common/utils/cn'
import { useId } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel } from '../@core/form'
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectInput,
	MultiSelectItem,
	MultiSelectList,
	MultiSelectTrigger
} from '../@custom/multi-select'

export type MultiSelectFieldControlProps<T extends FieldValues, D> = BaseFieldControl<T> & {
	datalist: Array<D>
	labelField: keyof D
	valueField: keyof D
}

export function MultiSelectFieldControl<T extends FieldValues, D extends Record<string, any>>(
	props: MultiSelectFieldControlProps<T, D>
) {
	const { control, getValues, getFieldState } = useFormContext()
	const id = useId()

	const {
		name,
		hidden,
		label,
		orientation,
		className,
		placeholder = 'Select',
		datalist,
		labelField,
		valueField
	} = props

	const isError = Boolean(getFieldState(name).error)
	console.log(getValues(name))

	return (
		<FormField
			name={name}
			control={control}
			defaultValue={[]}
			render={({ field }) => (
				<FormItem
					className={cn({
						hidden,
						'grid grid-cols-[1fr_2fr] grid-rows-4 items-center gap-x-2 space-y-0': orientation === 'horizontal'
					})}>
					{label && (
						<FormLabel
							htmlFor={id}
							className={cn(orientation === 'horizontal' && (isError ? 'row-span-2' : 'row-span-4'))}>
							{label}
						</FormLabel>
					)}
					<MultiSelect
						values={field.value}
						onValuesChange={(values) => {
							console.log(values)
							field.onChange(values)
						}}>
						<MultiSelectTrigger
							id={id}
							className={cn(
								'bg-background focus:border-primary',
								className,
								isError && 'w-full border-destructive focus:border-destructive active:border-destructive'
							)}>
							<MultiSelectInput placeholder={placeholder} />
						</MultiSelectTrigger>
						<MultiSelectContent>
							<MultiSelectList>
								{Array.isArray(datalist) &&
									datalist?.map((item) => (
										<MultiSelectItem key={item[valueField]} value={item[valueField]}>
											{item[labelField]}
										</MultiSelectItem>
									))}
							</MultiSelectList>
						</MultiSelectContent>
					</MultiSelect>
				</FormItem>
			)}
		/>
	)
}
