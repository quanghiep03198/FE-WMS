import { IWarehouse } from '@/common/types/entities'
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
	IconProps,
	RadioGroup,
	RadioGroupItem,
	SelectFieldControl,
	Typography
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useMemoizedFn } from 'ahooks'
import { omit } from 'lodash'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useGetWarehouseStorageQuery } from '../../_layout.warehouse/_apis/warehouse-storage.api'
import { useGetWarehouseQuery } from '../../_layout.warehouse/_apis/warehouse.api'
import { RFID_EPC_PROVIDE_TAG, UNKNOWN_ORDER, useGetInoutboundDept, useStoreEpcMutation } from '../_apis/rfid.api'
import { usePageContext } from '../_contexts/-page-context'
import { FormActionEnum, InboundFormValues, inboundSchema, outboundSchema } from '../_schemas/epc-inoutbound.schema'

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
	} = usePageContext()
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

	const { data: warehouseOptions, isLoading } = useGetWarehouseQuery<IWarehouse[]>({
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})

	const { data: inoutboundDepts } = useGetInoutboundDept()

	const { data: storageAreaOptions } = useGetWarehouseStorageQuery(warehouseNum, {
		enabled: Boolean(warehouseNum),
		select: (response) => response.metadata
	})

	const { mutateAsync } = useStoreEpcMutation()

	const handleResetForm = useMemoizedFn(() => {
		form.reset({
			...form.getValues(),
			rfid_use: '',
			dept_code: '',
			warehouse_num: '',
			storage: ''
		})
	})

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') handleResetForm()
		setSchema(action === FormActionEnum.IMPORT ? inboundSchema : outboundSchema)
	}, [action, storageTypes, scanningStatus])

	const handleSubmit = async (data: InboundFormValues): Promise<string | number> => {
		const loading = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync({
				...omit(data, ['warehouse_num']),
				mo_no: selectedOrder === UNKNOWN_ORDER ? null : selectedOrder,
				host: connection
			})
			const filteredOrders = scannedOrders.filter((item) => item.mo_no !== selectedOrder)
			if (filteredOrders.length > 0) {
				setSelectedOrder(filteredOrders[0]?.mo_no)
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
										handleResetForm()
									}}>
									<FormItem>
										<StyledFormLabel
											aria-checked={field.value === FormActionEnum.IMPORT}
											htmlFor={FormActionEnum.IMPORT}>
											<FormControl>
												<RadioGroupItem
													id={FormActionEnum.IMPORT}
													value={FormActionEnum.IMPORT}
													className='hidden'
												/>
											</FormControl>
											{t('ns_inoutbound:action_types.warehouse_input')}
											<CheckIcon
												name='Check'
												size={16}
												aria-checked={field.value === FormActionEnum.IMPORT}
											/>
										</StyledFormLabel>
									</FormItem>
									<FormItem>
										<StyledFormLabel
											htmlFor={FormActionEnum.EXPORT}
											aria-checked={field.value == FormActionEnum.EXPORT}>
											<FormControl>
												<RadioGroupItem
													id={FormActionEnum.EXPORT}
													value={FormActionEnum.EXPORT}
													className='sr-only'
												/>
											</FormControl>
											{t('ns_inoutbound:action_types.warehouse_output')}
											<CheckIcon
												name='Check'
												size={16}
												aria-checked={field.value === FormActionEnum.EXPORT}
											/>
										</StyledFormLabel>
									</FormItem>
								</RadioGroup>
							</FormItem>
						)}
					/>
				</Div>
				<Div className={cn('sm:col-span-full', action === FormActionEnum.IMPORT ? 'col-span-1' : 'col-span-full')}>
					<SelectFieldControl
						control={form.control}
						name='rfid_use'
						label={t('ns_common:common_fields.actions')}
						datalist={storageTypes}
						labelField='label'
						valueField='value'
					/>
				</Div>
				{action === FormActionEnum.IMPORT && (
					<Fragment>
						<Div className='col-span-1 sm:col-span-full'>
							<SelectFieldControl
								control={form.control}
								name='dept_code'
								label={t('ns_company:department')}
								datalist={inoutboundDepts}
								labelField='dept_name'
								valueField='dept_code'
							/>
						</Div>
						<Div className='col-span-1 sm:col-span-full'>
							<SelectFieldControl
								disabled={isLoading}
								control={form.control}
								name='warehouse_num'
								label={t('ns_inoutbound:labels.io_archive_warehouse')}
								datalist={warehouseOptions}
								labelField='warehouse_name'
								valueField='warehouse_num'
							/>
						</Div>
						<Div className='col-span-1 sm:col-span-full'>
							<ComboboxFieldControl
								name='storage'
								datalist={storageAreaOptions}
								labelField='storage_name'
								valueField='storage_num'
								form={form}
								shouldFilter={false}
								disabled={warehouseOptions?.length === 0}
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
const StyledFormLabel = tw(FormLabel)<React.ComponentProps<typeof FormLabel>>`
	flex cursor-pointer select-none items-center rounded-[var(--radius)] border p-6 font-medium transition-colors duration-200 sm:px-4 aria-checked:bg-secondary aria-checked:text-secondary-foreground
`
const CheckIcon = tw(Icon)<IconProps>`
	ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200 aria-checked:opacity-100
`

export default InoutboundForm
