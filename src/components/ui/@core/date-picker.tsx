import { cn } from '@/common/utils/cn'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { DayPickerSingleProps } from 'react-day-picker'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type DatePickerProps = Omit<DayPickerSingleProps, 'mode'>

export const DatePicker: React.FC<DatePickerProps> = ({ selected, onSelect, ...props }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn('min-w-60 justify-start text-left font-normal', !selected && 'text-muted-foreground')}>
					<CalendarIcon className='mr-2 size-4' />
					{selected ? format(selected, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar mode='single' selected={selected} onSelect={onSelect} initialFocus {...props} />
			</PopoverContent>
		</Popover>
	)
}
