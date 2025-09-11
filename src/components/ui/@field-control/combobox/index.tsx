import { cn } from '@/common/utils/cn'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { CommandLoading } from 'cmdk'
import { Fragment, useId, useMemo, useState } from 'react'
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form'
import {
	Button,
	ButtonProps,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
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
	Typography
} from '../..'
import { BaseFieldControl } from '../../../../common/types/hook-form'

export type ComboboxFieldControlProps<T extends FieldValues, D = Record<string, any>> = Omit<
	BaseFieldControl<T>,
	'control'
> & {
	datalist: Array<D>
	disabled?: boolean
	loading?: boolean
	template?: React.FC<
		{ data: D } & React.ComponentProps<
			'div' extends keyof HTMLElementTagNameMap ? keyof HTMLElementTagNameMap : React.ElementType
		>
	>
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
						className={cn(
							orientation === 'horizontal'
								? 'grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0'
								: 'space-y-2',
							hidden && 'hidden'
						)}>
						{label && (
							<FormLabel
								htmlFor={id}
								className={orientation === 'horizontal' && 'translate-y-3/4 align-middle leading-none'}>
								{label}
							</FormLabel>
						)}
						<Div className={cn('space-y-2')}>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											{...triggerProps}
											id={id}
											disabled={disabled}
											aria-invalid={isError}
											variant='outline'
											className={cn(
												triggerProps?.className,
												'w-full justify-between bg-background px-3 font-normal aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-within:border-destructive hover:bg-background focus:border-primary'
											)}>
											<Typography variant='small' className='line-clamp-1'>
												{renderCurrentValue(field.value)}
											</Typography>
											<CaretSortIcon className='ml-auto h-4 w-4 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0' {...popoverContentProps}>
									<Command value={field.value} shouldFilter={shouldFilter}>
										<CommandInput
											value={searchTerm}
											placeholder='Search ...'
											onValueChange={(value) => {
												if (typeof onInput === 'function') onInput(value)
												setSearchTerm(value)
											}}
										/>
										<CommandList>
											{loading ? (
												<CommandLoading className='h-12 cursor-wait place-content-center place-items-center'>
													<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
												</CommandLoading>
											) : (
												<Fragment>
													<CommandEmpty>No result</CommandEmpty>
													<CommandGroup>
														{options.map((option) => {
															return (
																<CommandItem
																	key={option[valueField].toString()}
																	keywords={[
																		option[labelField].toString(),
																		option[valueField].toString()
																	]}
																	value={option[valueField]}
																	className='line-clamp-1 flex items-center gap-x-4'
																	onSelect={(value) => {
																		setValue(name, value as PathValue<T, Path<T>>)
																		setValue(name, option[valueField])
																		clearErrors(name)
																		if (typeof onSelect === 'function') onSelect(option[valueField])
																	}}>
																	{CommandItemTemplate ? (
																		<CommandItemTemplate
																			data={option}
																			onMouseEnter={(e) => {
																				e.currentTarget.parentElement.dataset.selected = 'true'
																			}}
																			onMouseLeave={(e) => {
																				e.currentTarget.parentElement.dataset.selected = 'false'
																			}}
																		/>
																	) : (
																		<Typography variant='small' className='line-clamp-1 flex-1'>
																			{option[labelField]}
																		</Typography>
																	)}
																	<Icon
																		name='Check'
																		className={cn(
																			'ml-auto',
																			option[valueField] === field.value
																				? 'opacity-100'
																				: 'opacity-0'
																		)}
																	/>
																</CommandItem>
															)
														})}
													</CommandGroup>
												</Fragment>
											)}
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
