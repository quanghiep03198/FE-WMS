'use no memo'

import { cn } from '@/common/utils/cn'
import { Command as CommandPrimitive } from 'cmdk'
import React, { KeyboardEvent, createContext, forwardRef, useCallback, useContext, useEffect, useState } from 'react'
import { Badge } from '../@core/badge'
import { Command, CommandEmpty, CommandItem, CommandList } from '../@core/command'
import { Icon } from '../@core/icon'
import { Div } from './div'
import ScrollShadow from './scroll-shadow'

interface MultiSelectProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
	values: string[]
	onValuesChange: (value: string[]) => void
	loop?: boolean
}

interface MultiSelectContextProps {
	value: string[]
	onValueChange: (value: any) => void
	open: boolean
	setOpen: (value: boolean) => void
	inputValue: string
	setInputValue: React.Dispatch<React.SetStateAction<string>>
	activeIndex: number
	setActiveIndex: React.Dispatch<React.SetStateAction<number>>
	ref: React.RefObject<HTMLInputElement>
	handleSelect: (e: React.SyntheticEvent<HTMLInputElement>) => void
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null)

const useMultiSelect = () => {
	const context = useContext(MultiSelectContext)
	if (!context) {
		throw new Error('useMultiSelect must be used within MultiSelectProvider')
	}
	return context
}

/**
 * MultiSelect Docs: {@link: https://shadcn-extension.vercel.app/docs/multi-select}
 */

// TODO : expose the visibility of the popup

const MultiSelect = ({
	values: value,
	onValuesChange: onValueChange,
	loop = false,
	className,
	children,
	dir,
	...props
}: MultiSelectProps) => {
	const [inputValue, setInputValue] = useState('')
	const [open, setOpen] = useState<boolean>(false)
	const [activeIndex, setActiveIndex] = useState<number>(-1)
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [isValueSelected, setIsValueSelected] = React.useState(false)
	const [selectedValue, setSelectedValue] = React.useState('')

	const onValueChangeHandler = useCallback(
		(val: string) => {
			if (value?.includes(val)) {
				onValueChange(value.filter((item) => item !== val))
			} else {
				onValueChange([...value, val])
			}
		},
		[value]
	)

	const handleSelect = React.useCallback(
		(e: React.SyntheticEvent<HTMLInputElement>) => {
			e.preventDefault()
			const target = e.currentTarget
			const selection = target.value.substring(target.selectionStart ?? 0, target.selectionEnd ?? 0)
			setSelectedValue(selection)
			setIsValueSelected(selection === inputValue)
		},
		[inputValue]
	)

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLDivElement>) => {
			e.stopPropagation()
			const target = inputRef.current

			if (!target) return

			const moveNext = () => {
				const nextIndex = activeIndex + 1
				setActiveIndex(nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex)
			}

			const movePrev = () => {
				const prevIndex = activeIndex - 1
				setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex)
			}

			const moveCurrent = () => {
				const newIndex = activeIndex - 1 <= 0 ? (value.length - 1 === 0 ? -1 : 0) : activeIndex - 1
				setActiveIndex(newIndex)
			}

			switch (e.key) {
				case 'ArrowLeft':
					if (dir === 'rtl') {
						if (value.length > 0 && (activeIndex !== -1 || loop)) {
							moveNext()
						}
					} else {
						if (value.length > 0 && target.selectionStart === 0) {
							movePrev()
						}
					}
					break

				case 'ArrowRight':
					if (dir === 'rtl') {
						if (value.length > 0 && target.selectionStart === 0) {
							movePrev()
						}
					} else {
						if (value.length > 0 && (activeIndex !== -1 || loop)) {
							moveNext()
						}
					}
					break

				case 'Backspace':
				case 'Delete':
					if (value.length > 0) {
						if (activeIndex !== -1 && activeIndex < value.length) {
							onValueChangeHandler(value[activeIndex])
							moveCurrent()
						} else {
							if (target.selectionStart === 0) {
								if (selectedValue === inputValue || isValueSelected) {
									onValueChangeHandler(value[value.length - 1])
								}
							}
						}
					}
					break

				case 'Enter':
					setOpen(true)
					break

				case 'Escape':
					if (activeIndex !== -1) {
						setActiveIndex(-1)
					} else if (open) {
						setOpen(false)
					}
					break
			}
		},
		[value, inputValue, activeIndex, loop]
	)

	return (
		<MultiSelectContext.Provider
			value={{
				value,
				onValueChange: onValueChangeHandler,
				open,
				setOpen,
				inputValue,
				setInputValue,
				activeIndex,
				setActiveIndex,
				ref: inputRef,
				handleSelect
			}}>
			<Command
				onKeyDown={handleKeyDown}
				className={cn('flex h-auto flex-col overflow-visible bg-transparent', className)}
				dir={dir}
				{...props}>
				{children}
			</Command>
		</MultiSelectContext.Provider>
	)
}

