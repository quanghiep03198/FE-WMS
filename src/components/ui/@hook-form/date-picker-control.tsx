import { cn } from '@/common/utils/cn'
import { format } from 'date-fns'
import { Fragment, useId } from 'react'
import { FieldValues } from 'react-hook-form'
import {
	Calendar,
	CalendarProps,
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
} from '..'
import { BaseFieldControl } from '../../../common/types/hook-form'

type DatePickerFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & {
	calendarProps?: Partial<CalendarProps>
}

export function DatePickerFieldControl<T extends FieldValues>(props: DatePickerFieldControlProps<T>) {
	const {
		control,
		name,
		description,
		label,
		orientation,
		hidden,
		calendarProps = {
			mode: 'single'
		}
	} = props
	const id = useId()

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem
					className={cn({
						hidden,
						'grid grid-cols-[1fr_2fr] items-center gap-x-2 space-y-0': orientation === 'horizontal'
					})}>
					{label && <FormLabel htmlFor={id}>{label}</FormLabel>}
					<Popover>
						<PopoverTrigger
							id={id}
							className={cn(
								buttonVariants({
									variant: 'outline',
									className:
										'w-full justify-start text-left font-normal hover:bg-background focus:border-primary'
								}),
								!field.value && 'text-muted-foreground'
							)}>
							<FormControl>
								<Fragment>
									<Icon name='Calendar' role='img' />
									{calendarProps.mode === 'range' || calendarProps.mode === 'multiple' ? (
										<Fragment>
											{field.value?.from ? (
												field.value.to ? (
													<Fragment>
														{format(field.value.from, 'LLL dd, y')} -{' '}
														{format(field.value.to, 'LLL dd, y')}
													</Fragment>
												) : (
													format(field.value.from, 'LLL dd, y')
												)
											) : (
												'Pick a date'
											)}
										</Fragment>
									) : (
										<Fragment>{field.value ? format(field.value, 'PPP') : 'Pick a date'}</Fragment>
									)}
								</Fragment>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className='w-auto p-0' align='start'>
							<Calendar
								mode={calendarProps.mode}
								selected={field.value}
								onSelect={field.onChange}
								initialFocus={true}
								{...calendarProps}
							/>
						</PopoverContent>
					</Popover>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

DatePickerFieldControl.displayName = 'DatePickerFieldControl'
