import { cn } from '@/common/utils/cn'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { Fragment, useId, useMemo, useState } from 'react'
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form'
import {
	ButtonProps,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandLoading,
	Div,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Typography,
	buttonVariants
} from '..'
import { BaseFieldControl } from '../../../common/types/hook-form'

type ComboboxFieldControlProps<T extends FieldValues, D = Record<string, any>> = Omit<
	BaseFieldControl<T>,
	'control'
> & {
	datalist: Array<D>
	disabled?: boolean
	loading?: boolean
	template?: React.FC<{ data: D }>
	shouldFilter?: boolean
	onInput?: (value: string) => unknown
	onSelect?: (value: string) => unknown
	labelField: keyof D
	valueField: keyof D
	triggerProps?: ButtonProps
	popoverContentProps?: React.ComponentProps<typeof PopoverContent>
}

export function ComboboxFieldControl<T extends FieldValues, D extends Record<string, any>>(
	props: ComboboxFieldControlProps<T, D>
) {
	const [searchTerm, setSearchTerm] = useState<string>('')

	const {
		name,
		datalist: data,
		labelField,
		valueField,
		label,
		description,
		orientation,
		disabled,
		hidden,
		placeholder = 'Select',
		shouldFilter, // Determine using manual filtering or automatic filtering
		loading, // Loading state from server if manual filtering is applied
		template: CommandItemTemplate, // Custom command item template
		triggerProps,
		popoverContentProps = { align: 'center' },
		onInput,
		onSelect
	} = props

	const id = useId()
	const { control, getFieldState, setValue, clearErrors } = useFormContext()
	const options = useMemo(() => {
		if (!Array.isArray(data)) return []

		return data.filter((option) => {
			if (typeof shouldFilter === 'undefined' || shouldFilter === true) return true
			return (
				String(option[labelField]).toLowerCase().includes(searchTerm.toLowerCase()) ||
				String(option[valueField]).toLowerCase().includes(searchTerm.toLowerCase())
			)
		})
	}, [data, shouldFilter, searchTerm])

	const isError = Boolean(getFieldState(name).error)

	const renderCurrentValue = (value) => {
		if (Array.isArray(data) && data.length > 0) {
			return data?.find((option) => option[valueField] === value)?.[labelField] ?? placeholder
		}
		return placeholder
	}

	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => {
				return (
					<FormItem
						className={cn({
							hidden: hidden,
							'grid grid-cols-[1fr_2fr] grid-rows-4 items-center gap-x-2 space-y-0': orientation === 'horizontal'
						})}>
						{label && (
							<FormLabel
								htmlFor={id}
								className={cn(orientation === 'horizontal' && (isError ? 'row-span-2' : 'row-span-4'))}>
								{label}
							</FormLabel>
						)}
						<Div className={cn('space-y-2', orientation === 'horizontal' && 'row-span-4')}>
							<Popover>
								<PopoverTrigger
									id={id}
									disabled={disabled}
									className={cn(
										buttonVariants({
											variant: 'outline',
											className:
												'w-full justify-between font-normal hover:bg-background focus:border-primary'
										}),
										triggerProps?.className,
										getFieldState(name).error && 'border-destructive focus:border-destructive'
									)}
									{...triggerProps}>
									<FormControl>
										<Fragment>
											<Typography variant='small' className='line-clamp-1'>
												{renderCurrentValue(field.value)}
											</Typography>
											<CaretSortIcon className='ml-auto h-4 w-4 opacity-50' />
										</Fragment>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
									<Command shouldFilter={shouldFilter}>
										<CommandInput
											placeholder={placeholder}
											onValueChange={(value) => {
												if (typeof onInput === 'function') onInput(value)
												setSearchTerm(value)
											}}
										/>
										{loading && <CommandLoading />}
										{!loading && (
											<CommandEmpty>
												<Typography variant='small' color='muted'>
													No result
												</Typography>
											</CommandEmpty>
										)}
										<CommandList className='scrollbar'>
											<CommandGroup>
												{Array.isArray(data) &&
													options.map((option) => {
														return (
															<CommandItem
																key={option[valueField]}
																value={option[valueField]}
																className='line-clamp-1 flex items-center gap-x-4'
																onSelect={(value) => {
																	setValue(name, value as PathValue<T, Path<T>>)
																	setValue(name, option[valueField])
																	clearErrors(name)
																	if (typeof onSelect === 'function') onSelect(option[valueField])
																}}>
																{CommandItemTemplate ? (
																	<CommandItemTemplate data={option} />
																) : (
																	<Typography variant='small' className='line-clamp-1 flex-1'>
																		{option[labelField]}
																	</Typography>
																)}
																<Icon
																	name='Check'
																	className={cn(
																		'ml-auto',
																		option[valueField] === field.value ? 'opacity-100' : 'opacity-0'
																	)}
																/>
															</CommandItem>
														)
													})}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							{description && <FormDescription>{description}</FormDescription>}
							<FormMessage />
						</Div>
					</FormItem>
				)
			}}
		/>
	)
}
