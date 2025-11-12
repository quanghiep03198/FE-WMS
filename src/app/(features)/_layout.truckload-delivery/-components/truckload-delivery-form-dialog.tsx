import { CommonActions } from '@/common/constants/enums'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import {
	DatePickerFieldControl,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Div,
	Form as FormProvider,
	InputFieldControl
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { createTruckloadDeliverySchema, updateTruckloadDeliverySchema } from '../-schemas/truckload-delivery.schema'
import PurchaseOrderAutoComplete from '../../_layout.(rfid)/finished-goods-outbound/-components/outbound-form/purchase-order-autocomplete'

const TruckloadDeliveryFormDialog: React.FC = () => {
	const [open, setOpen] = useState(false)
	const [action, setAction, resetAction] = useResetState<CommonActions.CREATE | CommonActions.UPDATE>(null)
	const { event$ } = usePageContext()
	const locale = useDateLocale()
	const { t } = useTranslation()

	const form = useForm({
		resolver: zodResolver(
			action === CommonActions.CREATE ? createTruckloadDeliverySchema : updateTruckloadDeliverySchema
		),
		defaultValues: {
			factory_departure_time: { date: new Date(), time: format(new Date(), 'HH:mm', { locale }) }
		}
	})

	event$.useSubscription(({ action, defaultValues }) => {
		setOpen(true)
		setAction(action)
		if (action === CommonActions.UPDATE) form.reset(defaultValues)
		else form.reset()
	})

	return (
		<Dialog
			defaultOpen={false}
			open={open}
			onOpenChange={(open) => {
				setOpen(open)
				if (!open) resetAction()
			}}>
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle></DialogTitle>
				</DialogHeader>

				<FormProvider {...form}>
					<Form>
						<Div className='col-span-1'>
							<DatePickerFieldControl
								label={t('ns_erp:fields.factory_departure_date')}
								name='factory_departure_time.date'
							/>
						</Div>
						<Div className='col-span-1'>
							<InputFieldControl
								type='time'
								label={t('ns_erp:fields.factory_departure_time')}
								name='factory_departure_time.time'
								step={1}
								defaultValue={format(new Date(), 'HH:mm')}
							/>
						</Div>
						<Div className='col-span-1 sm:col-span-full md:col-span-full'>
							<InputFieldControl
								label={t('ns_erp:fields.license_plate')}
								name='license_plate'
								placeholder='xxx-xxxxx'
							/>
						</Div>
						<Div className='col-span-1 sm:col-span-full md:col-span-full'>
							<InputFieldControl
								label={t('ns_erp:fields.container_number')}
								name='container_number'
								placeholder='xxxxxx'
							/>
						</Div>
						<Div className='col-span-1 sm:col-span-full md:col-span-full'>
							<PurchaseOrderAutoComplete />
						</Div>
						<Div className='col-span-1 sm:col-span-full md:col-span-full'>
							<InputFieldControl
								label={t('ns_erp:fields.outbound_qty')}
								name='outbound_qty'
								type='number'
								placeholder='1000'
							/>
						</Div>
					</Form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

export const Form = tw.form`grid grid-cols-2 gap-y-6 gap-x-2`

export default TruckloadDeliveryFormDialog
