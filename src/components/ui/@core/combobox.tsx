import { cn } from '@/common/utils/cn'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { isEmpty } from 'lodash-es'
import { useMemo, useState } from 'react'
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
	datalist: Array<T>
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
	datalist,
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

	const options = useMemo(() => {
		if (!Array.isArray(datalist)) {
			return []
		} else if (!isEmpty(searchTerm)) {
			return datalist.filter((item) => {
				return (
					String(item[labelField]).toLocaleLowerCase().includes(searchTerm) ||
					String(item[valueField]).toLocaleLowerCase().includes(searchTerm)
				)
			})
		} else {
			return datalist
		}
	}, [datalist, searchTerm])

	const currentValueText = useMemo<string>(() => {
		if (!Array.isArray(datalist)) return ''
		const currentOption = datalist.find(
			(option) => option[valueField] === value || option[valueField] === currentValue
		)
		if (!currentOption) return ''
		return String(currentOption[labelField])
	}, [datalist, value, valueField, currentValue])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					{...triggerProps}
					variant='outline'
					aria-expanded={open}
					aria-placeholder={placeholder}
					data-empty={!currentValue}
					onClick={() => setOpen(true)}
					className={cn(
						'w-full max-w-full justify-between font-normal data-[empty=true]:text-muted-foreground hover:bg-background data-[empty=true]:hover:text-muted-foreground',
						triggerProps?.className
					)}>
					{currentValueText || placeholder}
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' {...contentProps}>
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
							{options.map((option) => (
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
