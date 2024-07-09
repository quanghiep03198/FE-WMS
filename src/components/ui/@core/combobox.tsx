import { cn } from '@/common/utils/cn'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useRef, useState } from 'react'
import {
	Button,
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollArea
} from '..'
import { useTranslation } from 'react-i18next'

export type ComboboxProps = {
	placeholder?: string
	options: Array<Record<'label' | 'value', any>>
	value?: string
	onSelect?: (value: string) => void
	onInput?: (value: string) => void
	triggerProps?: React.ComponentProps<typeof Button>
	contentProps?: React.ComponentProps<typeof PopoverContent>
}

export const Combobox: React.FC<ComboboxProps> = ({
	options,
	placeholder,
	value,
	triggerProps,
	contentProps,
	onSelect,
	onInput
}) => {
	const [open, setOpen] = useState(false)
	const [currentValue, setCurrentValue] = useState(value ?? '')
	const triggerRef = useRef<typeof Button.prototype>(null)
	const { t } = useTranslation()

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					{...triggerProps}
					variant='outline'
					role='combobox'
					ref={triggerRef}
					aria-expanded={open}
					onClick={() => setOpen(true)}
					className={cn(
						'w-full max-w-full justify-between',
						{ 'text-muted-foreground/50': !currentValue },
						triggerProps?.className
					)}>
					{options.find((option) => option.value === value)?.label ??
						placeholder ??
						`${t('ns_common:actions.search')} ...`}
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				style={{
					padding: 0,
					width: triggerRef.current?.offsetWidth
				}}
				{...contentProps}>
				<Command>
					<CommandInput
						placeholder={placeholder ?? `${t('ns_common:actions.search')} ...`}
						className='h-9'
						onInput={(e) => {
							if (typeof onInput === 'function') onInput(e.currentTarget.value)
						}}
					/>
					<CommandEmpty>Không có kết quả phù hợp</CommandEmpty>
					<ScrollArea className='max-h-80'>
						<CommandList className='p-1'>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(val: (typeof options)[number]['value']) => {
										setCurrentValue(val === currentValue ? '' : currentValue)
										if (onSelect) onSelect(val === currentValue ? '' : currentValue)
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
						</CommandList>
					</ScrollArea>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
