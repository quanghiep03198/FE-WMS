'use no memo'

import { cn } from '@common/utils/cn'
import React, { useId } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { BaseFieldControl } from '../../../common/types/hook-form'
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
	SelectValue,
	Tooltip
} from '../../ui'

export type SelectFieldControlProps<T extends FieldValues, D> = BaseFieldControl<T> &
	React.ComponentProps<typeof Select> & {
		datalist: Array<D>
		labelField: keyof D
		valueField: keyof D
	}

export function SelectFieldControl<T extends FieldValues, D extends Record<string, any>>(
	props: SelectFieldControlProps<T, D>
) {
	const { t } = useTranslation()
	const { control, getValues, getFieldState } = useFormContext()
	const id = useId()
	const {
		name,
		description,
		hidden,
		label,
		orientation: orientation,
		className,
		placeholder = 'Select',
		datalist,
		labelField,
		valueField,
		errorMessageVariant = 'inline',
		onValueChange,
		...restProps
	} = props

	const { error } = getFieldState(name)
	const isError = Boolean(error)

	return (
		<FormField
			name={name!}
			defaultValue={getValues(name)}
			control={control}
			render={({ field }) => {
				return (
					<FormItem
						aria-orientation={orientation}
						className='space-y-2 aria-hidden:hidden aria-[orientation=horizontal]:grid aria-[orientation=horizontal]:grid-cols-[1fr_2fr] aria-[orientation=horizontal]:items-start aria-[orientation=horizontal]:gap-2 aria-[orientation=horizontal]:space-y-0'>
						{label && (
							<FormLabel
								htmlFor={id}
								aria-orientation={orientation}
								className='text-pretty aria-[orientation=horizontal]:translate-y-3/4 aria-[orientation=horizontal]:align-middle aria-[orientation=horizontal]:leading-none'>
								{label}
							</FormLabel>
						)}
						<Div className='space-y-2'>
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
								<Tooltip
									message={t(error?.message)}
									triggerProps={{ type: 'button', className: 'w-full' }}
									contentProps={{
										hidden: !error || errorMessageVariant === 'inline',
										side: 'bottom',
										align: 'start',
										['aria-invalid']: !!error
									}}>
									<FormControl>
										<SelectTrigger
											id={id}
											disabled={field.disabled}
											className={cn(
												'bg-background focus:border-primary',
												className,
												isError &&
													'border-destructive focus:border-destructive active:border-destructive w-full',
												!field.value && 'text-muted-foreground'
											)}>
											<SelectValue placeholder={!field.value && placeholder} />
										</SelectTrigger>
									</FormControl>
								</Tooltip>
								<SelectContent>
									{Array.isArray(datalist) && datalist.length > 0 ? (
										datalist.map((option) => (
											<SelectItem key={option[valueField]} value={String(option[valueField])}>
												{option[labelField]}
											</SelectItem>
										))
									) : (
										<SelectItem
											value={null!}
											disabled
											className='flex items-center justify-center text-center text-xs font-medium'>
											No option
										</SelectItem>
									)}
								</SelectContent>
							</Select>
							{description && <FormDescription>{description}</FormDescription>}
							{!!error && errorMessageVariant === 'inline' && <FormMessage />}
						</Div>
					</FormItem>
				)
			}}
		/>
	)
}

SelectFieldControl.displayName = 'SelectFieldControl'
