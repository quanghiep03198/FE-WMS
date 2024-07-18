import { CommonActions } from '@/common/constants/enums'
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
import _ from 'lodash'
import { Fragment, memo, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetWarehouseStorageQuery } from '../../_composables/-warehouse-storage.composable'
import { useGetWarehouseQuery } from '../../_composables/-warehouse.composable'
import { useStoreEpcMutation } from '../_composables/-use-rfid-api'
import { usePageStore } from '../_contexts/-page.context'
import { FormActionEnum, InoutboundFormValues, inOutBoundSchema } from '../_schemas/-epc-inoutbound.schema'
// import { usePageStore } from '../_stores/-page.store'

const InoutboundForm: React.FC = () => {
	const {
		scannedEPCs,
		scanningStatus,
		connection,
		scannedOrders,
		selectedOrder,
		setScanningStatus,
		setSelectedOrder,
		setScannedEPCs,
		setScannedOrders
	} = usePageStore()
	const { t, i18n } = useTranslation()
	const form = useForm<InoutboundFormValues>({
		resolver: zodResolver(inOutBoundSchema),
		defaultValues: { rfid_status: FormActionEnum.IMPORT }
	})
	const warehouseNum = form.watch('warehouse_num')
	const inoutboundType = form.watch('rfid_status')

	const storageTypes = useMemo(
		() => [
			{ label: t('ns_inoutbound:inoutbound_actions.normal_import'), type: FormActionEnum.IMPORT, value: 'A' },
			{ label: t('ns_inoutbound:inoutbound_actions.normal_export'), type: FormActionEnum.EXPORT, value: 'B' },
			{ label: t('ns_inoutbound:inoutbound_actions.scrap'), type: FormActionEnum.EXPORT, value: 'C' },
			{ label: t('ns_inoutbound:inoutbound_actions.transfer_inbound'), type: FormActionEnum.IMPORT, value: 'D' },
			{ label: t('ns_inoutbound:inoutbound_actions.transfer_outbound'), type: FormActionEnum.EXPORT, value: 'E' }, //
			{ label: t('ns_inoutbound:inoutbound_actions.recycling'), type: FormActionEnum.EXPORT, value: 'F' }
		],
		[i18n.language]
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

	const epc_code = useMemo(
		() =>
			Array.isArray(scannedEPCs) && scannedEPCs.length > 0
				? [...new Set(scannedEPCs.map((item) => item.epc_code))]
				: [],
		[scannedEPCs]
	)

	const { mutateAsync } = useStoreEpcMutation({
		onSuccess: () => {
			const filteredOrders = scannedOrders.filter((item) => item.orderCode !== selectedOrder)
			setScannedOrders(filteredOrders)
			setScannedEPCs((prev) => prev.filter((item) => filteredOrders.some((order) => order.orderCode === item.mo_no)))
			setSelectedOrder(scannedOrders[0]?.orderCode ?? null)
		}
	})

	return (
		<FormProvider {...form}>
			<Form
				onSubmit={form.handleSubmit(
					async (data) =>
						await mutateAsync({
							..._.omit(data, ['warehouse_num']),
							epc_code,
							host: connection
						})
				)}>
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
									onValueChange={(value: CommonActions) => field.onChange(value)}>
									<FormItem>
										<FormLabel
											htmlFor={FormActionEnum.IMPORT}
											className={cn(
												'flex cursor-pointer select-none items-center rounded-[var(--radius)] border p-6 font-medium transition-colors duration-200 sm:px-4',
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
												name='CircleCheckBig'
												size={20}
												className={cn(
													'ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200',
													field.value === FormActionEnum.IMPORT && 'scale-100 opacity-100'
												)}
											/>
										</FormLabel>
									</FormItem>
									<FormItem>
										<FormLabel
											htmlFor='2'
											className={cn(
												'flex cursor-pointer select-none items-center rounded-[var(--radius)] border p-6 font-medium transition-all duration-200 sm:px-4',
												field.value == FormActionEnum.EXPORT && 'bg-secondary text-secondary-foreground'
											)}>
											<FormControl>
												<RadioGroupItem id='2' value={FormActionEnum.EXPORT} className='sr-only' />
											</FormControl>
											{t('ns_inoutbound:action_types.warehouse_output')}
											<Icon
												name='CircleCheckBig'
												size={20}
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
						options={storageTypes.filter((item) => item.type === inoutboundType)}
					/>
				</Div>

				{inoutboundType === FormActionEnum.IMPORT && (
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

export default memo(InoutboundForm)
