import { FALLBACK_VALUE } from '@common/constants/constants'
import { cn } from '@common/utils/cn'
import type { IconProps } from '@components/ui'
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
	Input,
	RadioGroup,
	RadioGroupItem,
	SelectFieldControl,
	Tooltip,
	Typography
} from '@components/ui'
import { Alert, AlertClose, AlertContent, AlertDescription, AlertTitle } from '@components/ui/@custom/alert'
import { useGetShapingProductLineQuery } from '@features/department/hooks/use-department-request'
import { FinishedGoodsAction, FinishedGoodsOutboundReason } from '@features/finished-goods/constants/enums'
import { useGetWarehouseQuery } from '@features/warehouse/hooks/use-warehouse-request'
import { useGetWarehouseStorageQuery } from '@features/warehouse/hooks/use-warehouse-storage-request'
import type { IWarehouse, IWarehouseStorage } from '@features/warehouse/types'
import { zodResolver } from '@hookform/resolvers/zod'
import useMediaQuery from '@hooks/use-media-query'
import { useMemoizedFn } from 'ahooks'
import type { AxiosError } from 'axios'
import { HttpStatusCode } from 'axios'
import { omit } from 'lodash-es'
import React, { Fragment, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../../../contexts/finished-goods-inbound/page-context'
import { useGetScanningInboundEpcQuery, useUpdateStockVariationMutation } from '../../../hooks/use-inbound-request'
import type { FormValues, StockVariationPayload } from '../../../schemas/inoutbound.schema'
import { outboundSchema, stockVariationSchema } from '../../../schemas/inoutbound.schema'

const InoutboundForm: React.FC = () => {
	const { selectedDevice, selectedOrder, scanningStatus, setScannedEpc } = usePageContext(
		'selectedDevice',
		'selectedOrder',
		'scanningStatus',
		'setScannedEpc'
	)
	const { t } = useTranslation()
	const [action, setAction] = useState<FinishedGoodsAction>(FinishedGoodsAction.IMPORT)
	const isMobileScreen = useMediaQuery('(min-width: 320px) and (max-width: 1023px)')

	const form = useForm<FormValues>({
		resolver: zodResolver(action === FinishedGoodsAction.IMPORT ? stockVariationSchema : outboundSchema),
		defaultValues: {
			rfid_status: FinishedGoodsAction.IMPORT,
			rfid_use: FinishedGoodsOutboundReason.NORMAL_IMPORT,
			warehouse_num: '',
			storage_num: '',
			storage_name: '',
			dept_code: '',
			dept_name: ''
		},
		mode: 'onChange'
	})

	const warehouseNum = form.watch('warehouse_num')

	const { data: warehouseOptions, isLoading } = useGetWarehouseQuery<IWarehouse[]>({
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})

	const { data: inoutboundDepts } = useGetShapingProductLineQuery()
	const { data: currentEpcData } = useGetScanningInboundEpcQuery()
	const { data: storageAreaOptions } = useGetWarehouseStorageQuery(warehouseNum, {
		enabled: Boolean(warehouseNum),
		select: (response) => response.metadata
	})

	const { mutateAsync, isError, error, reset } = useUpdateStockVariationMutation()

	const handleResetForm = useMemoizedFn(() => {
		form.reset({
			...form.getValues(),
			dept_code: '',
			dept_name: '',
			warehouse_num: '',
			storage_num: '',
			storage_name: ''
		})
	})

	// Reset form when all actions are reset
	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			handleResetForm()
		}
	}, [scanningStatus])

	useEffect(() => {
		form.setValue(
			'rfid_use',
			action === FinishedGoodsAction.IMPORT
				? FinishedGoodsOutboundReason.NORMAL_IMPORT
				: FinishedGoodsOutboundReason.RECYCLE_EXPORT
		)
	}, [action])

	const handleSubmit = async (data: FormValues) => {
		toast.loading(t('ns_common:notification.processing_request'), { id: 'UPDATE_STOCK' })
		try {
			await mutateAsync({
				...omit(data, ['warehouse_num']),
				mo_no: selectedOrder === FALLBACK_VALUE ? null : selectedOrder,
				inbound_device_sn: selectedDevice
			} as StockVariationPayload)
			// * Always select all scanned order after performing update stock
			setScannedEpc(currentEpcData)
			toast.success(t('ns_common:notification.success'), { id: 'UPDATE_STOCK' })
		} catch {
			toast.error(t('ns_common:notification.error'), { id: 'UPDATE_STOCK' })
		}
	}

	return (
		<Fragment>
			{createPortal(
				<Alert data-state={isError && error?.status === HttpStatusCode.BadRequest ? 'open' : 'closed'}>
					<Icon
						name='TriangleAlert'
						size={40}
						strokeWidth={2}
						className='fill-destructive-foreground stroke-destructive'
					/>
					<AlertContent>
						<AlertTitle>{t('ns_common:titles.caution')}</AlertTitle>
						<AlertDescription>
							{(error as AxiosError<ResponseBody<void>>)?.response?.data?.message}
						</AlertDescription>
					</AlertContent>
					<Tooltip
						message={t('ns_common:actions.dismiss')}
						triggerProps={{ asChild: true }}
						contentProps={{ side: 'left' }}>
						<AlertClose onClick={() => reset()}>
							<Icon name='X' />
						</AlertClose>
					</Tooltip>
				</Alert>,
				document.body
			)}
			<Div className='space-y-6'>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit((data) => handleSubmit(data))}>
						<Div className='col-span-full'>
							<FormField
								name='rfid_status'
								render={({ field }) => (
									<FormItem>
										<FormMessage />
										<RadioGroup
											className='grid grid-cols-2'
											value={field.value}
											defaultValue={FinishedGoodsAction.IMPORT}
											onValueChange={(value) => {
												field.onChange(value)
												setAction(value as FinishedGoodsAction)
												handleResetForm()
											}}>
											<FormItem>
												<StyledFormLabel
													role='checkbox'
													tabIndex={0}
													aria-checked={field.value === FinishedGoodsAction.IMPORT}
													htmlFor={FinishedGoodsAction.IMPORT}>
													<FormControl>
														<RadioGroupItem
															id={FinishedGoodsAction.IMPORT}
															value={FinishedGoodsAction.IMPORT}
															className='hidden'
														/>
													</FormControl>
													{t('ns_inoutbound:action_types.warehouse_input')}
													<CheckIcon
														name='Check'
														size={24}
														aria-checked={field.value === FinishedGoodsAction.IMPORT}
													/>
												</StyledFormLabel>
											</FormItem>
											<FormItem>
												<StyledFormLabel
													htmlFor={FinishedGoodsAction.EXPORT}
													role='radio'
													tabIndex={0}
													aria-checked={field.value == FinishedGoodsAction.EXPORT}>
													<FormControl>
														<RadioGroupItem
															id={FinishedGoodsAction.EXPORT}
															value={FinishedGoodsAction.EXPORT}
															className='sr-only'
														/>
													</FormControl>
													{t('ns_inoutbound:action_types.warehouse_output')}
													<CheckIcon
														name='Check'
														size={24}
														aria-checked={field.value === FinishedGoodsAction.EXPORT}
													/>
												</StyledFormLabel>
											</FormItem>
										</RadioGroup>
									</FormItem>
								)}
							/>
						</Div>
						{/* <Div className='col-span-full'>
							<Div className='flex h-9 items-center gap-x-2 rounded border px-3 py-1'>
								<Icon name='Database' size={20} stroke='var(--muted-foreground)' />
								<Input
									readOnly={true}
									placeholder='Database'
									className='h-max w-full border-none bg-background px-0 text-sm text-foreground shadow-none transition-none focus:border-none focus:outline-none'
									value={
										currentWritableTenant && selectedOrder !== DEFAULT_PROPS.selectedOrder
											? t(`ns_warehouse:tenancy_warehouse.${currentWritableTenant?.alias}`, {
													defaultValue: ''
												})
											: ''
									}
								/>
							</Div>
						</Div> */}
						<Div
							className={cn(
								'sm:col-span-full',
								action === FinishedGoodsAction.IMPORT ? 'col-span-1' : 'col-span-full'
							)}>
							<FormField
								name='rfid_use'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('ns_common:common_fields.actions')}</FormLabel>
										<Div className='border-input bg-background aria-disabled:text-muted-foreground flex h-9 w-full items-center rounded-md border px-3 py-1 text-sm shadow-sm'>
											{form.watch('rfid_use') === FinishedGoodsOutboundReason.NORMAL_IMPORT
												? t('ns_inoutbound:inoutbound_actions.normal_import')
												: t('ns_inoutbound:inoutbound_actions.recycle')}
											<Input
												readOnly={true}
												type='hidden'
												placeholder={t('ns_common:actions.select_database')}
												className='text-foreground h-max w-full border-none px-0 shadow-none focus-within:outline-none focus:border-none'
												onChange={field.onChange}
												value={field.value}
											/>
										</Div>
									</FormItem>
								)}
							/>
						</Div>
						{action === FinishedGoodsAction.IMPORT && (
							<Fragment>
								<Div className='col-span-1 sm:col-span-full'>
									<SelectFieldControl
										name='dept_code'
										label={t('ns_erp:fields.shaping_dept_code')}
										datalist={inoutboundDepts}
										labelField='dept_name'
										valueField='dept_code'
										onValueChange={(value) =>
											form.setValue(
												'dept_name',
												inoutboundDepts.find((item) => item.dept_code === value)?.dept_name
											)
										}
									/>
								</Div>
								<Div className='col-span-1 sm:col-span-full'>
									<SelectFieldControl
										disabled={isLoading}
										name='warehouse_num'
										label={t('ns_inoutbound:labels.io_archive_warehouse')}
										datalist={warehouseOptions}
										labelField='warehouse_name'
										valueField='warehouse_num'
									/>
								</Div>
								<Div className='col-span-1 sm:col-span-full'>
									<ComboboxFieldControl
										name='storage_num'
										datalist={storageAreaOptions}
										labelField='storage_name'
										valueField='storage_num'
										shouldFilter={false}
										disabled={warehouseOptions?.length === 0}
										label={t('ns_inoutbound:labels.io_storage_location')}
										template={WarehouseComboboxSelection}
										onSelect={(value) => {
											form.setValue(
												'storage_name',
												storageAreaOptions.find((item) => item.storage_num === value)?.storage_name
											)
										}}
									/>
								</Div>
							</Fragment>
						)}
						<Div className='col-span-full grid grid-cols-2 gap-x-2'>
							<Button
								type='submit'
								size={isMobileScreen ? 'lg' : 'default'}
								className='w-full'
								disabled={selectedOrder === 'all'}>
								<Icon name='Check' /> {t('ns_common:actions.save')}
							</Button>
							<Button
								type='reset'
								variant='outline'
								size={isMobileScreen ? 'lg' : 'default'}
								onClick={handleResetForm}
								className='gap-x-2 sm:w-full md:w-full'>
								<Icon name='Undo' /> {t('ns_common:actions.reset')}
							</Button>
						</Div>
					</Form>
				</FormProvider>
			</Div>
		</Fragment>
	)
}

const WarehouseComboboxSelection: React.FC<{ data: IWarehouseStorage }> = ({ data, ...props }) => (
	<Div className='flex w-full flex-1 flex-col' {...props}>
		<Typography variant='small' className='font-medium'>
			{data.storage_name}
		</Typography>
		<Typography variant='small' color='muted'>
			{data.storage_num}
		</Typography>
	</Div>
)

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6 max-h-full`
const StyledFormLabel = tw(FormLabel)<React.ComponentProps<typeof FormLabel>>`
	flex cursor-pointer select-none items-center rounded-(--radius) border p-6 font-medium transition-colors duration-200 sm:px-4 aria-checked:bg-secondary aria-checked:text-secondary-foreground
`
const CheckIcon = tw(Icon)<IconProps>`
	ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200 aria-checked:opacity-100
`

export default InoutboundForm
