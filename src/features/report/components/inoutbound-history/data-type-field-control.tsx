import { Div } from '@components/customs/div'
import { Typewriter } from '@components/customs/type-writter'
import { Typography } from '@components/customs/typography'
import { FormControl, FormField, FormItem, FormLabel } from '@components/ui/form'
import type { IconProps } from '@components/ui/icon'
import { Icon } from '@components/ui/icon'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { StockFlow } from '@features/finished-goods/constants/enums'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

const WarehouseDataTypeFieldControl: React.FC = () => {
	const { t } = useTranslation()
	const { setValue } = useFormContext()

	return (
		<Div className='place-content-center place-items-center space-y-4'>
			<Div className='flex items-center justify-center'>
				<Icon
					className='animate-in zoom-in-0 slide-in-from-bottom-2 mr-2 duration-500'
					name='BotMessageSquare'
					size={24}
				/>
				&quot;
				<Typewriter className='italic' delay={200} text={t('ns_common:others.lookup_question')} />
				&quot;
			</Div>
			<FormField
				name='type'
				render={({ field }) => (
					<FormItem>
						<RadioGroup
							className='mx-auto grid max-w-3xl grid-cols-2 items-stretch gap-x-4'
							defaultValue={StockFlow.INBOUND}
							value={field.value}
							onValueChange={(value) => {
								field.onChange(value)
								setValue('order', '')
							}}>
							<FormItem>
								<StyledFormLabel aria-checked={field.value === StockFlow.INBOUND} htmlFor={StockFlow.INBOUND}>
									<FormControl>
										<RadioGroupItem className='hidden' id={StockFlow.INBOUND} value={StockFlow.INBOUND} />
									</FormControl>
									<Icon className='mr-2' name='Forklift' size={32} strokeWidth={1} />
									<Div className='space-y-1.5'>
										<Typography> {t('ns_inoutbound:action_types.stock_in')}</Typography>
										<Typography
											className='text-muted-foreground block w-full max-w-3/4 font-normal'
											variant='small'>
											{t('ns_inoutbound:description.inbound_history_lookup')}
										</Typography>
									</Div>
									<CheckIcon
										aria-checked={field.value === StockFlow.INBOUND}
										className='absolute top-4 right-4'
										name='Check'
										size={28}
									/>
								</StyledFormLabel>
							</FormItem>
							<FormItem>
								<StyledFormLabel aria-checked={field.value == StockFlow.OUTBOUND} htmlFor={StockFlow.OUTBOUND}>
									<FormControl>
										<RadioGroupItem className='sr-only' id={StockFlow.OUTBOUND} value={StockFlow.OUTBOUND} />
									</FormControl>
									<Icon className='mr-2 scale-x-[-1]' name='Truck' size={32} strokeWidth={1} />
									<Div className='space-y-1.5'>
										<Typography>{t('ns_inoutbound:action_types.stock_out')}</Typography>
										<Typography
											className='text-muted-foreground block w-full max-w-3/4 font-normal'
											variant='small'>
											{t('ns_inoutbound:description.outbound_history_lookup')}
										</Typography>
									</Div>
									<CheckIcon
										aria-checked={field.value === StockFlow.OUTBOUND}
										className='absolute top-4 right-4'
										name='Check'
										size={28}
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
	h-full relative *:text-pretty cursor-pointer select-none grid items-start grid-cols-[3rem_auto] [&>svg]:place-self-start rounded-(--radius) border px-6 py-4 font-medium transition-colors duration-200 aria-checked:bg-secondary aria-checked:text-secondary-foreground
`
const CheckIcon = tw(Icon)<IconProps>`
	ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200 aria-checked:opacity-100
`

export default WarehouseDataTypeFieldControl
