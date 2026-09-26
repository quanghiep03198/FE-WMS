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
	Tooltip
} from '@components/ui'
import { Alert, AlertClose, AlertContent, AlertDescription, AlertTitle } from '@components/ui/@custom/alert'
import { useGetShapingProductLineQuery } from '@features/department/hooks/use-department-request'
import { FinishedGoodsStockAction, StockTransactionPurpose } from '@features/finished-goods/constants/enums'
import { useGetWarehouseQuery } from '@features/warehouse/hooks/use-warehouse-request'
import { useGetStorageLocationByWarehouseQuery } from '@features/warehouse/hooks/use-warehouse-storage-request'
import { zodResolver } from '@hookform/resolvers/zod'
import useMediaQuery from '@hooks/use-media-query'
import { useMemoizedFn } from 'ahooks'
import type { AxiosError } from 'axios'
import { HttpStatusCode } from 'axios'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../../../contexts/finished-goods-inbound/page-context'
import { useGetScanningInboundEpcQuery, useUpdateStockVariationMutation } from '../../../hooks/use-inbound-request'
import type { FormValues, StockBalancesPayload } from '../../../schemas/inoutbound.schema'
import { outboundSchema, stockBalancesSchema } from '../../../schemas/inoutbound.schema'

const InoutboundForm: React.FC = () => {
	const { selectedDevice, selectedOrder, scanningStatus, setScannedEpc } = usePageContext(
		'selectedDevice',
		'selectedOrder',
		'scanningStatus',
		'setScannedEpc'
	)
	const { t, i18n } = useTranslation()
	const [action, setAction] = useState<FinishedGoodsStockAction>(FinishedGoodsStockAction.IMPORT)
	const isMobileScreen = useMediaQuery('(min-width: 320px) and (max-width: 1023px)')

	const form = useForm<FormValues>({
		resolver: zodResolver(action === FinishedGoodsStockAction.IMPORT ? stockBalancesSchema : outboundSchema),
		defaultValues: {
			action: FinishedGoodsStockAction.IMPORT,
			purpose: StockTransactionPurpose.NORMAL_IMPORT,
			warehouse: '',
			storage_location: '',
			assembly_line: { code: '', name: '' }
		},
		mode: 'onChange'
	})

	const warehouseName = form.watch('warehouse')

	const { data: warehouseOptions, isLoading } = useGetWarehouseQuery()

	const { data: assemblyLines } = useGetShapingProductLineQuery()
	const { data: currentEpcData } = useGetScanningInboundEpcQuery()
	const { data: storageLocations } = useGetStorageLocationByWarehouseQuery(warehouseName)

	const translatedAssemblyLines = useMemo(() => {
		if (!Array.isArray(assemblyLines)) return []
		return assemblyLines.map((item) => ({
			code: item.code,
			name: t('ns_company:assembly_line', {
				name: item.name.replace(/[^A-Za-z0-9]/g, ''),
				defaultValue: item.name
			})
		}))
	}, [assemblyLines, i18n.language])

	const { mutateAsync, isPending, isError, error, reset } = useUpdateStockVariationMutation()

	const handleResetForm = useMemoizedFn(() => {
		form.reset({
			...form.getValues(),
			assembly_line: { code: '', name: '' },
			warehouse: '',
			storage_location: ''
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
			'purpose',
			action === FinishedGoodsStockAction.IMPORT
				? StockTransactionPurpose.NORMAL_IMPORT
				: StockTransactionPurpose.RECYCLE_EXPORT
		)
	}, [action])

	const handleSubmit = async (data: FormValues) => {
		console.log(data)
		try {
			await mutateAsync({
				...data,
				mo_no: selectedOrder === FALLBACK_VALUE ? null : selectedOrder,
				inbound_device_sn: selectedDevice
			} as StockBalancesPayload)
			// * Always select all scanned order after performing update stock
			setScannedEpc(currentEpcData!)
			toast.success(t('ns_common:notification.success'))
		} catch {
			toast.error(t('ns_common:notification.error'))
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
					<Form onSubmit={form.handleSubmit(handleSubmit)}>
						<Div className='col-span-full'>
							<FormField
								name='action'
								render={({ field }) => (
									<FormItem>
										<FormMessage />
										<RadioGroup
											className='grid grid-cols-2'
											value={field.value}
											defaultValue={FinishedGoodsStockAction.IMPORT}
											onValueChange={(value) => {
												field.onChange(value)
												setAction(value as FinishedGoodsStockAction)
												handleResetForm()
											}}>
											<FormItem>
												<StyledFormLabel
													role='checkbox'
													tabIndex={0}
													aria-checked={field.value === FinishedGoodsStockAction.IMPORT}
													htmlFor={FinishedGoodsStockAction.IMPORT}>
													<FormControl>
														<RadioGroupItem
															id={FinishedGoodsStockAction.IMPORT}
															value={FinishedGoodsStockAction.IMPORT}
															className='hidden'
														/>
													</FormControl>
													{t('ns_inoutbound:action_types.stock_in')}
													<CheckIcon
														name='Check'
														size={24}
														aria-checked={field.value === FinishedGoodsStockAction.IMPORT}
													/>
												</StyledFormLabel>
											</FormItem>
											<FormItem>
												<StyledFormLabel
													htmlFor={FinishedGoodsStockAction.EXPORT}
													role='radio'
													tabIndex={0}
													aria-checked={field.value == FinishedGoodsStockAction.EXPORT}>
													<FormControl>
														<RadioGroupItem
															id={FinishedGoodsStockAction.EXPORT}
															value={FinishedGoodsStockAction.EXPORT}
															className='sr-only'
														/>
													</FormControl>
													{t('ns_inoutbound:action_types.stock_out')}
													<CheckIcon
														name='Check'
														size={24}
														aria-checked={field.value === FinishedGoodsStockAction.EXPORT}
													/>
												</StyledFormLabel>
											</FormItem>
										</RadioGroup>
									</FormItem>
								)}
							/>
						</Div>
						<Div
							className={cn(
								'sm:col-span-full',
								action === FinishedGoodsStockAction.IMPORT ? 'col-span-1' : 'col-span-full'
							)}>
							<FormField
								name='purpose'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('ns_common:common_fields.actions')}</FormLabel>
										<Div className='border-input bg-background aria-disabled:text-muted-foreground flex h-9 w-full items-center rounded-md border px-3 py-1 text-sm shadow-sm'>
											{form.watch('purpose') === StockTransactionPurpose.NORMAL_IMPORT
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
						{action === FinishedGoodsStockAction.IMPORT && (
							<Fragment>
								<Div className='col-span-1 sm:col-span-full'>
									<SelectFieldControl
										name='assembly_line.code'
										label={t('ns_erp:fields.assembly_line_code')}
										datalist={translatedAssemblyLines}
										labelField='name'
										valueField='code'
										onValueChange={(value) => {
											if (!Array.isArray(assemblyLines)) return
											const matchedItem = assemblyLines.find((item) => item.code === value)
											console.log(matchedItem)
											if (matchedItem && 'name' in matchedItem)
												form.setValue('assembly_line.name', matchedItem.name)
										}}
									/>
								</Div>
								<Div className='col-span-1 sm:col-span-full'>
									<SelectFieldControl
										disabled={isLoading}
										name='warehouse'
										label={t('ns_inoutbound:labels.io_archive_warehouse')}
										datalist={warehouseOptions ?? []}
										labelField='name'
										valueField='name'
									/>
								</Div>
								<Div className='col-span-1 sm:col-span-full'>
									<ComboboxFieldControl
										name='storage_location'
										label={t('ns_inoutbound:labels.io_storage_location')}
										datalist={storageLocations}
										labelField='name'
										valueField='name'
										shouldFilter={true}
										disabled={warehouseOptions?.length === 0}
									/>
								</Div>
							</Fragment>
						)}
						<Div className='col-span-full grid grid-cols-2 gap-x-2'>
							<Button
								type='submit'
								size={isMobileScreen ? 'lg' : 'default'}
								className='w-full'
								disabled={selectedOrder === 'all' || isPending}>
								<Icon
									name={isPending ? 'LoaderCircle' : 'Check'}
									aria-busy={isPending}
									className='aria-busy:animate-spin'
								/>
								{t('ns_common:actions.save')}
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

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6 max-h-full`
const StyledFormLabel = tw(FormLabel)<React.ComponentProps<typeof FormLabel>>`
	flex cursor-pointer select-none items-center rounded-(--radius) border p-6 font-medium transition-colors duration-200 sm:px-4 aria-checked:bg-secondary aria-checked:text-secondary-foreground
`
const CheckIcon = tw(Icon)<IconProps>`
	ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200 aria-checked:opacity-100
`

export default InoutboundForm
