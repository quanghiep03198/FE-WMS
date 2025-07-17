import {
	Div,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Icon,
	IconProps,
	Label,
	RadioGroup,
	RadioGroupItem,
	Typography
} from '@/components/ui'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { RFIDDataType } from '../../_layout.(rfid)/-constants'

const WarehouseDataTypeFieldControl: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Fragment>
			<Div className='mt-6 flex w-full items-center gap-x-4 overflow-hidden'>
				<hr className='basis-1/3' />
				<Label className='flex bg-background text-center text-base'>What are you looking for ?</Label>
				<hr className='basis-1/3' />
			</Div>
			<FormField
				name='dataType'
				render={({ field }) => (
					<FormItem>
						<RadioGroup
							className='mx-auto grid max-w-3xl grid-cols-2 items-stretch'
							value={field.value}
							defaultValue={RFIDDataType.INBOUND}
							onValueChange={(value) => {
								field.onChange(value)
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
											Kiểm tra tiến độ nhập hàng, trạng thái chỉ lệnh và số lượng nhập chi tiết.
										</Typography>
									</Div>

									<CheckIcon
										name='Check'
										size={24}
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
											Kiểm tra tiến độ xuất hàng, thông tin đơn hàng và chi tiết số lượng đã xuất.
										</Typography>
									</Div>
									<CheckIcon
										name='Check'
										size={24}
										aria-checked={field.value === RFIDDataType.OUTBOUND}
										className='absolute right-4 top-4'
									/>
								</StyledFormLabel>
							</FormItem>
						</RadioGroup>
					</FormItem>
				)}
			/>
		</Fragment>
	)
}

const StyledFormLabel = tw(FormLabel)<React.ComponentProps<typeof FormLabel>>`
	h-full relative *:text-pretty cursor-pointer select-none grid items-start grid-cols-[3rem_auto] [&>svg]:place-self-start rounded-[var(--radius)] border px-6 py-4 font-medium transition-colors duration-200 aria-checked:bg-secondary aria-checked:text-secondary-foreground
`
const CheckIcon = tw(Icon)<IconProps>`
	ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200 aria-checked:opacity-100
`

export default WarehouseDataTypeFieldControl
