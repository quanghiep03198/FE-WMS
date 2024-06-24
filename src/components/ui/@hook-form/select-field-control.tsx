import { cn } from '@/common/utils/cn'
import React, { useId } from 'react'
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form'
import {
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '..'
import FormLabel from './alternative-form-label'
import { BaseFieldControl } from '../../../common/types/hook-form'
import { useTranslation } from 'react-i18next'

export type SelectFieldControlProps<T extends FieldValues> = BaseFieldControl<T> &
	React.ComponentProps<typeof Select> & {
		options: Array<{
			label: string
			value: PathValue<T, Path<T>>
		}>
	}

export function SelectFieldControl<T extends FieldValues>(props: SelectFieldControlProps<T>) {
	const { getFieldState, getValues } = useFormContext()
	const { t } = useTranslation()

	const {
		control,
		name,
		hidden,
		label,
		orientation,
		className,
		placeholder = t('ns_common:actions.search') + ' ... ',
		messageType = 'alternative',
		onValueChange,
		...restProps
	} = props
	const id = useId()

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
							'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': orientation === 'horizontal'
						})}>
						<FormLabel htmlFor={id} labelText={String(label)} messageType={messageType} />
						<Select
							value={field.value}
							defaultValue={field.value}
							onValueChange={(value) => {
								field.onChange(value)
								if (onValueChange) {
									onValueChange(value)
								}
							}}
							{...restProps}>
							<SelectTrigger
								id={id}
								ref={(e) => field.ref(e)}
								className={cn(
									'bg-background',
									className,
									Boolean(getFieldState(name).error) &&
										'!border-destructive focus:!border-destructive focus:!ring-0 active:!border-destructive'
								)}>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>

							<SelectContent>
								{Array.isArray(props.options) && props.options.length > 0 ? (
									props.options.map((option) => (
										<SelectItem key={option?.value} value={String(option?.value)}>
											{option?.label}
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
						{messageType === 'default' && <FormMessage />}
					</FormItem>
				)
			}}
		/>
	)
}

SelectFieldControl.displayName = 'SelectFieldControl'
