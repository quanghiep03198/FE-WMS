/* eslint-disable no-mixed-spaces-and-tabs */
import { cn } from '@/common/utils/cn'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Typography } from '../@custom/typography'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type DatePickerWithRangeProps = {
	value: DateRange
	onValueChange: React.Dispatch<React.SetStateAction<DateRange>>
	triggerProps?: React.ComponentProps<typeof Button.prototype>
}

export const DateRangePicker: React.FC<DatePickerWithRangeProps> = ({ value, onValueChange }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					id='date'
					variant={'outline'}
					className={cn('w-full max-w-xs justify-start text-left font-normal', !value && 'text-muted-foreground')}>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{value?.from ? (
						value.to ? (
							<>
								{format(value.from, 'LLL dd, y')} - {format(value.to, 'LLL dd, y')}
							</>
						) : (
							format(value.from, 'LLL dd, y')
						)
					) : (
						<Typography>Pick a date</Typography>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='sm:max-h-1/2 w-auto overflow-auto p-0 scrollbar-none' align='start'>
				<Calendar
					initialFocus
					mode='range'
					defaultMonth={value?.from}
					selected={value}
					onSelect={onValueChange}
					numberOfMonths={2}
				/>
			</PopoverContent>
		</Popover>
	)
}
