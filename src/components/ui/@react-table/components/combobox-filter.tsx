import { cn } from '@/common/utils/cn';
import { Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, Popover, PopoverContent, PopoverTrigger, ScrollArea } from '@/components/ui';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { ComboboxProps } from '../../@shadcn/combobox';

interface ComboboxFilterProps extends ComboboxProps {
	forceClose: boolean;
	areAllFiltersCleared: boolean;
}

export const ComboboxFilter: React.FC<ComboboxFilterProps> = ({ options, placeholder, className, onChange, forceClose, areAllFiltersCleared }) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');

	useEffect(() => {
		if (forceClose === true) setOpen(false);
		if (areAllFiltersCleared) setValue(placeholder!);
	}, [forceClose, areAllFiltersCleared]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					onClick={() => setOpen(true)}
					className={cn(
						'justify-between text-muted-foreground/50 hover:bg-transparent',

						className
					)}>
					<span className='line-clamp-1'>{value || placeholder}</span>
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0' align='start'>
				<Command>
					<CommandInput placeholder={placeholder} className='h-9' />
					<CommandEmpty>Không có kết quả phù hợp</CommandEmpty>
					<CommandGroup>
						<ScrollArea className='h-80 w-full' onWheel={(e) => e.stopPropagation()}>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(currentValue: (typeof options)[number]['value']) => {
										setValue(currentValue === value ? '' : currentValue);
										onChange(currentValue === value ? '' : currentValue);
										setOpen(false);
									}}>
									{option.label}
									<CheckIcon className={cn('ml-auto h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
								</CommandItem>
							))}
						</ScrollArea>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

ComboboxFilter.defaultProps = {
	placeholder: 'Search ...'
};
