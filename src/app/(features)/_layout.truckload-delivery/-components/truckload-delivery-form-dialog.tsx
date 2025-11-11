import { CommonActions } from '@/common/constants/enums'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import { DatePickerFieldControl, Div, Form as FormProvider, InputFieldControl } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { createTruckloadDeliverySchema, updateTruckloadDeliverySchema } from '../-schemas/truckload-delivery.schema'
import PurchaseOrderAutoComplete from '../../_layout.(rfid)/finished-goods-outbound/-components/outbound-form/purchase-order-autocomplete'

const TruckloadDeliveryForm: React.FC = () => {
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
		setAction(action)
		if (action === CommonActions.UPDATE) form.reset(defaultValues)
		else form.reset()
	})

	return (
		<FormProvider {...form}>
			<Form>
				<Div className='col-span-1 self-end'>
					<DatePickerFieldControl
						label={t('ns_erp:fields.factory_departure_date')}
						name='factory_departure_time.date'
					/>
				</Div>
				<Div className='col-span-1 self-end'>
					<InputFieldControl
						type='time'
						label={t('ns_erp:fields.factory_departure_time')}
						name='factory_departure_time.time'
						step={1}
						defaultValue={format(new Date(), 'HH:mm')}
					/>
				</Div>
				<Div className='col-span-1'>
					<InputFieldControl
						label={t('ns_erp:fields.license_plate')}
						name='license_plate'
						placeholder='xxx-xxxxx'
					/>
				</Div>
				<Div className='col-span-1'>
					<InputFieldControl
						label={t('ns_erp:fields.sno_container')}
						name='container_number'
						placeholder='xxxxxx'
					/>
				</Div>
				<Div className='col-span-1'>
					<PurchaseOrderAutoComplete />
				</Div>
				<Div className='col-span-1'>
					<InputFieldControl
						label={t('ns_erp:fields.outbound_qty')}
						name='outbound_qty'
						type='number'
						placeholder='1000'
					/>
				</Div>
			</Form>
		</FormProvider>
	)
}

export const Form = tw.form`grid grid-cols-2 gap-y-6 gap-x-2 max-w-lg`

export default TruckloadDeliveryForm
