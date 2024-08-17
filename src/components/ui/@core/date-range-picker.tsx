/* eslint-disable no-mixed-spaces-and-tabs */
import { cn } from '@/common/utils/cn'
import { CalendarIcon } from '@radix-ui/react-icons'
import { addMonths, format } from 'date-fns'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type DateRangePickerProps = {
	calendarProps?: React.ComponentProps<typeof Calendar.prototype>
	triggerProps?: React.ComponentProps<typeof Button.prototype>
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
	triggerProps,
	calendarProps = { numberOfMonths: 1, selected: { from: new Date(), to: addMonths(new Date(), 1) } }
}) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					{...triggerProps}
					id='date'
					variant={'outline'}
					className={cn(
						'w-full max-w-xs justify-start text-left font-normal',
						!calendarProps.selected && 'text-muted-foreground',
						triggerProps.className
					)}>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{calendarProps.selected?.from ? (
						calendarProps.selected.to ? (
							<>
								{format(calendarProps.selected.from, 'LLL dd, y')} {' - '}
								{format(calendarProps.selected.to, 'LLL dd, y')}
							</>
						) : (
							format(calendarProps.selected.from, 'LLL dd, y')
						)
					) : (
						<>Pick a date</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='sm:max-h-1/2 w-auto overflow-auto p-0 scrollbar-none' align='start'>
				<Calendar
					{...calendarProps}
					initialFocus
					mode='range'
					selected={
						calendarProps.selected ?? {
							from: new Date(),
							to: addMonths(new Date(), 1)
						}
					}
					onSelect={(value) => {
						if (typeof calendarProps.onSelect === 'function') calendarProps.onSelect(value)
					}}
				/>
			</PopoverContent>
		</Popover>
	)
}
