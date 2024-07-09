import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { cn } from '@/common/utils/cn'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { Calendar } from './calendar'
import { Div } from '../@custom/div'

type DatePickerProps = {
	value: Date
	onValueChange: React.Dispatch<React.SetStateAction<Date>>
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onValueChange }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn('w-[240px] justify-start text-left font-normal', !value && 'text-muted-foreground')}>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{value ? format(value, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent align='start' className='flex w-auto flex-col space-y-2 p-2'>
				<Div className='rounded-md border'>
					<Calendar mode='single' selected={value} onSelect={onValueChange} />
				</Div>
			</PopoverContent>
		</Popover>
	)
}
