import { useDateLocale } from '@/common/hooks/use-date-locale'
import { cn } from '@/common/utils/cn'
import { format } from 'date-fns'
import { Fragment, useId } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
	Calendar,
	CalendarProps,
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
	PopoverTrigger,
	buttonVariants
} from '../..'
import { BaseFieldControl } from '../../../../common/types/hook-form'

export type DatePickerFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & {
	calendarProps?: Partial<CalendarProps>
}

export function DatePickerFieldControl<T extends FieldValues>(props: DatePickerFieldControlProps<T>) {
	const { name, description, label, orientation, hidden, calendarProps = { mode: 'single' } } = props

	const { control, getFieldState } = useFormContext()
	const id = useId()
	const locale = useDateLocale()
	const { t } = useTranslation()

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem
					className={cn(
						orientation === 'horizontal' ? 'grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0' : 'space-y-2',
						hidden && 'hidden'
					)}>
					{label && (
						<FormLabel
							htmlFor={id}
							className={orientation === 'horizontal' && 'translate-y-3/4 align-middle leading-none'}>
							{label}
						</FormLabel>
					)}
					<Div className='space-y-2'>
						<Popover>
							<PopoverTrigger
								id={id}
								className={cn(
									buttonVariants({
										variant: 'outline',
										className:
											'w-full justify-start bg-background text-left font-normal hover:bg-background focus:border-primary'
									}),
									!field.value && 'text-muted-foreground',
									!!getFieldState(name).error && 'border-destructive'
								)}>
								<FormControl>
									<Fragment>
										<Icon name='Calendar' />
										<span className='first-letter:uppercase'>
											{calendarProps.mode === 'range' || calendarProps.mode === 'multiple' ? (
												<Fragment>
													{field.value?.from ? (
														field.value.to ? (
															<Fragment>
																{format(field.value.from, 'LLL dd, y', { locale })} -{' '}
																{format(field.value.to, 'LLL dd, y', { locale })}
															</Fragment>
														) : (
															format(field.value.from, 'LLL dd, y', { locale })
														)
													) : (
														t('ns_common:actions.pick_a_date')
													)}
												</Fragment>
											) : (
												<Fragment>
													{field.value
														? format(field.value, 'PPP', { locale })
														: t('ns_common:actions.pick_a_date')}
												</Fragment>
											)}
										</span>
									</Fragment>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0' align='start'>
								<Calendar
									mode={calendarProps.mode ?? 'single'}
									selected={field.value}
									onSelect={field.onChange}
									initialFocus={true}
									{...calendarProps}
								/>
							</PopoverContent>
						</Popover>
						{description && <FormDescription>{description}</FormDescription>}
						<FormMessage />
					</Div>
				</FormItem>
			)}
		/>
	)
}

DatePickerFieldControl.displayName = 'DatePickerFieldControl'
