import { cn } from '@/common/utils/cn';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
	Icon,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollArea,
	Typography
} from '..';
import { BaseFieldControl } from './types/hook-form';
import FormTooltipLabel from './form-tooltip-label';
import { useId } from 'react';

type ComboboxFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & {
	form: UseFormReturn<T>;
	onInput?: (value: string) => unknown;
	onSelect?: (value: string) => unknown;
	options: Array<{
		label: string;
		value: PathValue<T, Path<T>>;
	}>;
};

export function ComboboxFieldControl<T extends FieldValues>(props: ComboboxFieldControlProps<T>) {
	const {
		form,
		name,
		control,
		options,
		label,
		description,
		placeholder,
		layout,
		hidden,
		messageMode = 'tooltip',
		onInput,
		onSelect
	} = props;

	const id = useId();

	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => {
				return (
					<FormItem
						className={cn({
							hidden,
							'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': layout === 'horizontal'
						})}>
						<FormTooltipLabel htmlFor={id} labelText={String(label)} messageMode={messageMode} />
						<FormControl>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant='outline'
											size='sm'
											id={id}
											role='combobox'
											className={cn(
												'w-full justify-between hover:bg-background',
												!field.value && 'text-muted-foreground'
											)}>
											<Typography variant='small' className='line-clamp-1'>
												{field.value
													? options.find((option) => option.value === field.value)?.label
													: placeholder}
											</Typography>
											<Icon name='ChevronsUpDown' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-full p-0' align='start'>
									<Command>
										<CommandInput
											placeholder={placeholder}
											className='h-9'
											onInput={(e) => {
												if (onInput) onInput(e.currentTarget.value);
											}}
										/>
										<CommandEmpty>Không có dữ liệu</CommandEmpty>
										<CommandGroup>
											<ScrollArea className='flex h-56 flex-col items-stretch gap-y-px'>
												{options.map((option) => (
													<CommandItem
														key={option.value}
														value={option.label}
														className='line-clamp-1 flex items-center gap-x-4'
														onSelect={() => {
															form.setValue(name, option.value);
															if (onSelect) onSelect(option.value);
														}}>
														<Typography variant='small' className='flex-1'>
															{option.label}
														</Typography>
														<Icon
															name='Check'
															className={cn(option.value === field.value ? 'opacity-100' : 'opacity-0')}
														/>
													</CommandItem>
												))}
											</ScrollArea>
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
						</FormControl>
						{description && <FormDescription>{description}</FormDescription>}
						{messageMode === 'tooltip' && <FormMessage />}
					</FormItem>
				);
			}}
		/>
	);
}

export default ComboboxFieldControl;
