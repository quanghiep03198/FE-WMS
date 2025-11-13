import { CommonActions } from '@/common/constants/enums'
import {
	Button,
	buttonVariants,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Div,
	Form as FormProvider,
	Icon,
	InputFieldControl
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { UpdateTruckloadDeliveryFormValues, updateTruckloadDeliverySchema } from '../-schemas/truckload-delivery.schema'
import PurchaseOrderAutoComplete from '../../_layout.(rfid)/finished-goods-outbound/-components/outbound-form/purchase-order-autocomplete'

const TruckloadDeliveryFormDialog: React.FC = () => {
	const [open, setOpen] = useState(false)
	const { event$ } = usePageContext()
	const { t } = useTranslation()

	const form = useForm<UpdateTruckloadDeliveryFormValues>({
		resolver: zodResolver(updateTruckloadDeliverySchema)
	})

	event$.useSubscription(({ action, payload }) => {
		if (action !== CommonActions.UPDATE) return
		setOpen(true)
		form.reset(payload)
	})

	return (
		<Dialog
			defaultOpen={false}
			open={open}
			onOpenChange={(open) => {
				setOpen(open)
			}}>
			<DialogContent className='max-w-2xl overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.update_truckload_delivery')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.update_truckload_delivery')}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit((data) => console.log(data))}>
						<FieldSet>
							<Div className='col-span-1 sm:col-span-full md:col-span-1'>
								<InputFieldControl
									label={t('ns_erp:fields.license_plate')}
									name='license_plate'
									placeholder='xxx-xxxxx'
									onChange={(e) => form.setValue('license_plate', e.currentTarget.value.toUpperCase())}
								/>
							</Div>
							<Div className='col-span-1 sm:col-span-full md:col-span-1'>
								<InputFieldControl
									label={t('ns_erp:fields.container_number')}
									name='container_number'
									placeholder='xxxxxx'
								/>
							</Div>
							<Div className='col-span-full'>
								<PurchaseOrderAutoComplete />
							</Div>
							<Div className='col-span-full'>
								<InputFieldControl
									label={t('ns_erp:fields.outbound_qty')}
									name='outbound_qty'
									type='number'
									placeholder='1000'
								/>
							</Div>
						</FieldSet>
						<DialogFooter className='justify-end'>
							<Button>
								<Icon name='Check' />
								{t('ns_common:actions.save_changes')}
							</Button>
							<DialogClose className={buttonVariants({ variant: 'secondary' })}>
								<Icon name='X' />
								{t('ns_common:actions.cancel')}
							</DialogClose>
						</DialogFooter>
					</Form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

export const Form = tw.form`grid gap-4`
export const FieldSet = tw.fieldset`grid grid-cols-2 gap-y-6 gap-x-2`

export default TruckloadDeliveryFormDialog

{
	/* <Div className='col-span-1'>
	<DatePickerFieldControl
		label={t('ns_erp:fields.factory_departure_date')}
		name='factory_departure_time.date'
	/>
</Div>
<Div className='col-span-1'>
	<InputFieldControl
		type='time'
		step={3600}
		min='00:00'
		max='23:59'
		pattern='[0-2][0-9]:[0-5][0-9]'
		label={t('ns_erp:fields.factory_departure_time')}
		name='factory_departure_time.time'
		defaultValue={format(new Date(), 'HH:mm')}
	/>
</Div> */
}