const MultiSelectTrigger = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, children, ...props }, ref: React.Ref<HTMLDivElement>) => {
		const { value, onValueChange, activeIndex } = useMultiSelect()

		const scrollRef = React.useRef<HTMLDivElement>(null)
		const resolvedRef = (ref || scrollRef) as React.RefObject<HTMLDivElement>

		const mousePreventDefault = useCallback((e: React.MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
		}, [])

		useEffect(() => {
			if (resolvedRef) resolvedRef.current?.scrollTo({ left: resolvedRef.current?.scrollWidth })
		}, [value])

		return (
			<Div
				className={cn(
					'flex h-9 items-center rounded-md border border-input bg-background p-2 text-sm',
					{
						'focus-within:border-primary': activeIndex === -1
					},
					className
				)}>
				<ScrollShadow
					ref={scrollRef}
					orientation='horizontal'
					className={cn(
						'flex w-full flex-nowrap items-center gap-1 overflow-x-auto rounded-[inherit] bg-transparent !scrollbar-none'
					)}
					{...props}>
					{Array.isArray(value) &&
						value.map((item, index) => (
							<Badge
								key={item}
								className={cn(
									'flex items-center gap-1 px-1.5',
									activeIndex === index && 'ring-2 ring-muted-foreground'
								)}
								variant={'secondary'}>
								<span className='text-xs'>{item}</span>
								<button
									aria-label={`Remove ${item} option`}
									aria-roledescription='button to remove option'
									type='button'
									onMouseDown={mousePreventDefault}
									onClick={() => onValueChange(item)}>
									<span className='sr-only'>Remove {item} option</span>
									<Icon name='X' className='stroke-muted-foreground hover:stroke-foreground' />
								</button>
							</Badge>
						))}
					{children}
				</ScrollShadow>
			</Div>
		)
	}
)

MultiSelectTrigger.displayName = 'MultiSelectTrigger'

const MultiSelectInput = forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
	const {
		setOpen,
		inputValue,
		setInputValue,
		activeIndex,
		setActiveIndex,
		handleSelect,
		ref: inputRef
	} = useMultiSelect()

	return (
		<CommandPrimitive.Input
			{...props}
			tabIndex={0}
			ref={inputRef}
			value={inputValue}
			onValueChange={activeIndex === -1 ? setInputValue : undefined}
			onSelect={handleSelect}
			onBlur={() => setOpen(false)}
			onFocus={() => setOpen(true)}
			onClick={() => setActiveIndex(-1)}
			className={cn(
				'flex-1 bg-transparent px-2 outline-none placeholder:text-muted-foreground',
				className,
				activeIndex !== -1 && 'caret-transparent'
			)}
		/>
	)
})

MultiSelectInput.displayName = 'MultiSelectInput'

const MultiSelectContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children }, ref) => {
	const { open } = useMultiSelect()
	return (
		<div
			ref={ref}
			data-state={open ? 'open' : 'closed'}
			className={cn(
				'translate-y-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
			)}>
			{open && children}
		</div>
	)
})

MultiSelectContent.displayName = 'MultiSelectContent'

const MultiSelectList = forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children }, ref) => {
	return (
		<CommandList
			ref={ref}
			className={cn(
				'scrollbar-thumb-rounded-lg absolute top-0 z-10 flex w-full flex-col gap-1 rounded-md border border-muted bg-background p-1 shadow-md transition-colors scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted',
				className
			)}>
			{children}
			<CommandEmpty>
				<span className='text-muted-foreground'>No results found</span>
			</CommandEmpty>
		</CommandList>
	)
})

MultiSelectList.displayName = 'MultiSelectList'

const MultiSelectItem = forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	{ value: string } & React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, value, children, ...props }, ref) => {
	const { value: Options, onValueChange, setInputValue } = useMultiSelect()

	const mousePreventDefault = useCallback((e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}, [])

	const isIncluded = Options?.includes(value)
	return (
		<CommandItem
			ref={ref}
			{...props}
			onSelect={() => {
				onValueChange(value)
				setInputValue('')
			}}
			className={cn(
				className,
				isIncluded && 'cursor-default opacity-50',
				props.disabled && 'cursor-not-allowed opacity-50'
			)}
			onMouseDown={mousePreventDefault}>
			{children}
			{isIncluded && <Icon name='Check' className='ml-auto' />}
		</CommandItem>
	)
})

MultiSelectItem.displayName = 'MultiSelectItem'

export { MultiSelect, MultiSelectContent, MultiSelectInput, MultiSelectItem, MultiSelectList, MultiSelectTrigger }
