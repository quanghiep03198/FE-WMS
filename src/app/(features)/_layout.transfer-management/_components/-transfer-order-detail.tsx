import {
	Button,
	Div,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetTransferOrderDetail, useUpdateTransferOrderDetailMutation } from '../_apis/-use-transfer-order-api'
import { UpdateTransferOrderDetailValues, updateTransferOrderDetailSchema } from '../_schemas/transfer-order.schema'
import { usePageStore } from '../_stores/page.store'

const TransferOrderDetail: React.FC = () => {
	const { t } = useTranslation()
	const { currentOrder, sheetPanelFormOpen, toggleSheetPanelFormOpen } = usePageStore()
	const form = useForm<UpdateTransferOrderDetailValues>({
		resolver: zodResolver(updateTransferOrderDetailSchema)
	})

	const { mutateAsync } = useUpdateTransferOrderDetailMutation()

	const { data, isLoading } = useGetTransferOrderDetail()
	const transNum = form.watch('trans_num')
	const snoQty = form.watch('sno_qty')

	console.log(data)

	useEffect(() => {
		form.reset(data)
	}, [currentOrder, data])

	const handleSaveChanges = (data) => {
		mutateAsync({
			transferOrderCode: currentOrder?.transfer_order_code,
			payload: data
		}).then(() => toggleSheetPanelFormOpen())
	}

	return (
		<Sheet open={sheetPanelFormOpen} onOpenChange={toggleSheetPanelFormOpen}>
			<SheetContent side='right' className='max-w-2xl'>
				<SheetHeader>
					<SheetTitle>Transfer order details</SheetTitle>
				</SheetHeader>
				{isLoading ? (
					<Div className='p-10'>
						<Icon name='LoaderCircle' className='animate-spin' />
					</Div>
				) : (
					<FormProvider {...form}>
						<Form onSubmit={form.handleSubmit(handleSaveChanges)}>
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
				)}
			</SheetContent>
		</Sheet>
	)
}

const Form = tw.form`max-w-2xl grid grid-cols-6 sticky left-0 my-6 gap-x-2 gap-y-6`

export default memo(TransferOrderDetail)
