'use no memo'

import useScrollToFn from '@/hooks/use-scroll-fn'
import useVirtualScrollPadding from '@/hooks/use-virtual-scroll-padding'
import type { BaseFieldControl } from '@common/types/hook-form'
import { cn } from '@common/utils/cn'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { ResourceKey } from 'i18next'
import { useCallback, useId, useMemo, useRef, useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import {
	Div,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Icon,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Tooltip,
	Typography
} from '../../ui'

export type AutoCompleteFieldControlProps<T extends FieldValues, D = Record<string, any>> = Omit<
	BaseFieldControl<T>,
	'control'
> & {
	placeholder?: string
	loading?: boolean
	disabled?: boolean
	shouldFilter?: boolean
	datalist: Array<D>
	labelField: keyof D
	valueField: keyof D
	template?: React.FC<
		{ value: D } & React.ComponentProps<
			'div' extends keyof HTMLElementTagNameMap ? keyof HTMLElementTagNameMap : React.ElementType
		>
	>
	estimateItemHeight?: number
	onInput?: (value: string) => any
	onSelect?: (value: string) => unknown
	onItemClick?: (value: D) => unknown
} & React.ComponentProps<'input'>

export function AutoCompleteFieldControl<T, D>(props: AutoCompleteFieldControlProps<T, D>) {
	const { t } = useTranslation()
	const { control, getFieldState, setValue } = useFormContext()
	const {
		name,
		placeholder,
		datalist,
		loading,
		labelField,
		valueField,
		label,
		shouldFilter = true,
		description,
		disabled,
		readOnly,
		orientation = 'vertical',
		errorMessageVariant = 'inline',
		estimateItemHeight = 32,
		className,
		onInput,
		onSelect,
		onItemClick,
		template: CustomAutoCompleteItem,
		ref: forwardedRef
	} = props
	const id = useId()
	const internalRef = useRef<HTMLInputElement>(null)
	const resolvedRef = (forwardedRef || internalRef) as React.RefObject<HTMLInputElement>
	const [open, setOpen] = useState(false)

	const currentValue = useWatch({ name, control }) ?? ''

	const filteredDatalist = useMemo(() => {
		if (!shouldFilter) return datalist ?? []

		const filterFn = (item: D) => {
			const value = item[valueField]
			if (value === null || value === undefined) return false
			const currVal = currentValue ?? ''
			return String(value).toLowerCase().includes(String(currVal).toLowerCase())
		}

		return Array.isArray(datalist) ? datalist.filter(filterFn) : []
	}, [datalist, valueField, shouldFilter, currentValue])

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') e.preventDefault()
		else if (e.key === 'Escape') setOpen(false)
		else {
			setOpen(true)
		}
	}

	const { error } = getFieldState(name)
	const [scrollElement, setScrollElement] = useState<HTMLDivElement>(null)
	const refCallback = useCallback((node: HTMLDivElement) => {
		if (node) {
			setScrollElement(node)
		}
	}, [])

	const scrollToFn = useScrollToFn({ current: scrollElement })
	const getScrollElement = useCallback(() => scrollElement, [scrollElement])
	const estimateSize = useCallback(() => estimateItemHeight, [])

	const virtualizer = useVirtualizer({
		count: filteredDatalist?.length,
		overscan: 3,
		estimateSize,
		getScrollElement,
		scrollToFn
	})

	const virtualItems = virtualizer.getVirtualItems()

	const { before, after } = useVirtualScrollPadding(virtualizer)

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				return (
					<FormItem
						className={cn(
							orientation === 'horizontal' ? 'grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0' : 'space-y-2'
						)}
						style={
							{
								'--item-height': '32px'
							} as React.CSSProperties
						}>
						{label && (
							<FormLabel
								htmlFor={id}
								className={orientation === 'horizontal' && 'translate-y-3/4 align-middle leading-none'}>
								{label}
							</FormLabel>
						)}
						<Div className='space-y-2'>
							<Popover open={open && props['aria-haspopup'] !== 'false'} onOpenChange={setOpen} modal={false}>
								<FormControl>
									<Tooltip
										message={t(error?.message as ResourceKey) || ''}
										triggerProps={{ asChild: true, type: 'button', className: 'w-full' }}
										contentProps={{
											hidden: !error || errorMessageVariant === 'inline',
											side: 'bottom',
											align: 'start',
											className: 'bg-destructive text:text-destructive-foreground',
											['aria-invalid']: !!error
										}}>
										<PopoverTrigger
											type='button'
											aria-disabled={disabled}
											className='relative w-full aria-disabled:opacity-50'
											onClick={(e) => e.preventDefault()}>
											<Input
												id={id}
												ref={resolvedRef}
												value={field.value}
												autoComplete='off'
												placeholder={placeholder}
												aria-invalid={!!getFieldState(name).error}
												className={cn(
													'peer pr-9 transition-colors aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-within:border-destructive',
													className
												)}
												data-icon={props['data-icon']}
												onKeyDown={handleKeyDown}
												onClick={() => setOpen(true)}
												onChange={(e) => {
													field.onChange(e)
													if (typeof onInput === 'function') onInput(e.target.value)
												}}
												disabled={disabled}
												readOnly={readOnly}
											/>
											<CaretSortIcon className='absolute right-3 top-1/2 ml-auto h-4 w-4 -translate-y-1/2 opacity-50 peer-data-[icon=false]:hidden' />
										</PopoverTrigger>
									</Tooltip>
								</FormControl>
								<PopoverContent
									ref={refCallback}
									className='max-h-52 w-[var(--radix-popover-trigger-width)] overflow-auto scroll-auto p-1'
									onOpenAutoFocus={(e) => e.preventDefault()}>
									{loading ? (
										<Div className='flex items-center justify-center p-10 text-center'>
											<Icon name='LoaderCircle' size={18} className='animate-[spin_1s_linear_infinite]' />
										</Div>
									) : virtualItems?.length > 0 ? (
										<Div style={{ height: virtualizer.getTotalSize() }}>
											{before > 0 && <AutoCompleteItem style={{ height: before }} />}
											{virtualItems?.map((item) => {
												const option = filteredDatalist[item.index]

												if (CustomAutoCompleteItem)
													return (
														<CustomAutoCompleteItem
															key={item.key}
															value={option}
															style={{ height: item.size }}
														/>
													)

												return (
													<AutoCompleteItem
														key={item.key}
														aria-selected={field.value === option[valueField]}
														style={{ height: item.size }}
														onClick={(e) => {
															e.stopPropagation()
															setValue(name, option[valueField])
															setOpen(false)
															if (typeof onSelect === 'function') onSelect(String(option[valueField]))
															if (typeof onItemClick === 'function') onItemClick(option)
														}}>
														<Typography variant='small' className='line-clamp-1 flex-1'>
															{String(option[labelField])}
														</Typography>
														<CheckIcon className='group-aria-selected:-item:opacity-100 ml-auto opacity-0 transition-opacity duration-200' />
													</AutoCompleteItem>
												)
											})}
											{after > 0 && <AutoCompleteItem style={{ height: after }} />}
										</Div>
									) : (
										<Typography variant='small' color='muted' className='block h-full p-10 text-center'>
											{t('ns_common:table.no_data')}
										</Typography>
									)}
								</PopoverContent>
							</Popover>
							{description && <FormDescription>{description}</FormDescription>}
							{error && errorMessageVariant === 'inline' && <FormMessage />}
						</Div>
					</FormItem>
				)
			}}
		/>
	)
}

const AutoCompleteItem: React.FC<React.ComponentProps<'div'>> =
	tw.div`group flex cursor-pointer items-center rounded-md p-2 h-8 hover:bg-secondary hover:text-secondary-foreground`

AutoCompleteFieldControl.displayName = 'AutoCompleteFieldControl'
