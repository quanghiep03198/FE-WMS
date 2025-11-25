'use no memo'

import { BaseFieldControl } from '@/common/types/hook-form'
import { cn } from '@/common/utils/cn'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { ResourceKey } from 'i18next'
import React, { useId, useMemo, useRef } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { v4 as uuidv4 } from 'uuid'
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
} from '../..'

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
	onInput?: (value: string) => any
	onSelect?: (value: string) => unknown
} & React.ComponentProps<'input'>

export function AutoCompleteFieldControl<T, D>(props: AutoCompleteFieldControlProps<T, D>) {
	const { t } = useTranslation()
	const { control, getFieldState, watch, setValue } = useFormContext()
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
		className,
		onInput,
		onSelect,
		template: CustomAutoCompleteItem,
		ref: forwardedRef
	} = props
	const id = useId()
	const internalRef = useRef<HTMLInputElement>(null)
	const resolvedRef = (forwardedRef || internalRef) as React.RefObject<HTMLInputElement>
	const [open, setOpen] = React.useState(false)

	const currentValue = watch(name) ?? ''

	const filteredDatalist = useMemo(() => {
		if (!shouldFilter) return datalist ?? []

		return Array.isArray(datalist)
			? datalist.filter((item) => String(item[valueField]).toLowerCase().includes(currentValue.toLowerCase()))
			: []
	}, [datalist, shouldFilter, currentValue])

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') e.preventDefault()
		else if (e.key === 'Escape') setOpen(false)
		else {
			setOpen(true)
		}
	}

	const { error } = getFieldState(name)

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
							<Popover open={open} onOpenChange={setOpen} modal={false}>
								<FormControl>
									<Tooltip
										message={t(error?.message as ResourceKey) || ''}
										triggerProps={{ asChild: true, type: 'button', className: 'w-full' }}
										contentProps={{
											hidden: !error || errorMessageVariant === 'inline',
											className: 'bg-destructive text:text-destructive-foreground',
											['aria-invalid']: !!error
										}}>
										<PopoverTrigger
											type='button'
											className='relative w-full'
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
									className='max-h-52 w-[var(--radix-popover-trigger-width)] overflow-auto p-1'
									onOpenAutoFocus={(e) => e.preventDefault()}>
									{loading ? (
										<Div className='flex items-center justify-center p-10 text-center'>
											<Icon name='LoaderCircle' size={18} className='animate-[spin_1s_linear_infinite]' />
										</Div>
									) : filteredDatalist?.length > 0 ? (
										filteredDatalist?.map((item) => {
											if (CustomAutoCompleteItem)
												return <CustomAutoCompleteItem key={uuidv4()} value={item} />

											return (
												<AutoCompleteItem
													key={uuidv4()}
													onClick={(e) => {
														e.stopPropagation()
														setValue(name, item[valueField])
														setOpen(false)
														if (typeof onSelect === 'function') onSelect(String(item[valueField]))
													}}>
													<Typography variant='small' className='line-clamp-1 flex-1'>
														{String(item[labelField])}
													</Typography>
													<CheckIcon
														className={cn(
															'ml-auto transition-opacity duration-200',
															field.value === item[valueField] ? 'opacity-100' : 'opacity-0'
														)}
													/>
												</AutoCompleteItem>
											)
										})
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

const AutoCompleteItem = tw.div`flex cursor-pointer items-center rounded-md p-2 h-8 hover:bg-secondary hover:text-secondary-foreground`

AutoCompleteFieldControl.displayName = 'AutoCompleteFieldControl'
