import { cn } from '@/common/utils/cn'
import { useDateLocale } from '@/hooks/use-date-locale'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import type { CalendarProps } from './calendar'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export const DatePicker: React.FC<CalendarProps> = ({ selected, ...props }) => {
	const locale = useDateLocale()
	const { t } = useTranslation()

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn('min-w-60 justify-start text-left font-normal', !selected && 'text-muted-foreground')}>
					<CalendarIcon className='mr-2 size-4' />
					<span className='first-letter:uppercase'>
						{selected ? format(selected as Date, 'PPP', { locale }) : t('ns_common:actions.pick_a_date')}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar {...({ initialFocus: true, selected, mode: 'single', ...props } as CalendarProps)} />
			</PopoverContent>
		</Popover>
	)
}
