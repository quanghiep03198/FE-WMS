import { cn } from '@common/utils/cn'
import { useDateLocale } from '@hooks/use-date-locale'
import { format, isValid } from 'date-fns'
import { Fragment } from 'react'
import { isDateRange } from 'react-day-picker'
import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { BaseFieldControl } from '../../../common/types/hook-form'
import type { ButtonProps, CalendarProps } from '../../ui'
import {
	Button,
	Calendar,
	Div,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '../../ui'

export type DatePickerFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & {
	triggerProps?: ButtonProps
	calendarProps?: Partial<CalendarProps>
}

export function DatePickerFieldControl<T extends FieldValues>(props: DatePickerFieldControlProps<T>) {
	const {
		name,
		description,
		disabled,
		label,
		orientation: orientation,
		hidden,
		triggerProps,
		calendarProps = { mode: 'single' }
	} = props

	const { control, getFieldState } = useFormContext()
	const locale = useDateLocale()
	const { t } = useTranslation()

	const _isDateRange = calendarProps.mode === 'range' || calendarProps.mode === 'multiple'

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				return (
					<FormItem
						aria-hidden={hidden}
						aria-orientation={orientation}
						className='space-y-2 aria-hidden:hidden aria-[orientation=horizontal]:grid aria-[orientation=horizontal]:grid-cols-[1fr_2fr] aria-[orientation=horizontal]:items-start aria-[orientation=horizontal]:gap-2 aria-[orientation=horizontal]:space-y-0'>
						{label && (
							<FormLabel
								aria-orientation={orientation}
								className='text-pretty aria-[orientation=horizontal]:translate-y-3/4 aria-[orientation=horizontal]:align-middle aria-[orientation=horizontal]:leading-none'>
								{label}
							</FormLabel>
						)}
						<Div className='space-y-2'>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											{...triggerProps}
											variant='outline'
											aria-disabled={disabled}
											className={cn(
												'bg-background hover:bg-background focus:border-primary w-full justify-start text-left font-normal aria-disabled:opacity-50',
												!field.value && 'text-muted-foreground',
												!!getFieldState(name).error && 'border-destructive',
												triggerProps?.className
											)}>
											<Icon name='Calendar' />
											<span className='first-letter:uppercase'>
												{_isDateRange && isDateRange(field.value) && field.value.from && field.value.to ? (
													<Fragment>
														{format(field.value.from, 'LLL dd, y', { locale })}
														{' - '}
														{format(field.value.to, 'LLL dd, y', { locale })}
													</Fragment>
												) : field.value && isValid(new Date(field.value)) ? (
													format(field.value, 'PPP', { locale })
												) : (
													t('ns_common:actions.pick_a_date')
												)}
											</span>
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										{...({
											...calendarProps,
											mode: calendarProps.mode ?? 'single',
											selected: field.value ?? '',
											onSelect: field.onChange,
											initialFocus: true,
											disabled
										} satisfies CalendarProps)}
									/>
								</PopoverContent>
							</Popover>
							{description && <FormDescription>{description}</FormDescription>}
							<FormMessage />
						</Div>
					</FormItem>
				)
			}}
		/>
	)
}

DatePickerFieldControl.displayName = 'DatePickerFieldControl'
