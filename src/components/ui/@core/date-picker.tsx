import { cn } from '@/common/utils/cn'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { Button } from './button'
import { Calendar, CalendarProps } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export const DatePicker: React.FC<CalendarProps> = ({ selected, ...props }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn('min-w-60 justify-start text-left font-normal', !selected && 'text-muted-foreground')}>
					<CalendarIcon className='mr-2 size-4' />
					{selected ? format(selected as Date, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar {...({ initialFocus: true, selected, mode: 'single', ...props } as CalendarProps)} />
			</PopoverContent>
		</Popover>
	)
}
