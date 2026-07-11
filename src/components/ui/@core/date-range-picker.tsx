import { cn } from '@/common/utils/cn'
import { useDateLocale } from '@/hooks/use-date-locale'
import { CalendarIcon } from '@radix-ui/react-icons'
import { addMonths, format } from 'date-fns'
import { useTranslation } from 'react-i18next'
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
	const locale = useDateLocale()
	const { t } = useTranslation()

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					{...triggerProps}
					variant={'outline'}
					className={cn(
						'w-full max-w-xs justify-start text-left font-normal',
						!calendarProps?.selected && 'text-muted-foreground',
						triggerProps?.className
					)}>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{calendarProps?.selected?.from ? (
						calendarProps?.selected.to ? (
							<>
								{format(calendarProps.selected.from, 'LLL dd, y', { locale })} {' - '}
								{format(calendarProps.selected.to, 'LLL dd, y', { locale })}
							</>
						) : (
							format(calendarProps.selected.from, 'LLL dd, y', { locale })
						)
					) : (
						t('ns_common:actions.pick_a_date')
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='sm:max-h-1/2 w-auto overflow-auto p-0 scrollbar-none' align='center'>
				<Calendar
					{...calendarProps}
					initialFocus
					mode='range'
					selected={
						calendarProps?.selected ?? {
							from: new Date(),
							to: new Date()
						}
					}
					onSelect={(value) => {
						if (typeof calendarProps?.onSelect === 'function') calendarProps.onSelect(value)
					}}
				/>
			</PopoverContent>
		</Popover>
	)
}
