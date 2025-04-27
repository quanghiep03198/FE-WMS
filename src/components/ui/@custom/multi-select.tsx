import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	buttonVariants,
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
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator,
	Typography
} from '@/components/ui'
import { notUndefined, useVirtualizer } from '@tanstack/react-virtual'
import { CommandLoading } from 'cmdk'
import { CheckIcon, ChevronDown, XCircle, XIcon } from 'lucide-react'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'

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

		/**
		 * Additional class names to apply custom styles to the multi-select component.
		 * Optional, can be used to add custom styles.
		 */
		loading?: boolean
	}

const ESTIMATE_SIZE = 32
const PRERENDER_COUNT = 5

export function MultiSelect<D = Record<string, any>>({
	datalist,
	labelField,
	valueField,
	shouldFilter = true,
	onValueChange,
	onInput,
	loading,
	value,
	defaultValue = [],
	placeholder = 'Select options',
	maxCount = 3,
	modalPopover = false,
	className,
	ref,
	...props
}: MultiSelectProps<D>) {
	'use no memo'

	const [selectedValues, setSelectedValues] = useState<Array<D[keyof D]>>(defaultValue)
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		event.stopPropagation()

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

	const handleTogglePopover = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		setIsPopoverOpen((prev) => !prev)
	}

	const clearExtraOptions = () => {
		const newSelectedValues = selectedValues.slice(0, maxCount)
		setSelectedValues(newSelectedValues)
		onValueChange(newSelectedValues as Array<D[keyof D]>)
	}

	const toggleAll = () => {
		if (
			Array.isArray(datalist) &&
			Array.isArray(selectedValues) &&
			datalist?.length > 0 &&
			selectedValues?.length === datalist?.length
		) {
			handleClear()
		} else {
			const allValues = datalist.map((option) => String(option?.[valueField]))
			setSelectedValues(allValues as Array<D[keyof D]>)
			onValueChange(allValues as Array<D[keyof D]>)
		}
	}

	useEffect(() => {
		if (Array.isArray(value)) setSelectedValues(value)
	}, [value])

	// TODO: Implement virtual scroll for better performance with large list
	const [scrollableEl, setScrollableEl] = useState<HTMLDivElement>(null)
	const refCallback = useCallback((node: HTMLDivElement) => {
		if (node) {
			setScrollableEl(node)
		}
	}, [])

	const scrollingRef = useRef<number>(0)

	const scrollToFn = useScrollToFn({ current: scrollableEl }, scrollingRef)
	const getScrollElement = useCallback(() => scrollableEl, [scrollableEl])
	const estimateSize = useCallback(() => ESTIMATE_SIZE, [])
	const virtualizer = useVirtualizer({
		indexAttribute: 'data-index',
		count: datalist?.length,
		overscan: PRERENDER_COUNT,
		estimateSize,
		getScrollElement,
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		scrollToFn
	})

	const virtualItems = virtualizer.getVirtualItems()

	const [before, after] =
		virtualItems.length > 0
			? [
					notUndefined(virtualItems[0]).start - virtualizer.options.scrollMargin,
					virtualItems.length > 0
						? virtualizer.getTotalSize() - notUndefined(virtualItems[virtualItems.length - 1]).end
						: 0
				]
			: [0, 0]

	useEffect(() => {
		// If the popover is closed, there is no need to measure
		if (!isPopoverOpen) return
		virtualizer.measure()
	}, [isPopoverOpen, virtualizer])

	return (
		<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
			<PopoverTrigger
				{...props}
				ref={ref}
				onClick={handleTogglePopover}
				className={cn(
					buttonVariants({ variant: 'outline' }),
					'flex w-full max-w-full items-center justify-between overflow-y-hidden overflow-x-scroll rounded-md border bg-inherit p-1 pr-0 !shadow-sm !scrollbar-none aria-[invalid=true]:!border-destructive hover:bg-inherit [&_svg]:pointer-events-auto',
					className
				)}>
				{Array.isArray(datalist) && Array.isArray(selectedValues) && selectedValues?.length > 0 ? (
					<Div className='flex w-full items-center justify-between'>
						<Div className='flex items-center gap-x-1 whitespace-normal'>
							{Array.isArray(selectedValues) &&
								selectedValues.slice(0, maxCount).map((value) => {
									const option = datalist.find((item) => item?.[valueField] === value)
									return (
										<Badge key={String(value)} variant='secondary'>
											<span className='line-clamp-1'>{String(option?.[labelField])}</span>
											<XCircle
												className='ml-2 size-4 min-w-4 basis-4 cursor-pointer'
												onClick={(event) => {
													event.stopPropagation()
													toggleOption(value)
												}}
											/>
										</Badge>
									)
								})}
							{Array.isArray(selectedValues) && selectedValues?.length > maxCount && (
								<HoverCard>
									<HoverCardTrigger>
										<Badge variant='secondary' className='whitespace-nowrap'>
											{`+ ${selectedValues?.length - maxCount} more`}
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
						</Div>
						<Div className='sticky right-0 flex items-center justify-between bg-background'>
							<XIcon
								className='mx-2 h-4 w-4 cursor-pointer text-muted-foreground'
								onClick={(event) => {
									event.stopPropagation()
									handleClear()
								}}
							/>
							<Separator orientation='vertical' className='flex h-full min-h-6' />
							<ChevronDown className='mx-2 h-4 cursor-pointer text-muted-foreground' />
						</Div>
					</Div>
				) : (
					<Div className='mx-auto flex w-full items-center justify-between'>
						<Typography variant='small' className='mx-3 text-sm font-normal text-muted-foreground'>
							{placeholder}
						</Typography>
						<ChevronDown className='mx-2 h-4 w-4 cursor-pointer text-muted-foreground' />
					</Div>
				)}
			</PopoverTrigger>
			<PopoverContent
				className='w-[var(--radix-popover-trigger-width)] p-0'
				align='start'
				onEscapeKeyDown={() => setIsPopoverOpen(false)}>
				<Command
					shouldFilter={shouldFilter}
					filter={(value, search) => {
						const normalizedSearchTerm = search.trim().toLowerCase()
						const normalizedValue = value.trim().toLowerCase()
						if (datalist?.length === 0) return 0
						return normalizedValue.includes(normalizedSearchTerm) ? 1 : 0
					}}>
					<CommandInput
						placeholder='Search...'
						onKeyDown={handleInputKeyDown}
						onInput={(e) => {
							e.stopPropagation()
							if (typeof onInput === 'function') onInput(String(e.currentTarget.value))
						}}
					/>
					<CommandList ref={refCallback}>
						{loading && (
							<CommandLoading className='flex items-center justify-center p-6'>
								<Icon name='LoaderCircle' className='animate-spin' />
							</CommandLoading>
						)}
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							<CommandItem
								key='all'
								disabled={datalist?.length === 0}
								keywords={['all']}
								onSelect={toggleAll}
								className='cursor-pointer'>
								<Div
									className={cn(
										'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
										selectedValues?.length === datalist?.length && datalist?.length > 0
											? 'bg-primary text-primary-foreground'
											: 'opacity-50 [&_svg]:invisible'
									)}>
									<CheckIcon className='!size-3' />
								</Div>
								<Typography variant='small'>(Select All)</Typography>
							</CommandItem>
							{before > 0 && <CommandItem disabled style={{ height: before }} />}
							{virtualItems.map((item) => {
								const option = datalist[item.index]
								const isSelected = selectedValues.includes(option?.[valueField])
								return (
									<CommandItem
										key={item.key}
										data-index={item.index}
										value={String(option[valueField])}
										keywords={[String(option[valueField])]}
										onSelect={() => toggleOption(option[valueField])}>
										<Checkbox checked={isSelected} />
										<Typography variant='small'>{String(option?.[labelField])}</Typography>
									</CommandItem>
								)
							})}
							{after > 0 && <CommandItem disabled style={{ height: after }} />}
						</CommandGroup>
					</CommandList>
					<CommandSeparator />
					<CommandGroup>
						<Div className='flex items-center justify-between gap-x-1'>
							{Array.isArray(selectedValues) && selectedValues?.length > 0 && (
								<Fragment>
									<CommandItem onSelect={handleClear} className='flex-1 cursor-pointer justify-center'>
										Clear
									</CommandItem>
									<Separator orientation='vertical' className='flex h-full min-h-6' />
								</Fragment>
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

const Checkbox: React.FC<{ checked: boolean }> = ({ checked }) => (
	<Div
		className={cn(
			'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary transition-all duration-100',
			checked ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
		)}>
		<CheckIcon className='!size-3' />
	</Div>
)

MultiSelect.displayName = 'MultiSelect'
