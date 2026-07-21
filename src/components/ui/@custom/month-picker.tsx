import { cn } from '@common/utils/cn'
import { useDateLocale } from '@hooks/use-date-locale'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { chunk } from 'lodash-es'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import type { ButtonProps } from '../@core/button'
import { Button, buttonVariants } from '../@core/button'
import { Popover, PopoverContent, PopoverTrigger } from '../@core/popover'

type Month = {
	number: number
	name: string
}

type MonthCalendarProps = {
	selectedMonth?: Date
	onMonthSelect?: (date: Date) => void
	onYearForward?: () => void
	onYearBackward?: () => void
	callbacks?: {
		yearLabel?: (year: number) => string
		monthLabel?: (month: Month) => string
	}
	variant?: {
		calendar?: {
			main?: ButtonProps['variant']
			selected?: ButtonProps['variant']
		}
		chevrons?: ButtonProps['variant']
	}
	minDate?: Date
	maxDate?: Date
	disabledDates?: Date[]
}

const MonthPicker: React.FC<MonthCalendarProps> = (props) => {
	const locale = useDateLocale()
	const { t } = useTranslation()

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					className={cn(
						'w-72 justify-start text-left font-normal',
						!props?.selectedMonth && 'text-muted-foreground'
					)}>
					<CalendarIcon className='mr-2 h-4 w-4' />
					<span className='first-letter:uppercase'>
						{props?.selectedMonth
							? format(new Date(props.selectedMonth), 'MMMM, yyyy', { locale })
							: t('ns_common:actions.pick_a_month')}
					</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-(--radix-popover-trigger-width) space-y-4'>
				<MonthCalendar {...props} />
			</PopoverContent>
		</Popover>
	)
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({
	selectedMonth,
	onMonthSelect,
	callbacks,
	variant,
	minDate,
	maxDate,
	disabledDates,
	onYearBackward,
	onYearForward
}) => {
	const [year, setYear] = React.useState<number>(selectedMonth?.getFullYear() ?? new Date().getFullYear())
	const [month, setMonth] = React.useState<number>(selectedMonth?.getMonth() ?? new Date().getMonth())
	const [menuYear, setMenuYear] = React.useState<number>(year)
	const locale = useDateLocale()
	const { i18n } = useTranslation()

	if (minDate && maxDate && minDate > maxDate) minDate = maxDate

	const disabledDatesMapped = disabledDates?.map((d) => {
		return { year: d.getFullYear(), month: d.getMonth() }
	})

	const months: Month[][] = React.useMemo(
		() =>
			chunk(
				Array.from({ length: 12 }).map((_, index) => ({
					number: index,
					name: format(new Date(year, index), 'LLL', { locale }) // 'LLL' là định dạng 3 chữ cái
				})),
				4
			),
		[i18n.language, locale, year]
	)

	return (
		<>
			<div className='relative flex items-center justify-center pt-1'>
				<div className='text-sm font-medium'>
					{callbacks?.yearLabel ? callbacks?.yearLabel(menuYear) : menuYear}
				</div>
				<div className='flex items-center space-x-1'>
					<button
						onClick={() => {
							setMenuYear(menuYear - 1)
							if (onYearBackward) onYearBackward()
						}}
						className={cn(
							buttonVariants({ variant: variant?.chevrons ?? 'outline' }),
							'absolute left-1 inline-flex h-7 w-7 items-center justify-center p-0'
						)}>
						<ChevronLeft className='h-4 w-4 opacity-50' />
					</button>
					<button
						onClick={() => {
							setMenuYear(menuYear + 1)
							if (onYearForward) onYearForward()
						}}
						className={cn(
							buttonVariants({ variant: variant?.chevrons ?? 'outline' }),
							'absolute right-1 inline-flex h-7 w-7 items-center justify-center p-0'
						)}>
						<ChevronRight className='h-4 w-4 opacity-50' />
					</button>
				</div>
			</div>
			<table className='w-full border-collapse space-y-1'>
				<tbody>
					{months.map((monthRow, a) => {
						return (
							<tr key={'row-' + a} className='mt-2 flex w-full'>
								{monthRow.map((m) => {
									return (
										<td
											key={m.number}
											className='relative h-8 w-1/4 p-0 text-center text-sm focus-within:relative focus-within:z-20 has-aria-[selected]:bg-accent first:has-aria-[selected]:rounded-l-md last:has-aria-[selected]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md'>
											<button
												onClick={() => {
													setMonth(m.number)
													setYear(menuYear)
													if (onMonthSelect) onMonthSelect(new Date(menuYear, m.number))
												}}
												disabled={
													(maxDate
														? menuYear > maxDate?.getFullYear() ||
															(menuYear == maxDate?.getFullYear() && m.number > maxDate.getMonth())
														: false) ||
													(minDate
														? menuYear < minDate?.getFullYear() ||
															(menuYear == minDate?.getFullYear() && m.number < minDate.getMonth())
														: false) ||
													(disabledDatesMapped
														? disabledDatesMapped?.some((d) => d.year == menuYear && d.month == m.number)
														: false)
												}
												className={cn(
													buttonVariants({
														variant:
															month == m.number && menuYear == year
																? (variant?.calendar?.selected ?? 'default')
																: (variant?.calendar?.main ?? 'ghost')
													}),
													'h-full w-full p-0 font-normal aria-selected:opacity-100'
												)}>
												{callbacks?.monthLabel ? callbacks.monthLabel(m) : m.name}
											</button>
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</table>
		</>
	)
}

MonthPicker.displayName = 'MonthPicker'

export { MonthPicker }
