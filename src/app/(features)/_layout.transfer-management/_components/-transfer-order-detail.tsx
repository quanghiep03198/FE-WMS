import {
	Button,
	Div,
	Form as FormProvider,
	InputFieldControl,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useUpdateTransferOrderDetailMutation } from '../_composables/-use-transfer-order-api'
import { UpdateTransferOrderDetailValues, updateTransferOrderDetailSchema } from '../_schemas/-transfer-order.schema'
import { usePageStore } from '../_stores/-page-store'

const TransferOrderDetail: React.FC = () => {
	const { t } = useTranslation()
	const { currentOrder, sheetPanelFormOpen, toggleSheetPanelFormOpen } = usePageStore()
	const form = useForm<UpdateTransferOrderDetailValues>({
		resolver: zodResolver(updateTransferOrderDetailSchema),
		defaultValues: {
			or_no: currentOrder?.or_no,
			trans_num: 0,
			sno_qty: 0,
			or_qtyperpacking: 0
		}
	})

	const { mutateAsync } = useUpdateTransferOrderDetailMutation()

	const transNum = form.watch('trans_num')
	const snoQty = form.watch('sno_qty')

	useEffect(() => {
		form.setValue('or_no', currentOrder?.or_no)
	}, [currentOrder])

	return (
		<Sheet open={sheetPanelFormOpen} onOpenChange={toggleSheetPanelFormOpen}>
			<SheetContent side='right' className='max-w-2xl'>
				<SheetHeader>
					<SheetTitle>Transfer order details</SheetTitle>
				</SheetHeader>
				<FormProvider {...form}>
					<Form
						onSubmit={form.handleSubmit((data) => {
							mutateAsync({
								transferOrderCode: currentOrder.transfer_order_code,
								payload: data
							})
						})}>
						<Div className='col-span-full'>
							<InputFieldControl
								label={t('ns_inoutbound:fields.or_no')}
								name='or_no'
								type='text'
								control={form.control}
							/>
						</Div>
						<Div className='col-span-2 sm:col-span-full'>
							<InputFieldControl
								label={t('ns_inoutbound:fields.trans_num')}
								name='trans_num'
								type='number'
								control={form.control}
							/>
						</Div>
						<Div className='col-span-2 sm:col-span-full'>
							<InputFieldControl
								label={t('ns_inoutbound:fields.sno_qty')}
								name='sno_qty'
								type='number'
								control={form.control}
							/>
						</Div>
						<Div className='col-span-2 sm:col-span-full'>
							<InputFieldControl
								label={t('ns_inoutbound:fields.or_qtyperpacking')}
								name='or_qtyperpacking'
								value={transNum * snoQty}
								type='number'
								control={form.control}
							/>
						</Div>
						<Div className='col-span-3 sm:col-span-full'>
							<InputFieldControl
								label={t('ns_inoutbound:fields.kg_nostart')}
								name='kg_nostart'
								type='number'
								control={form.control}
							/>
						</Div>
						<Div className='col-span-3 sm:col-span-full'>
							<InputFieldControl
								label={t('ns_inoutbound:fields.kg_noend')}
								name='kg_noend'
								type='number'
								control={form.control}
							/>
						</Div>
						<Div className='col-span-full'>
							<Button>{t('ns_common:actions.save_changes')}</Button>
						</Div>
					</Form>
				</FormProvider>
			</SheetContent>
		</Sheet>
	)
}

const Form = tw.form`max-w-2xl grid grid-cols-6 sticky left-0 my-6 gap-x-2 gap-y-6`

export default TransferOrderDetail
