'use no memo'

import type { BaseFieldControl } from '@common/types/hook-form'
import { cn } from '@common/utils/cn'
import useScrollToFn from '@hooks/use-scroll-fn'
import useVirtualScrollPadding from '@hooks/use-virtual-scroll-padding'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useId, useMemo, useRef, useState } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { Div } from '../../customs/div'
import { Tooltip } from '../../customs/tooltip'
import { Typography } from '../../customs/typography'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Icon } from '../../ui/icon'
import { Input } from '../../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'

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

export function AutoCompleteFieldControl<T extends FieldValues, D>(props: AutoCompleteFieldControlProps<T, D>) {
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
		hidden,
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
	const [scrollElement, setScrollElement] = useState<Nullish<HTMLDivElement>>(null)
	const refCallback = useCallback((node: HTMLDivElement) => {
		if (node) {
			setScrollElement(node)
		}
	}, [])

	const scrollToFn = useScrollToFn({ current: scrollElement! })
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
						aria-hidden={hidden}
						aria-orientation={orientation}
						className='space-y-2 aria-hidden:hidden aria-[orientation=horizontal]:grid aria-[orientation=horizontal]:grid-cols-[1fr_2fr] aria-[orientation=horizontal]:items-start aria-[orientation=horizontal]:gap-2 aria-[orientation=horizontal]:space-y-0'
						style={
							{
								'--item-height': '32px'
							} as React.CSSProperties
						}>
						{label && (
							<FormLabel
								aria-orientation={orientation}
								className='text-pretty aria-[orientation=horizontal]:translate-y-3/4 aria-[orientation=horizontal]:align-middle aria-[orientation=horizontal]:leading-none'
								htmlFor={id}>
								{label}
							</FormLabel>
						)}
						<Div className='space-y-2'>
							<Popover modal={false} open={open && props['aria-haspopup'] !== 'false'} onOpenChange={setOpen}>
								<FormControl>
									<Tooltip
										message={t(error?.message, { defaultValue: error?.message })}
										triggerProps={{ asChild: true, type: 'button', className: 'w-full' }}
										contentProps={{
											hidden: !error || errorMessageVariant === 'inline',
											side: 'bottom',
											align: 'start',
											className: 'bg-destructive text:text-destructive-foreground',
											['aria-invalid']: !!error
										}}>
										<PopoverTrigger
											aria-disabled={disabled}
											className='relative w-full aria-disabled:opacity-50'
											type='button'
											onClick={(e) => e.preventDefault()}>
											<Input
												aria-invalid={!!getFieldState(name).error}
												autoComplete='off'
												data-icon={props['data-icon']}
												disabled={disabled}
												id={id}
												placeholder={placeholder}
												readOnly={readOnly}
												ref={resolvedRef}
												value={field.value}
												className={cn(
													'peer aria-invalid:border-destructive aria-invalid:focus-within:border-destructive pr-9 transition-colors',
													className
												)}
												onClick={() => setOpen(true)}
												onKeyDown={handleKeyDown}
												onChange={(e) => {
													field.onChange(e)
													if (typeof onInput === 'function') onInput(e.target.value)
												}}
											/>
											<CaretSortIcon className='absolute top-1/2 right-3 ml-auto h-4 w-4 -translate-y-1/2 opacity-50 peer-data-[icon=false]:hidden' />
										</PopoverTrigger>
									</Tooltip>
								</FormControl>
								<PopoverContent
									className='w-radix-popover max-h-52 overflow-auto scroll-auto p-1'
									ref={refCallback}
									onOpenAutoFocus={(e) => e.preventDefault()}>
									{loading ? (
										<Div className='flex items-center justify-center p-10 text-center'>
											<Icon className='animate-spin' name='LoaderCircle' size={18} />
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
															style={{ height: item.size }}
															value={option}
														/>
													)

												return (
													<AutoCompleteItem
														aria-selected={field.value === option[valueField]}
														key={item.key}
														style={{ height: item.size }}
														onClick={(e) => {
															e.stopPropagation()
															setValue(name, option[valueField])
															setOpen(false)
															if (typeof onSelect === 'function') onSelect(String(option[valueField]))
															if (typeof onItemClick === 'function') onItemClick(option)
														}}>
														<Typography className='line-clamp-1 flex-1' variant='small'>
															{String(option[labelField])}
														</Typography>
														<CheckIcon className='group-aria-selected:-item:opacity-100 ml-auto opacity-0 transition-opacity duration-200' />
													</AutoCompleteItem>
												)
											})}
											{after > 0 && <AutoCompleteItem style={{ height: after }} />}
										</Div>
									) : (
										<Typography className='block h-full p-10 text-center' color='muted' variant='small'>
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
