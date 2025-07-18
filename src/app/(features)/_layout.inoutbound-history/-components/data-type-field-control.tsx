import {
	Div,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Icon,
	IconProps,
	RadioGroup,
	RadioGroupItem,
	Typography
} from '@/components/ui'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { RFIDDataType } from '../../_layout.(rfid)/-constants'

const WarehouseDataTypeFieldControl: React.FC = () => {
	const { t } = useTranslation()
	const { setValue } = useFormContext()

	return (
		<Div className='place-content-center place-items-center space-y-4'>
			<Div className='flex items-center gap-x-2'>
				<Icon name='Bot' size={24} />
				<Typewriter text={t('ns_common:others.lookup_question')} className='italic' />
			</Div>
			<FormField
				name='type'
				render={({ field }) => (
					<FormItem>
						<RadioGroup
							className='mx-auto grid max-w-3xl grid-cols-2 items-stretch gap-x-4'
							value={field.value}
							defaultValue={RFIDDataType.INBOUND}
							onValueChange={(value) => {
								field.onChange(value)
								setValue('order', '')
							}}>
							<FormItem>
								<StyledFormLabel
									aria-checked={field.value === RFIDDataType.INBOUND}
									htmlFor={RFIDDataType.INBOUND}>
									<FormControl>
										<RadioGroupItem
											id={RFIDDataType.INBOUND}
											value={RFIDDataType.INBOUND}
											className='hidden'
										/>
									</FormControl>
									<Icon name='Forklift' size={32} strokeWidth={1} className='mr-2' />
									<Div className='space-y-1.5'>
										<Typography> {t('ns_inoutbound:action_types.warehouse_input')}</Typography>
										<Typography
											variant='small'
											className='block w-full max-w-3/4 font-normal text-muted-foreground'>
											{t('ns_inoutbound:description.inbound_history_lookup')}
										</Typography>
									</Div>
									<CheckIcon
										name='Check'
										size={28}
										className='absolute right-4 top-4'
										aria-checked={field.value === RFIDDataType.INBOUND}
									/>
								</StyledFormLabel>
							</FormItem>
							<FormItem>
								<StyledFormLabel
									htmlFor={RFIDDataType.OUTBOUND}
									aria-checked={field.value == RFIDDataType.OUTBOUND}>
									<FormControl>
										<RadioGroupItem
											id={RFIDDataType.OUTBOUND}
											value={RFIDDataType.OUTBOUND}
											className='sr-only'
										/>
									</FormControl>
									<Icon name='Truck' size={32} strokeWidth={1} className='mr-2 scale-x-[-1]' />
									<Div className='space-y-1.5'>
										<Typography>{t('ns_inoutbound:action_types.warehouse_output')}</Typography>
										<Typography
											variant='small'
											className='block w-full max-w-3/4 font-normal text-muted-foreground'>
											{t('ns_inoutbound:description.outbound_history_lookup')}
										</Typography>
									</Div>
									<CheckIcon
										name='Check'
										size={28}
										aria-checked={field.value === RFIDDataType.OUTBOUND}
										className='absolute right-4 top-4'
									/>
								</StyledFormLabel>
							</FormItem>
						</RadioGroup>
					</FormItem>
				)}
			/>
		</Div>
	)
}

const StyledFormLabel = tw(FormLabel)<React.ComponentProps<typeof FormLabel>>`
	h-full relative *:text-pretty cursor-pointer select-none grid items-start grid-cols-[3rem_auto] [&>svg]:place-self-start rounded-[var(--radius)] border px-6 py-4 font-medium transition-colors duration-200 aria-checked:bg-secondary aria-checked:text-secondary-foreground
`
const CheckIcon = tw(Icon)<IconProps>`
	ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200 aria-checked:opacity-100
`

export default WarehouseDataTypeFieldControl
