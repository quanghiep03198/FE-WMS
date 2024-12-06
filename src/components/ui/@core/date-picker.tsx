import { cn } from '@/common/utils/cn'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { SelectSingleEventHandler } from 'react-day-picker'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type DatePickerProps = {
	value: Date
	onValueChange: SelectSingleEventHandler
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onValueChange }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn('min-w-60 justify-start text-left font-normal', !value && 'text-muted-foreground')}>
					<CalendarIcon className='mr-2 size-4' />
					{value ? format(value, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar mode='single' selected={value} onSelect={onValueChange} initialFocus />
			</PopoverContent>
		</Popover>
	)
}
