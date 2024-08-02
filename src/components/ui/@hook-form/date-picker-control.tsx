import { cn } from '@/common/utils/cn'
import { format } from 'date-fns'
import { Fragment, useId } from 'react'
import { FieldValues } from 'react-hook-form'
import {
	Button,
	Calendar,
	CalendarProps,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Typography
} from '..'
import { BaseFieldControl } from '../../../common/types/hook-form'
import FormLabel from './alternative-form-label'

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
		messageType = 'alternative',
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
						'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': orientation === 'horizontal'
					})}>
					<FormLabel htmlFor={id} labelText={label} messageType={messageType} />
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									variant={'outline'}
									id={id}
									className={cn(
										'flex w-full items-center justify-start gap-x-2 space-x-2 pl-3 text-left font-normal',
										!field.value && 'text-muted-foreground'
									)}>
									<Icon name='Calendar' />
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
												<Typography>Pick a date</Typography>
											)}
										</Fragment>
									) : (
										<Fragment>
											{field.value ? (
												<Typography>{format(field.value, 'PPP')}</Typography>
											) : (
												<Typography>Pick a date</Typography>
											)}
										</Fragment>
									)}
								</Button>
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
					{messageType === 'standard' && <FormMessage />}
				</FormItem>
			)}
		/>
	)
}

DatePickerFieldControl.displayName = 'DatePickerFieldControl'
