import { cn } from '@/common/utils/cn'
import React, { useId } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import {
	Div,
	FormControl,
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
		valueField,
		onValueChange,
		...restProps
	} = props

	const isError = Boolean(getFieldState(name).error)

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
							'grid grid-cols-[1fr_2fr] grid-rows-4 items-center gap-x-2 space-y-0': orientation === 'horizontal'
						})}>
						{label && (
							<FormLabel
								htmlFor={id}
								className={cn(orientation === 'horizontal' && (isError ? 'row-span-2' : 'row-span-4'))}>
								{label}
							</FormLabel>
						)}
						<Div className={cn('space-y-2', orientation === 'horizontal' && 'row-span-4')}>
							<Select
								{...restProps}
								value={field.value ?? ''}
								defaultValue={field.value ?? ''}
								onValueChange={(value) => {
									field.onChange(value)
									if (typeof onValueChange === 'function') {
										onValueChange(value)
									}
								}}>
								<FormControl>
									<SelectTrigger
										id={id}
										disabled={field.disabled}
										className={cn(
											'bg-background focus:border-primary',
											className,
											isError &&
												'w-full border-destructive focus:border-destructive active:border-destructive'
										)}>
										<SelectValue placeholder={!field.value && placeholder} />
									</SelectTrigger>
								</FormControl>
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
							<FormMessage className={cn(orientation === 'horizontal' && 'row-span-1')} />
						</Div>
					</FormItem>
				)
			}}
		/>
	)
}

SelectFieldControl.displayName = 'SelectFieldControl'
