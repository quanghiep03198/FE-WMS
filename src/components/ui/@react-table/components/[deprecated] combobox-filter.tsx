import { cn } from '@/common/utils/cn'
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollArea
} from '@/components/ui'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ComboboxProps } from '../../@core/combobox'
import { TableContext } from '../context/table.context'

export const ComboboxFilter: React.FC<ComboboxProps> = ({ options, className = '', onChange }) => {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState('')
	const triggerRef = useRef<typeof Button.prototype>(null)
	const { t } = useTranslation()
	const { isScrolling, columnFilters, globalFilter } = useContext(TableContext)
	const hasNoFilter = useMemo(() => columnFilters.length === 0 && globalFilter.length === 0, [])

	const placeholder = t('ns_common:table.search_in_column')

	useEffect(() => {
		if (isScrolling) setOpen(false)
		if (hasNoFilter) setValue(placeholder)
	}, [isScrolling, hasNoFilter])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					ref={triggerRef}
					variant='outline'
					role='combobox'
					aria-expanded={open}
					tabIndex={0}
					className={cn(
						'justify-between border-none text-xs text-muted-foreground/80 ring-0 hover:bg-transparent',
						className
					)}>
					{value || placeholder}
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='min-w-56 p-0' style={{ width: triggerRef.current?.offsetWidth }} align='start'>
				<Command>
					<CommandInput placeholder={placeholder} className='h-8 placeholder:text-xs' />
					<CommandList>
						<CommandEmpty className='whitespace-nowrap p-3 text-center text-xs font-medium text-muted-foreground'>
							{t('ns_common:table.no_match_result')}
						</CommandEmpty>
						<CommandGroup>
							<ScrollArea className='max-h-64 w-full' onWheel={(e) => e.stopPropagation()}>
								{Array.isArray(options) &&
									options.map((option) => (
										<CommandItem
											disabled={false}
											key={option.value}
											value={option.value}
											className='w-full'
											onSelect={(currentValue: (typeof options)[number]['value']) => {
												console.log(currentValue)
												setValue(currentValue === value ? '' : currentValue)
												onChange(currentValue === value ? '' : currentValue)
												setOpen(false)
											}}>
											{option.label}
											<Icon
												name='Check'
												size={16}
												className={cn('ml-auto', value === option.value ? 'opacity-100' : 'opacity-0')}
											/>
										</CommandItem>
									))}
							</ScrollArea>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
