import { cn } from '@/common/utils/cn'
import {
	Button,
	ComboboxFieldControl,
	Div,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormProvider,
	Icon,
	RadioGroup,
	RadioGroupItem,
	SelectFieldControl,
	Typography
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { omit } from 'lodash'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useGetWarehouseQuery } from '../../_layout.warehouse/_composables/-use-warehouse-api'
import { useGetWarehouseStorageQuery } from '../../_layout.warehouse/_composables/-use-warehouse-storage-api'
import { RFID_EPC_PROVIDE_TAG, useStoreEpcMutation } from '../_composables/-use-rfid-api'
import { usePageStore } from '../_contexts/-page.context'
import { FormActionEnum, InboundFormValues, inboundSchema, outboundSchema } from '../_schemas/-epc-inoutbound.schema'

const InoutboundForm: React.FC = () => {
	const [schema, setSchema] = useState<typeof inboundSchema | typeof outboundSchema>(inboundSchema)
	const {
		scanningStatus,
		connection,
		scannedOrders,
		selectedOrder,
		resetScanningStatus,
		setSelectedOrder,
		resetScannedOrders
	} = usePageStore()
	const { t, i18n } = useTranslation()
	const form = useForm<InboundFormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			rfid_status: FormActionEnum.IMPORT,
			rfid_use: undefined,
			warehouse_num: undefined,
			storage: undefined
		},
		mode: 'onChange'
	})
	const queryClient = useQueryClient()
	const warehouseNum = form.watch('warehouse_num')
	const action = form.watch('rfid_status')

	const storageTypes = useMemo(
		() =>
			[
				{ label: t('ns_inoutbound:inoutbound_actions.normal_import'), type: FormActionEnum.IMPORT, value: 'A' },
				{ label: t('ns_inoutbound:inoutbound_actions.normal_export'), type: FormActionEnum.EXPORT, value: 'B' },
				{ label: t('ns_inoutbound:inoutbound_actions.scrap'), type: FormActionEnum.EXPORT, value: 'C' },
				{ label: t('ns_inoutbound:inoutbound_actions.transfer_inbound'), type: FormActionEnum.IMPORT, value: 'D' },
				{ label: t('ns_inoutbound:inoutbound_actions.transfer_outbound'), type: FormActionEnum.EXPORT, value: 'E' }, //
				{ label: t('ns_inoutbound:inoutbound_actions.recycling'), type: FormActionEnum.EXPORT, value: 'F' }
			].filter((item) => item.type === action),
		[i18n.language, action]
	)

	const { data: warehouseOptions, isLoading } = useGetWarehouseQuery<Record<'label' | 'value', string>[]>({
		select: (response) =>
			Array.isArray(response.metadata)
				? response.metadata.map((item) => ({
						label: item.warehouse_name,
						value: item.warehouse_num
					}))
				: []
	})

	const { data: storageAreaOptions } = useGetWarehouseStorageQuery(warehouseNum, {
		enabled: Boolean(warehouseNum),
		select: (response) => response.metadata
	})

	const { mutateAsync } = useStoreEpcMutation()

	useEffect(() => {
		setSchema(action === FormActionEnum.IMPORT ? inboundSchema : outboundSchema)
		form.reset({ ...form.getValues(), rfid_use: undefined, warehouse_num: undefined, storage: undefined })
	}, [action, storageTypes])

	useEffect(() => {
		if (typeof scanningStatus === 'undefined')
			form.reset({ ...form.getValues(), rfid_use: undefined, warehouse_num: undefined, storage: undefined })
	}, [scanningStatus])

	const handleSubmit = async (data: InboundFormValues): Promise<string | number> => {
		const loading = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync({
				...omit(data, ['warehouse_num']),
				mo_no: selectedOrder,
				host: connection
			})
			const filteredOrders = scannedOrders.filter((item) => item.orderCode !== selectedOrder)
			if (filteredOrders.length > 0) {
				setSelectedOrder(filteredOrders[0]?.orderCode)
				resetScannedOrders(filteredOrders)
			} else {
				resetScanningStatus()
				form.reset()
			}
			queryClient.invalidateQueries({ queryKey: [RFID_EPC_PROVIDE_TAG] })
			return toast.success(t('ns_common:notification.success'), { id: loading })
		} catch (error) {
			return toast.error(t('ns_common:notification.error'), { id: loading })
		}
	}

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(handleSubmit)}>
				<Div className='col-span-full'>
					<FormField
						name='rfid_status'
						render={({ field }) => (
							<FormItem>
								<FormMessage />
								<RadioGroup
									className='grid grid-cols-2'
									value={field.value}
									defaultValue={FormActionEnum.IMPORT}
									onValueChange={(value) => {
										field.onChange(value)
									}}>
									<FormItem>
										<FormLabel
											htmlFor={FormActionEnum.IMPORT}
											className={cn(
												'flex cursor-pointer select-none items-center rounded-[var(--radius)] border px-6 py-5 font-medium transition-colors duration-200 sm:px-4',
												field.value === FormActionEnum.IMPORT && 'bg-secondary text-secondary-foreground'
											)}>
											<FormControl>
												<RadioGroupItem
													id={FormActionEnum.IMPORT}
													value={FormActionEnum.IMPORT}
													className='hidden'
												/>
											</FormControl>
											{t('ns_inoutbound:action_types.warehouse_input')}
											<Icon
												name='Check'
												size={16}
												className={cn(
													'ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200',
													field.value === FormActionEnum.IMPORT && 'scale-100 opacity-100'
												)}
											/>
										</FormLabel>
									</FormItem>
									<FormItem>
										<FormLabel
											htmlFor={FormActionEnum.EXPORT}
											className={cn(
												'flex cursor-pointer select-none items-center rounded-[var(--radius)] border px-6 py-5 font-medium transition-all duration-200 sm:px-4',
												field.value == FormActionEnum.EXPORT && 'bg-secondary text-secondary-foreground'
											)}>
											<FormControl>
												<RadioGroupItem
													id={FormActionEnum.EXPORT}
													value={FormActionEnum.EXPORT}
													className='sr-only'
												/>
											</FormControl>
											{t('ns_inoutbound:action_types.warehouse_output')}
											<Icon
												name='Check'
												size={16}
												className={cn(
													'ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200',
													field.value === FormActionEnum.EXPORT && 'scale-100 opacity-100'
												)}
											/>
										</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormItem>
						)}
					/>
				</Div>

				<Div className='col-span-full'>
					<SelectFieldControl
						control={form.control}
						name='rfid_use'
						label={t('ns_common:common_fields.actions')}
						options={storageTypes}
					/>
				</Div>
				{action === FormActionEnum.IMPORT && (
					<Fragment>
						<Div className='col-span-1 sm:col-span-full'>
							<SelectFieldControl
								disabled={isLoading}
								control={form.control}
								name='warehouse_num'
								label={t('ns_inoutbound:labels.io_archive_warehouse')}
								options={warehouseOptions}
							/>
						</Div>
						<Div className='col-span-1 sm:col-span-full'>
							<ComboboxFieldControl
								shouldFilter={false}
								disabled={warehouseOptions?.length === 0}
								form={form}
								name='storage'
								labelField='storage_name'
								valueField='storage_num'
								label={t('ns_inoutbound:labels.io_storage_location')}
								template={({ data }) => (
									<Div className='space-y-0.5'>
										<Typography variant='small' className='font-medium'>
											{data.storage_name}
										</Typography>
										<Typography variant='small' color='muted'>
											{data.storage_num}
										</Typography>
									</Div>
								)}
								data={storageAreaOptions}
							/>
						</Div>
					</Fragment>
				)}
				<Div className='col-span-full'>
					<Button
						type='submit'
						className='gap-x-2 sm:w-full'
						disabled={scanningStatus !== 'finished' || selectedOrder === 'all'}>
						<Icon name='Check' /> {t('ns_common:actions.save')}
					</Button>
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`

export default InoutboundForm
