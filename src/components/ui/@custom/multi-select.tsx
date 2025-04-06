'use no memo'

import { CheckIcon, ChevronDown, XCircle, XIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/common/utils/cn'
import {
	Badge,
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator,
	Typography
} from '@/components/ui'

/**
 * Props for MultiSelect component
 */
export type MultiSelectProps<T extends Record<string, any>> = React.ButtonHTMLAttributes<HTMLButtonElement> &
	Pick<React.ComponentProps<typeof CommandInput>, 'onInput'> & {
		ref?: React.RefObject<HTMLButtonElement>

		value: Array<T[keyof T]>

		/**
		 * Determines whether command should filter the datalist automatically or manually.
		 */
		shouldFilter?: boolean

		/**
		 * An array of option objects to be displayed in the multi-select component.
		 */
		datalist: Array<T>

		/**
		 * The field in the option object that represents the label of the option.
		 */
		labelField: keyof T

		/**
		 * The field in the option object that represents the value of the option.
		 */
		valueField: keyof T

		/**
		 * Callback function triggered when the selected values change.
		 * Receives an array of the new selected values.
		 */
		onValueChange: (value: Array<T[MultiSelectProps<T>['valueField']]>) => void

		/**
		 * Callback function triggered when the selected values change.
		 * Receives an array of the new selected values.
		 */
		onInput: (value: string) => unknown

		/** The default selected values when the component mounts. */
		defaultValue?: Array<T[keyof T]>

		/**
		 * Placeholder text to be displayed when no values are selected.
		 * Optional, defaults to "Select options".
		 */
		placeholder?: string

		/**
		 * Maximum number of items to display. Extra selected items will be summarized.
		 * Optional, defaults to 3.
		 */
		maxCount?: number

		/**
		 * The modality of the popover. When set to true, interaction with outside elements
		 * will be disabled and only popover content will be visible to screen readers.
		 * Optional, defaults to false.
		 */
		modalPopover?: boolean

		/**
		 * If true, renders the multi-select component as a child of another component.
		 * Optional, defaults to false.
		 */
		asChild?: boolean

		/**
		 * Additional class names to apply custom styles to the multi-select component.
		 * Optional, can be used to add custom styles.
		 */
		className?: string
	}

export function MultiSelect<D = Record<string, any>>({
	datalist,
	labelField,
	valueField,
	shouldFilter = true,
	onValueChange,
	onInput,
	value,
	defaultValue = [],
	placeholder = 'Select options',
	maxCount = 3,
	modalPopover = false,
	className,
	ref,
	...props
}: MultiSelectProps<D>) {
	console.log(props['aria-invalid'])

	const [selectedValues, setSelectedValues] = React.useState<Array<D[keyof D]>>(defaultValue)
	const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			setIsPopoverOpen(true)
		} else if (event.key === 'Backspace' && !event.currentTarget.value) {
			const newSelectedValues = [...selectedValues]
			newSelectedValues.pop()
			setSelectedValues(newSelectedValues)
			onValueChange(newSelectedValues as Array<D[keyof D]>)
		}
	}

	const toggleOption = (option: D[keyof D]) => {
		const newSelectedValues = selectedValues.includes(option as D[keyof D])
			? selectedValues.filter((value) => value !== option)
			: [...selectedValues, option]
		setSelectedValues(newSelectedValues as Array<D[keyof D]>)
		onValueChange(newSelectedValues as Array<D[keyof D]>)
	}

	const handleClear = () => {
		setSelectedValues([])
		onValueChange([])
	}

	const handleTogglePopover = () => {
		setIsPopoverOpen((prev) => !prev)
	}

	const clearExtraOptions = () => {
		const newSelectedValues = selectedValues.slice(0, maxCount)
		setSelectedValues(newSelectedValues)
		onValueChange(newSelectedValues as Array<D[keyof D]>)
	}

	const toggleAll = () => {
		if (datalist.length > 0 && selectedValues.length === datalist.length) {
			handleClear()
		} else {
			const allValues = datalist.map((option) => String(option?.[valueField]))
			setSelectedValues(allValues as Array<D[keyof D]>)
			onValueChange(allValues as Array<D[keyof D]>)
		}
	}

	React.useEffect(() => {
		if (Array.isArray(value)) setSelectedValues(value)
	}, [value])

	return (
		<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
			<PopoverTrigger asChild>
				<Button
					{...props}
					ref={ref}
					onClick={handleTogglePopover}
					className={cn(
						'flex w-full items-center justify-between rounded-md border bg-inherit p-1 !shadow-sm aria-[invalid=true]:!border-destructive hover:bg-inherit [&_svg]:pointer-events-auto',
						className
					)}>
					{Array.isArray(selectedValues) && selectedValues.length > 0 ? (
						<div className='flex w-full items-center justify-between'>
							<div className='flex flex-wrap items-center gap-x-1'>
								{Array.isArray(selectedValues) &&
									selectedValues.slice(0, maxCount).map((value) => {
										const option = datalist.find((item) => item?.[valueField] === value)
										return (
											<Badge key={String(value)} variant='secondary'>
												{String(option?.[labelField])}
												<XCircle
													className='ml-2 h-4 w-4 cursor-pointer'
													onClick={(event) => {
														event.stopPropagation()
														toggleOption(value)
													}}
												/>
											</Badge>
										)
									})}
								{Array.isArray(selectedValues) && selectedValues.length > maxCount && (
									<HoverCard>
										<HoverCardTrigger>
											<Badge variant='secondary'>
												{`+ ${selectedValues.length - maxCount} more`}
												<XCircle
													className='ml-2 h-4 w-4 cursor-pointer'
													onClick={(event) => {
														event.stopPropagation()
														clearExtraOptions()
													}}
												/>
											</Badge>
										</HoverCardTrigger>
										<HoverCardContent className='flex w-96 flex-wrap items-center gap-x-1 gap-y-2 p-2'>
											{Array.isArray(selectedValues) &&
												selectedValues.slice(maxCount).map((item) => (
													<Badge key={String(item)} variant='secondary'>
														{String(item)}
														<XCircle
															className='ml-2 h-4 w-4 cursor-pointer'
															onClick={(event) => {
																event.stopPropagation()
																toggleOption(item)
															}}
														/>
													</Badge>
												))}
										</HoverCardContent>
									</HoverCard>
								)}
							</div>
							<div className='flex items-center justify-between'>
								<XIcon
									className='mx-2 h-4 w-4 cursor-pointer text-muted-foreground'
									onClick={(event) => {
										event.stopPropagation()
										handleClear()
									}}
								/>
								<Separator orientation='vertical' className='flex h-full min-h-6' />
								<ChevronDown className='mx-2 h-4 cursor-pointer text-muted-foreground' />
							</div>
						</div>
					) : (
						<Div className='mx-auto flex w-full items-center justify-between'>
							<Typography variant='small' className='mx-3 text-sm font-normal text-muted-foreground'>
								{placeholder}
							</Typography>
							<ChevronDown className='mx-2 h-4 w-4 cursor-pointer text-muted-foreground' />
						</Div>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='w-[var(--radix-popover-trigger-width)] p-0'
				align='start'
				onEscapeKeyDown={() => setIsPopoverOpen(false)}>
				<Command shouldFilter={shouldFilter}>
					<CommandInput
						placeholder='Search...'
						onKeyDown={handleInputKeyDown}
						onInput={(e) => {
							if (typeof onInput === 'function') onInput(String(e.currentTarget.value))
						}}
					/>
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							<CommandItem key='all' onSelect={toggleAll} className='cursor-pointer'>
								<Div
									className={cn(
										'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
										selectedValues.length === datalist.length
											? 'bg-primary text-primary-foreground'
											: 'opacity-50 [&_svg]:invisible'
									)}>
									<CheckIcon className='!size-3' />
								</Div>
								<Typography variant='small'>(Select All)</Typography>
							</CommandItem>
							{Array.isArray(datalist) &&
								datalist.map((option) => {
									const isSelected = selectedValues.includes(option?.[valueField])
									return (
										<CommandItem
											key={option?.[valueField] as string}
											onSelect={() => toggleOption(option?.[valueField])}
											className='cursor-pointer'>
											<Div
												className={cn(
													'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-all duration-100',
													isSelected
														? 'bg-primary text-primary-foreground'
														: 'opacity-50 [&_svg]:invisible'
												)}>
												<CheckIcon className='!size-3' />
											</Div>
											{/* {option.icon && <option.icon className='mr-2 h-4 w-4 text-muted-foreground' />} */}
											<Typography variant='small'>{String(option?.[labelField])}</Typography>
										</CommandItem>
									)
								})}
						</CommandGroup>
					</CommandList>
					<CommandSeparator />
					<CommandGroup>
						<Div className='flex items-center justify-between gap-x-1'>
							{Array.isArray(selectedValues) && selectedValues.length > 0 && (
								<React.Fragment>
									<CommandItem onSelect={handleClear} className='flex-1 cursor-pointer justify-center'>
										Clear
									</CommandItem>
									<Separator orientation='vertical' className='flex h-full min-h-6' />
								</React.Fragment>
							)}
							<CommandItem
								onSelect={() => setIsPopoverOpen(false)}
								className='max-w-full flex-1 cursor-pointer justify-center'>
								Close
							</CommandItem>
						</Div>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

MultiSelect.displayName = 'MultiSelect'
