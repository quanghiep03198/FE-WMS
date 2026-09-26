'use no memo'

import type { BaseFieldControl } from '@common/types/hook-form'
import { Div, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@components/ui'
import { useId } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import type { MultiSelectProps } from '../../ui/@custom/multi-select'
import { MultiSelect } from '../../ui/@custom/multi-select'

export type MultipleSelectFieldControlProps<T extends FieldValues, D extends Record<string, any>> = Omit<
	BaseFieldControl<T>,
	'control'
> &
	Partial<MultiSelectProps<D>>

export function MultiSelectFieldControl<T extends FieldValues, D extends Record<string, any>>(
	props: MultipleSelectFieldControlProps<T, D>
) {
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
					aria-orientation={orientation}
					className='space-y-2 aria-hidden:hidden aria-[orientation=horizontal]:grid aria-[orientation=horizontal]:grid-cols-[1fr_2fr] aria-[orientation=horizontal]:items-start aria-[orientation=horizontal]:gap-2 aria-[orientation=horizontal]:space-y-0'>
					{label && (
						<FormLabel
							htmlFor={id}
							aria-hidden={hidden}
							aria-orientation={orientation}
							className='text-pretty aria-[orientation=horizontal]:translate-y-3/4 aria-[orientation=horizontal]:align-middle aria-[orientation=horizontal]:leading-none'>
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
								datalist={datalist!}
								labelField={labelField!}
								valueField={valueField!}
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
