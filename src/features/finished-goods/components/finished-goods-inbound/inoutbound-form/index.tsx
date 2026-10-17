import { FALLBACK_VALUE } from '@common/constants/constants'
import { cn } from '@common/utils/cn'
import { Alert, AlertClose, AlertContent, AlertDescription, AlertTitle } from '@components/customs/alert'
import { Div } from '@components/customs/div'
import { Tooltip } from '@components/customs/tooltip'
import { ComboboxFieldControl } from '@components/forms/combobox'
import { SelectFieldControl } from '@components/forms/select'
import { Button } from '@components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form as FormProvider } from '@components/ui/form'
import type { IconProps } from '@components/ui/icon'
import { Icon } from '@components/ui/icon'
import { Input } from '@components/ui/input'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
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
import type { Resolver } from 'react-hook-form'
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
		resolver: zodResolver(
			action === FinishedGoodsStockAction.IMPORT ? stockBalancesSchema : outboundSchema
		) as unknown as Resolver<FormValues>,
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
						className='fill-destructive-foreground stroke-destructive'
						name='TriangleAlert'
						size={40}
						strokeWidth={2}
					/>
					<AlertContent>
						<AlertTitle>{t('ns_common:titles.caution')}</AlertTitle>
						<AlertDescription>
							{(error as AxiosError<ResponseBody<void>>)?.response?.data?.message}
						</AlertDescription>
					</AlertContent>
					<Tooltip
						contentProps={{ side: 'left' }}
						message={t('ns_common:actions.dismiss')}
						triggerProps={{ asChild: true }}>
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
											defaultValue={FinishedGoodsStockAction.IMPORT}
											value={field.value}
											onValueChange={(value) => {
												field.onChange(value)
												setAction(value as FinishedGoodsStockAction)
												handleResetForm()
											}}>
											<FormItem>
												<StyledFormLabel
													aria-checked={field.value === FinishedGoodsStockAction.IMPORT}
													htmlFor={FinishedGoodsStockAction.IMPORT}
													role='checkbox'
													tabIndex={0}>
													<FormControl>
														<RadioGroupItem
															className='hidden'
															id={FinishedGoodsStockAction.IMPORT}
															value={FinishedGoodsStockAction.IMPORT}
														/>
													</FormControl>
													{t('ns_inoutbound:action_types.stock_in')}
													<CheckIcon
														aria-checked={field.value === FinishedGoodsStockAction.IMPORT}
														name='Check'
														size={24}
													/>
												</StyledFormLabel>
											</FormItem>
											<FormItem>
												<StyledFormLabel
													aria-checked={field.value == FinishedGoodsStockAction.EXPORT}
													htmlFor={FinishedGoodsStockAction.EXPORT}
													role='radio'
													tabIndex={0}>
													<FormControl>
														<RadioGroupItem
															className='sr-only'
															id={FinishedGoodsStockAction.EXPORT}
															value={FinishedGoodsStockAction.EXPORT}
														/>
													</FormControl>
													{t('ns_inoutbound:action_types.stock_out')}
													<CheckIcon
														aria-checked={field.value === FinishedGoodsStockAction.EXPORT}
														name='Check'
														size={24}
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
												className='text-foreground h-max w-full border-none px-0 shadow-none focus-within:outline-none focus:border-none'
												placeholder={t('ns_common:actions.select_database')}
												readOnly={true}
												type='hidden'
												value={field.value}
												onChange={field.onChange}
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
										datalist={translatedAssemblyLines}
										label={t('ns_erp:fields.assembly_line_code')}
										labelField='name'
										name='assembly_line.code'
										valueField='code'
										onValueChange={(value) => {
											if (!Array.isArray(assemblyLines)) return
											const matchedItem = assemblyLines.find((item) => item.code === value)
											if (matchedItem && 'name' in matchedItem)
												form.setValue('assembly_line.name', matchedItem.name)
										}}
									/>
								</Div>
								<Div className='col-span-1 sm:col-span-full'>
									<SelectFieldControl
										datalist={warehouseOptions ?? []}
										disabled={isLoading}
										label={t('ns_inoutbound:labels.io_archive_warehouse')}
										labelField='name'
										name='warehouse'
										valueField='name'
									/>
								</Div>
								<Div className='col-span-1 sm:col-span-full'>
									<ComboboxFieldControl
										datalist={storageLocations}
										disabled={warehouseOptions?.length === 0}
										label={t('ns_inoutbound:labels.io_storage_location')}
										labelField='name'
										name='storage_location'
										shouldFilter={true}
										valueField='name'
									/>
								</Div>
							</Fragment>
						)}
						<Div className='col-span-full grid grid-cols-2 gap-x-2'>
							<Button
								className='w-full'
								disabled={selectedOrder === 'all' || isPending}
								size={isMobileScreen ? 'lg' : 'default'}
								type='submit'>
								<Icon
									aria-busy={isPending}
									className='aria-busy:animate-spin'
									name={isPending ? 'LoaderCircle' : 'Check'}
								/>
								{t('ns_common:actions.save')}
							</Button>
							<Button
								className='gap-x-2 sm:w-full md:w-full'
								size={isMobileScreen ? 'lg' : 'default'}
								type='reset'
								variant='outline'
								onClick={handleResetForm}>
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
