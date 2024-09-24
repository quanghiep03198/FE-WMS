import { cn } from '@/common/utils/cn'
import React, { useId } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import {
	Div,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '..'
import { BaseFieldControl } from '../../../common/types/hook-form'

export type SelectFieldControlProps<T extends FieldValues, D> = BaseFieldControl<T> &
	React.ComponentProps<typeof Select> & {
		datalist: Array<D>
		labelField: keyof D
		valueField: keyof D
	}

export function SelectFieldControl<T extends FieldValues, D extends Record<string, any>>(
	props: SelectFieldControlProps<T, D>
) {
	const { getValues, getFieldState } = useFormContext()
	const id = useId()

	const {
		control,
		name,
		hidden,
		label,
		orientation,
		className,
		placeholder = 'Select',
		datalist,
		labelField,
		valueField,
		onValueChange,
		...restProps
	} = props

	return (
		<FormField
			name={name!}
			defaultValue={getValues(name)}
			control={control}
			render={({ field }) => {
				return (
					<FormItem
						className={cn({
							hidden,
							'grid grid-cols-[1fr_2fr] items-center gap-x-2 space-y-0': orientation === 'horizontal'
						})}>
						{label && <FormLabel htmlFor={id}>{label}</FormLabel>}
						<Div className={cn(orientation === 'horizontal' && 'flex flex-col space-y-1.5')}>
							<Select
								{...restProps}
								value={field.value}
								defaultValue={field.value}
								onValueChange={(value) => {
									field.onChange(value)
									if (typeof onValueChange === 'function') {
										onValueChange(value)
									}
								}}>
								<SelectTrigger
									id={id}
									disabled={field.disabled}
									className={cn(
										'bg-background focus:border-primary',
										className,
										Boolean(getFieldState(name).error) &&
											'w-full border-destructive focus:border-destructive active:border-destructive'
									)}>
									<SelectValue placeholder={!field.value && placeholder} />
								</SelectTrigger>
								<SelectContent>
									{Array.isArray(datalist) && datalist.length > 0 ? (
										datalist.map((option) => (
											<SelectItem key={option[valueField]} value={String(option[valueField])}>
												{option[labelField]}
											</SelectItem>
										))
									) : (
										<SelectItem
											value={null}
											disabled
											className='flex items-center justify-center text-center text-xs font-medium'>
											No option
										</SelectItem>
									)}
								</SelectContent>
							</Select>
							{props.description && <FormDescription>{props.description}</FormDescription>}
							<FormMessage />
						</Div>
					</FormItem>
				)
			}}
		/>
	)
}

SelectFieldControl.displayName = 'SelectFieldControl'
