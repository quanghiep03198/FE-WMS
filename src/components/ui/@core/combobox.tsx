import { cn } from '@/common/utils/cn'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollArea
} from '..'

export type ComboboxProps = {
	placeholder?: string
	className?: string
	options: Array<Record<'label' | 'value', any>>
	value?: string
	onChange?: (value: string) => void
} & React.ComponentProps<typeof PopoverContent>

export const Combobox: React.FC<ComboboxProps> = ({ options, placeholder, className, value, onChange, ...props }) => {
	const [open, setOpen] = useState(false)
	const [currentValue, setCurrentValue] = useState(value ?? '')

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					onClick={() => setOpen(true)}
					className={cn(
						'justify-between',
						{
							'text-muted-foreground/50': !currentValue
						},
						className
					)}>
					{options.find((option) => option.value === value)?.label ?? placeholder}
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0' {...props}>
				<Command>
					<CommandInput placeholder={placeholder} className='h-9' />
					<CommandEmpty>Không có kết quả phù hợp</CommandEmpty>
					<CommandGroup>
						<ScrollArea className='h-80'>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(val: (typeof options)[number]['value']) => {
										setCurrentValue(val === currentValue ? '' : currentValue)
										if (onChange) onChange(val === currentValue ? '' : currentValue)
										setOpen(false)
									}}>
									{option.label}
									<CheckIcon
										className={cn(
											'ml-auto h-4 w-4',
											currentValue === option.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</ScrollArea>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

Combobox.defaultProps = {
	placeholder: 'Search ...'
}
