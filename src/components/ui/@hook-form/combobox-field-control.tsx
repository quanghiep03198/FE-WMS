import { cn } from '@/common/utils/cn'
import { memo, useId, useRef, useState } from 'react'
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandLoading,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Typography
} from '..'
import { BaseFieldControl } from '../../../common/types/hook-form'
import FormLabel from './alternative-form-label'

type ComboboxFieldControlProps<T extends FieldValues, D = Record<string, any>> = Omit<
	BaseFieldControl<T>,
	'control'
> & {
	form: UseFormReturn<T>
	data: Array<D>
	disabled?: boolean
	loading?: boolean
	template?: React.FC<{ data: D }>
	shouldFilter?: boolean
	onInput?: (value: string) => unknown
	onSelect?: (value: string) => unknown
} & {
	labelField: keyof D
	valueField: keyof D
}

export const ComboboxFieldControl = memo(
	<T extends FieldValues, D extends Record<string, any>>(props: ComboboxFieldControlProps<T, D>) => {
		const { t } = useTranslation()
		const [searchTerm, setSearchTerm] = useState<string>('')

		const {
			form,
			name,
			data,
			labelField,
			valueField,
			label,
			description,
			orientation,
			disabled,
			hidden,
			placeholder = t('ns_common:actions.search') + ' ... ',
			messageType = 'alternative',
			shouldFilter, // Determine using manual filtering or automatic filtering
			loading, // Loading state from server if manual filtering is applied
			template: CommandItemTemplate, // Custom command item template
			onInput,
			onSelect
		} = props

		const id = useId()
		const triggerRef = useRef<typeof Button.prototype>(null)

		return (
			<FormField
				name={name}
				control={form.control}
				render={({ field }) => {
					return (
						<FormItem
							className={cn({
								hidden: hidden,
								'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': orientation === 'horizontal'
							})}>
							<FormLabel htmlFor={id} labelText={label} messageType={messageType} />
							<FormControl>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												id={id}
												ref={triggerRef}
												role='combobox'
												variant='outline'
												disabled={disabled}
												className={cn(
													'w-full justify-between font-normal hover:bg-background',
													!field.value && 'text-muted-foreground',
													form.getFieldState(name).error && 'border-destructive'
												)}>
												<Typography variant='small' className='line-clamp-1'>
													{(() => {
														if (Array.isArray(data) && data.length > 0) {
															return (
																data?.find((option) => option[valueField] === field.value)?.[
																	labelField
																] ?? placeholder
															)
														}
														return placeholder
													})()}
												</Typography>
												<Icon name='ChevronsUpDown' className='ml-auto' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										style={{ padding: 0, width: triggerRef.current?.offsetWidth }}
										align='center'>
										<Command shouldFilter={shouldFilter}>
											<CommandInput
												placeholder={placeholder}
												onValueChange={(value) => {
													if (typeof onInput === 'function') onInput(value)
													setSearchTerm(value)
												}}
											/>
											{loading && <CommandLoading />}
											{!loading && <CommandEmpty>No result</CommandEmpty>}
											<CommandList className='scrollbar'>
												<CommandGroup>
													{Array.isArray(data) &&
														data
															.filter((option) => {
																if (typeof shouldFilter === 'undefined' || shouldFilter === true)
																	return true
																else
																	return (
																		String(option[labelField])
																			.toLowerCase()
																			.includes(searchTerm.toLowerCase()) ||
																		String(option[valueField])
																			.toLowerCase()
																			.includes(searchTerm.toLowerCase())
																	)
															})
															?.map((option) => {
																return (
																	<CommandItem
																		key={option[valueField]}
																		value={option[valueField]}
																		className='line-clamp-1 flex items-center gap-x-4'
																		onSelect={(value) => {
																			form.setValue(name, value as PathValue<T, Path<T>>)
																			form.setValue(name, option[valueField])
																			if (typeof onSelect === 'function')
																				onSelect(option[valueField])
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
																				option[valueField] === field.value
																					? 'opacity-100'
																					: 'opacity-0'
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
							</FormControl>
							{description && <FormDescription>{description}</FormDescription>}
							{messageType === 'standard' && <FormMessage />}
						</FormItem>
					)
				}}
			/>
		)
	}
)
