'use no memo'

import { BaseFieldControl } from '@/common/types/hook-form'
import { cn } from '@/common/utils/cn'
import { useId } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormMessage } from '../../@core/form'
import {
	InputTag,
	InputTagSelectContent,
	InputTagSelectInput,
	InputTagSelectItem,
	InputTagSelectList,
	InputTagTrigger
} from '../../@custom/tag-input'

export type TagInputFieldControlProps<T extends FieldValues, D> = BaseFieldControl<T> & {
	datalist: Array<D>
	labelField: keyof D
	valueField: keyof D
}

export function TagInputFieldControl<T extends FieldValues, D extends Record<string, any>>(
	props: TagInputFieldControlProps<T, D>
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

	return (
		<FormField
			name={name}
			control={control}
			defaultValue={getValues(name)}
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
					<InputTag values={field.value} onValuesChange={field.onChange}>
						<InputTagTrigger
							id={id}
							className={cn(
								className,
								isError && 'w-full border-destructive focus-within:border-destructive active:border-destructive'
							)}>
							<InputTagSelectInput placeholder={placeholder} />
						</InputTagTrigger>
						<InputTagSelectContent>
							<InputTagSelectList>
								{Array.isArray(datalist) &&
									datalist?.map((item) => (
										<InputTagSelectItem key={item[valueField]} value={item[valueField]}>
											{item[labelField]}
										</InputTagSelectItem>
									))}
							</InputTagSelectList>
						</InputTagSelectContent>
					</InputTag>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
