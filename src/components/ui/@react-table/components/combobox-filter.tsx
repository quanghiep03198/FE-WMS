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
	ScrollArea,
	Typography
} from '@/components/ui'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useEffect, useRef, useState } from 'react'
import { ComboboxProps } from '../../@shadcn/combobox'
import { useTranslation } from 'react-i18next'

interface ComboboxFilterProps extends ComboboxProps {
	forceClose: boolean
	hasNoFilter: boolean
}

export const ComboboxFilter: React.FC<ComboboxFilterProps> = ({
	options,
	className = '',
	forceClose,
	hasNoFilter,
	onChange
}) => {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState('')
	const triggerRef = useRef<typeof Button.prototype>(null)
	const { t } = useTranslation()

	const placeholder = t('ns_common:table.search_in_column')

	useEffect(() => {
		if (forceClose === true) setOpen(false)
		if (hasNoFilter) setValue(placeholder)
	}, [forceClose, hasNoFilter])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					ref={triggerRef}
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className={cn('justify-between text-muted-foreground/50 hover:bg-transparent', className)}>
					<Typography variant='small' className='line-clamp-1'>
						{value || placeholder}
					</Typography>
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='min-w-56 p-0' style={{ width: triggerRef.current?.offsetWidth }} align='start'>
				<Command>
					<CommandInput placeholder={placeholder} className='h-9' />
					<CommandList>
						<CommandEmpty className='whitespace-nowrap py-6 text-center text-sm text-muted-foreground'>
							{t('ns_common:table.no_match_result')}
						</CommandEmpty>
						<ScrollArea className='max-h-64 w-full'>
							<CommandGroup className='w-full'>
								{Array.isArray(options) &&
									options.map((option) => (
										<CommandItem
											disabled={false}
											key={option.value}
											value={option.value}
											className='w-full'
											onSelect={(currentValue: (typeof options)[number]['value']) => {
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
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
