import { CommonActions } from '@/common/constants/enums'
import { cn } from '@/common/utils/cn'
import {
	Button,
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
	SelectFieldControl
} from '@/components/ui'
import { FormActionEnum, InOutBoundFormValues, inOutBoundSchema } from '@/schemas/epc-inoutbound.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Fragment, useContext, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetWarehouseStorageQuery } from '../../_composables/-warehouse-storage.composable'
import { useGetWarehouseQuery } from '../../_composables/-warehouse.composable'
import { PageContext, RFID_EPC_PROVIDE_TAG } from '../_context/-page-context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RFIDService } from '@/services/rfid.service'
import { toast } from 'sonner'
import _ from 'lodash'

export type InOutBoundPayload = InOutBoundFormValues & { epc_code: string[] }

const InOutBoundForm: React.FC = () => {
	const queryClient = useQueryClient()
	const { data, scanningStatus, setScanningStatus } = useContext(PageContext)
	const { t, i18n } = useTranslation()
	const form = useForm<InOutBoundFormValues>({
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
		select: (response) => {
			return Array.isArray(response.metadata)
				? response.metadata.map((item) => ({
						label: item.storage_name,
						value: item.storage_num
					}))
				: []
		}
	})

	const scannedEPCs = useMemo(() => [...new Set(data.map((item) => item.epc_code))], [data])

	const { mutateAsync } = useMutation({
		mutationKey: [RFID_EPC_PROVIDE_TAG],
		mutationFn: RFIDService.updateStockMovement,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			setScanningStatus(undefined)
			return queryClient.invalidateQueries({ queryKey: [RFID_EPC_PROVIDE_TAG] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})

	return (
		<FormProvider {...form}>
			<Form
				onSubmit={form.handleSubmit(
					async (data) => await mutateAsync({ ..._.omit(data, ['warehouse_num']), epc_code: scannedEPCs })
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
												field.value === FormActionEnum.IMPORT && 'bg-primary text-primary-foreground'
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
												field.value == FormActionEnum.EXPORT && 'bg-primary text-primary-foreground'
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
							{/*  */}
							<SelectFieldControl
								disabled={isLoading}
								control={form.control}
								name='warehouse_num'
								label={t('ns_inoutbound:labels.io_archive_warehouse')}
								options={warehouseOptions}
							/>
						</Div>
						<Div className='col-span-1 sm:col-span-full'>
							<SelectFieldControl
								disabled={warehouseOptions?.length === 0}
								control={form.control}
								name='storage'
								label={t('ns_inoutbound:labels.io_storage_location')}
								options={storageAreaOptions}
							/>
						</Div>
					</Fragment>
				)}

				<Div className='col-span-full'>
					<Button type='submit' className='gap-x-2 sm:w-full' disabled={scanningStatus !== 'finished'}>
						<Icon name='Check' /> {t('ns_common:actions.save')}
					</Button>
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`

export default InOutBoundForm
