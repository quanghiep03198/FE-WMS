import {
	Button,
	DatePickerFieldControl,
	Div,
	FieldGroup,
	FormField,
	Icon,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollArea
} from '@components/ui'
import { padStart } from 'lodash-es'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { UpdateDispatchOrderFormValues } from '../schemas'

export const DateTimePickerFieldControl: React.FC<{ name: 'factory_entrance_time' | 'factory_departure_time' }> = ({
	name
}) => {
	const { control, setValue } = useFormContext<UpdateDispatchOrderFormValues>()
	const { t } = useTranslation()

	return (
		<FieldGroup
			aria-orientation='horizontal'
			className='gap-x-3 aria-[orientation=horizontal]:grid aria-[orientation=horizontal]:grid-cols-[2fr_1fr] aria-[orientation=horizontal]:gap-y-3'>
			<Label className='col-span-full'>{t(`ns_erp:fields.${name}`)}</Label>
			<DatePickerFieldControl name={`${name}.date`} />
			<FormField
				control={control}
				name={`${name}.time`}
				render={({ field }) => {
					// console.log
					const [currentHour, currentMinute] = (field.value ?? '').split(':')
					return (
						<Popover modal>
							<PopoverTrigger asChild>
								<Button className='hover:bg-background justify-between font-normal' variant='outline'>
									{field.value ?? '--:--'}
									<Icon name='Clock' stroke='var(--muted-foreground)' />
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-radix-popover grid grid-cols-2 items-stretch divide-x p-2'>
								<Div className='w-full'>
									<Div className='bg-table-head text-table-head-foreground mb-2 flex h-8 items-center justify-center border-b text-sm font-medium uppercase'>
										HH
									</Div>
									<ScrollArea className='relative grid h-56 w-full flex-1 items-stretch px-3'>
										{Array.from({ length: 24 }, (_, hour) => {
											const value = padStart(hour.toString(), 2, '0')
											return (
												<Button
													className='w-full font-normal'
													key={value}
													type='button'
													variant={currentHour === value ? 'default' : 'ghost'}
													onClick={() => {
														const fieldValue = field.value || '00:00'
														const [, minute] = fieldValue.split(':')
														setValue(`${name}.time`, [value, minute].join(':'))
													}}>
													{value}
												</Button>
											)
										})}
									</ScrollArea>
								</Div>
								{/* <Separator className='h-full max-h-full min-h-64 w-px' orientation='vertical' /> */}
								<Div className='w-full'>
									<Div className='bg-table-head text-table-head-foreground mb-2 flex h-8 w-full items-center justify-center border-b text-sm font-medium uppercase'>
										MM
									</Div>
									<ScrollArea className='relative grid h-56 w-full items-stretch px-3'>
										{Array.from({ length: 60 }, (_, minute) => {
											const value = padStart(minute.toString(), 2, '0')
											return (
												<Button
													className='w-full font-normal'
													key={value}
													size='icon'
													type='button'
													variant={currentMinute === value ? 'default' : 'ghost'}
													onClick={() => {
														const fieldValue = field.value || '00:00'
														const [hour] = fieldValue.split(':')
														setValue(`${name}.time`, [hour, value].join(':'))
													}}>
													{value}
												</Button>
											)
										})}
									</ScrollArea>
								</Div>
							</PopoverContent>
						</Popover>
					)
				}}
			/>
		</FieldGroup>
	)
}
