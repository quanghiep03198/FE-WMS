import { cn } from '@/common/utils/cn'
import { CommandGroup, CommandList } from 'cmdk'
import { useId, useRef } from 'react'
import { Field, FieldValue, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'
import {
	Button,
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollArea,
	Typography
} from '..'
import { BaseFieldControl } from '../../../common/types/hook-form'
import FormLabel from './alternative-form-label'
import { useTranslation } from 'react-i18next'

type ComboboxFieldControlProps<T extends FieldValues, D = Record<string, any>> = BaseFieldControl<T> & {
	form: UseFormReturn<T>
	data: Array<D>
	labelField: keyof D
	valueField: keyof D
	triggerProps?: React.ComponentProps<typeof Button>
	disabled?: boolean
	template?: React.FC<{ data: D }>
	onInput?: (value: string) => unknown
	onSelect?: (value: string) => unknown
}

export function ComboboxFieldControl<T extends FieldValues, D extends Record<string, any>>(
	props: ComboboxFieldControlProps<T, D>
) {
	const { t } = useTranslation()

	const {
		form,
		name,
		control,
		data,
		labelField,
		valueField,
		label,
		description,
		orientation,
		triggerProps,
		disabled,
		hidden,
		template: CommandItemTemplate,
		placeholder = t('ns_common:actions.search') + ' ... ',
		messageType = 'alternative',
		onInput,
		onSelect
	} = props

	const id = useId()
	const triggerRef = useRef<typeof Button.prototype>(null)

	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => {
				return (
					<FormItem
						className={cn({
							hidden,
							'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': orientation === 'horizontal'
						})}>
						<FormLabel htmlFor={id} labelText={String(label)} messageType={messageType} />
						<FormControl>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											role='combobox'
											variant='outline'
											id={id}
											ref={triggerRef}
											disabled={disabled}
											{...triggerProps}
											className={cn(
												'w-full justify-between hover:bg-background',
												!field.value && 'text-muted-foreground'
											)}>
											<Typography variant='small' className='line-clamp-1'>
												{data?.find((option) => option[valueField] === field.value)?.[labelField] ??
													field.value ??
													placeholder}
											</Typography>
											<Icon name='ChevronsUpDown' className='ml-auto' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent
									className='w-full p-0'
									style={{ width: triggerRef.current?.offsetWidth }}
									align='start'>
									<Command>
										<CommandInput
											placeholder={placeholder}
											className='h-9'
											onInput={(e) => {
												if (onInput) onInput(e.currentTarget.value)
											}}
										/>
										<CommandEmpty>Không có dữ liệu</CommandEmpty>
										<CommandList>
											<CommandGroup>
												<ScrollArea className='h-56' onWheel={(e) => e.stopPropagation()}>
													{Array.isArray(data) &&
														data.map((option) => (
															<CommandItem
																key={option[valueField]}
																value={option[valueField]}
																className='line-clamp-1 flex items-center gap-x-4'
																onSelect={() => {
																	form.setValue(name, option[valueField])
																	if (onSelect && typeof onSelect === 'function')
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
																		option[valueField] === field.value ? 'opacity-100' : 'opacity-0'
																	)}
																/>
															</CommandItem>
														))}
												</ScrollArea>
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</FormControl>
						{description && <FormDescription>{description}</FormDescription>}
						{messageType === 'alternative' && <FormMessage />}
					</FormItem>
				)
			}}
		/>
	)
}

export default ComboboxFieldControl
