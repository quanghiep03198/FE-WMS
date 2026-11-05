'use no memo'

import { cn } from '@common/utils/cn'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { isEmpty } from 'lodash-es'
import { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type ComboboxProps<T extends Record<string, string>> = {
	ref?: React.Ref<{ reset: () => void }>
	placeholder?: string
	datalist: Array<T>
	value?: string
	onSelect?: (value: string) => void
	onInput?: (value: string) => void
	triggerProps?: React.ComponentProps<typeof Button>
	contentProps?: React.ComponentProps<typeof PopoverContent>
	labelField: keyof T
	valueField: keyof T
}

export function Combobox<T extends Record<string, any>>({
	datalist,
	labelField,
	valueField,
	placeholder,
	value,
	triggerProps,
	contentProps,
	ref,
	onSelect,
	onInput
}: ComboboxProps<T>) {
	const [open, setOpen] = useState(false)
	const [currentValue, setCurrentValue] = useState(value)
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { t } = useTranslation()
	const commandInputRef = useRef<HTMLInputElement>(null)

	placeholder ??= t('ns_common:actions.search') + ' ...'

	useEffect(() => {
		setCurrentValue(value)
	}, [value])

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
		if (!currentOption) return placeholder
		return String(currentOption[labelField])
	}, [datalist, value, valueField, currentValue, labelField])

	useImperativeHandle(ref, () => ({
		reset: () => {
			setSearchTerm('')
			setCurrentValue('')
			if (commandInputRef.current) commandInputRef.current.value = ''
		}
	}))

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					{...triggerProps}
					aria-expanded={open}
					aria-placeholder={placeholder}
					data-empty={!currentValue}
					variant='outline'
					className={cn(
						'data-[empty=true]:text-muted-foreground hover:bg-background data-[empty=true]:hover:text-muted-foreground w-full max-w-full justify-between font-normal',
						triggerProps?.className
					)}
					onClick={() => setOpen(true)}>
					{currentValueText}
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-radix-popover p-0' {...contentProps}>
				<Command shouldFilter={false} value={currentValue}>
					<CommandInput
						className='h-9'
						placeholder={placeholder ?? `${t('ns_common:actions.search')} ...`}
						ref={commandInputRef}
						value={searchTerm}
						onInput={(e) => {
							if (typeof onInput === 'function') onInput(e.currentTarget.value)
							setSearchTerm(String(e.currentTarget.value).toLocaleLowerCase())
						}}
					/>
					<CommandEmpty className='text-pretty text-muted-foreground text-sm text-center p-4'>
						Không có kết quả phù hợp
					</CommandEmpty>

					<CommandList className='scrollbar-thin max-h-80'>
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
