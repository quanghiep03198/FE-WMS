import { cn } from '@/common/utils/cn'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { isEmpty } from 'lodash'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '..'

export type ComboboxProps<T extends Record<string, string>> = {
	placeholder?: string
	data: Array<T>
	value?: string
	onSelect?: (value: string) => void
	onInput?: (value: string) => void
	triggerProps?: React.ComponentProps<typeof Button>
	contentProps?: React.ComponentProps<typeof PopoverContent>
} & {
	labelField: keyof T
	valueField: keyof T
}

export function Combobox<T extends Record<string, any>>({
	data,
	labelField,
	valueField,
	placeholder = 'Search ...',
	value,
	triggerProps,
	contentProps,
	onSelect,
	onInput
}: ComboboxProps<T>) {
	const [open, setOpen] = useState(false)
	const [currentValue, setCurrentValue] = useState(value)
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { t } = useTranslation()
	const triggerRef = useRef<typeof Button.prototype>(null)

	const _data = useMemo(
		() =>
			!isEmpty(searchTerm)
				? data.filter(
						(item) =>
							String(item[labelField]).toLocaleLowerCase().includes(searchTerm) ||
							String(item[valueField]).toLocaleLowerCase().includes(searchTerm)
					)
				: data,
		[data, searchTerm]
	)

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
					className={cn('w-full max-w-full justify-between', triggerProps?.className)}>
					{data.find((option) => option[valueField] === value || option[valueField] === currentValue)?.[
						labelField
					] ?? placeholder}
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				style={{
					padding: 0,
					width: triggerRef.current?.offsetWidth
				}}
				{...contentProps}>
				<Command shouldFilter={false} value={currentValue}>
					<CommandInput
						placeholder={placeholder ?? `${t('ns_common:actions.search')} ...`}
						className='h-9'
						onInput={(e) => {
							if (typeof onInput === 'function') onInput(e.currentTarget.value)
							setSearchTerm(String(e.currentTarget.value).toLocaleLowerCase())
						}}
					/>
					<CommandEmpty>Không có kết quả phù hợp</CommandEmpty>

					<CommandList className='max-h-80 scrollbar'>
						<CommandGroup>
							{_data.map((option) => (
								<CommandItem
									key={option[valueField]}
									value={option[valueField]}
									onSelect={(value) => {
										if (typeof onSelect === 'function') onSelect(value)
										setCurrentValue(value)
										setOpen(false)
									}}>
									{option[labelField]}
									<CheckIcon
										className={cn(
											'ml-auto h-4 w-4',
											currentValue === option[valueField] ? 'opacity-100' : 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
