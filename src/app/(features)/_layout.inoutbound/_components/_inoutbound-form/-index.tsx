import { useGetWarehouseStorageQuery } from '@/app/(features)/_layout.warehouse/_apis/warehouse-storage.api'
import { useGetWarehouseQuery } from '@/app/(features)/_layout.warehouse/_apis/warehouse.api'
import useMediaQuery from '@/common/hooks/use-media-query'
import { IWarehouse, IWarehouseStorage } from '@/common/types/entities'
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
	Separator,
	Typography
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemoizedFn } from 'ahooks'
import { omit, pick } from 'lodash'
import React, { Fragment, memo, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import {
	FALLBACK_ORDER_VALUE,
	useGetShapingProductLineQuery,
	useUpdateStockMovementMutation
} from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'
import {
	FormActionEnum,
	FormValues,
	InboundFormValues,
	inboundSchema,
	outboundSchema
} from '../../_schemas/epc-inoutbound.schema'

const InoutboundForm: React.FC = () => {
	const { selectedOrder, scanningStatus } = usePageContext((state) => pick(state, ['selectedOrder', 'scanningStatus']))
	const { t, i18n } = useTranslation()
	const [action, setAction] = useState<FormActionEnum>(() => FormActionEnum.IMPORT)
	const isMobileScreen = useMediaQuery('(min-width: 320px) and (max-width: 1023px)')

	const form = useForm<FormValues>({
		resolver: zodResolver(action === FormActionEnum.IMPORT ? inboundSchema : outboundSchema),
		defaultValues: {
			rfid_status: FormActionEnum.IMPORT,
			rfid_use: '',
			warehouse_num: '',
			storage: '',
			dept_code: ''
		},
		mode: 'onChange'
	})

	const warehouseNum = form.watch('warehouse_num')

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

	const { data: inoutboundDepts } = useGetShapingProductLineQuery()

	const { data: storageAreaOptions } = useGetWarehouseStorageQuery(warehouseNum, {
		enabled: Boolean(warehouseNum),
		select: (response) => response.metadata
	})

	const { mutateAsync } = useUpdateStockMovementMutation()

	const handleResetForm = useMemoizedFn(() => {
		form.reset({
			...form.getValues(),
			rfid_use: '',
			dept_code: '',
			warehouse_num: '',
			storage: ''
		})
	})

	// Reset form when all actions are reset
	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			handleResetForm()
		}
	}, [scanningStatus])

	const handleSubmit = (data: InboundFormValues) => {
		toast.promise(
			mutateAsync({
				...omit(data, ['warehouse_num']),
				mo_no: selectedOrder === FALLBACK_ORDER_VALUE ? null : selectedOrder
			}),
			{
				loading: t('ns_common:notification.processing_request'),
				success: t('ns_common:notification.success'),
				error: t('ns_common:notification.error')
			}
		)
	}

	return (
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
									defaultValue={FormActionEnum.IMPORT}
									onValueChange={(value) => {
										field.onChange(value)
										setAction(value as FormActionEnum)
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
												size={24}
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
												size={24}
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
								shouldFilter={false}
								disabled={warehouseOptions?.length === 0}
								label={t('ns_inoutbound:labels.io_storage_location')}
								template={WarehouseComboboxSelection}
							/>
						</Div>
					</Fragment>
				)}
				<Div className='col-span-full flex flex-col items-center justify-between gap-6 lg:flex-row xl:flex-row'>
					<Button
						type='submit'
						size={isMobileScreen ? 'lg' : 'default'}
						className='gap-x-2 sm:w-full md:w-full'
						disabled={scanningStatus !== 'disconnected' || selectedOrder === 'all'}>
						<Icon name='Check' /> {t('ns_common:actions.save')}
					</Button>
				</Div>
				<Separator className='col-span-full' />
				<Div className='col-span-full'>
					<Typography variant='small' className='inline-flex items-center gap-x-2 italic'>
						<Icon name='BotMessageSquare' size={24} strokeWidth={1.5} />
						{t('ns_inoutbound:description.inoutbound_form_note')}
					</Typography>
				</Div>
			</Form>
		</FormProvider>
	)
}

const WarehouseComboboxSelection: React.FC<{ data: IWarehouseStorage }> = ({ data }) => (
	<Div className='space-y-0.5'>
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
	flex cursor-pointer select-none items-center rounded-[var(--radius)] border p-6 font-medium transition-colors duration-200 sm:px-4 aria-checked:bg-secondary aria-checked:text-secondary-foreground
`
const CheckIcon = tw(Icon)<IconProps>`
	ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200 aria-checked:opacity-100
`

export default memo(InoutboundForm)
