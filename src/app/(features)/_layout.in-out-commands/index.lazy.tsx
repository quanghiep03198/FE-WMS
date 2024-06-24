import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { CommonActions } from '@/common/constants/enums'
import { IWarehouseStorageArea } from '@/common/types/entities'
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
	Label,
	RadioGroup,
	RadioGroupItem,
	ScrollArea,
	Select,
	SelectFieldControl,
	Typography
} from '@/components/ui'
import { WarehouseStorageService } from '@/services/warehouse-storage.service'
import { WarehouseService } from '@/services/warehouse.service'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { WAREHOUSE_LIST_QUERY_KEY, WAREHOUSE_STORAGE_LIST_KEY } from '../_constants/-query-key'

export const Route = createLazyFileRoute('/(features)/_layout/in-out-commands/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	useBreadcrumb([{ to: '/in-out-commands', text: t('ns_common:navigation.in_out_commands') }])
	const [action, setAction] = useState<CommonActions>(CommonActions.IMPORT)
	const form = useForm({})
	const warehouseNum = form.watch('warehouse_num')
	const [epcCode, _] = useState([])

	const storageTypes = useMemo(
		() => [
			{ label: t('ns_inoutbound:inoutbound_reasons.normal_import'), type: CommonActions.IMPORT, value: '1' },
			{ label: t('ns_inoutbound:inoutbound_reasons.normal_export'), type: CommonActions.EXPORT, value: '2' },
			{ label: t('ns_inoutbound:inoutbound_reasons.scrap'), type: CommonActions.EXPORT, value: '3' },
			{ label: t('ns_inoutbound:inoutbound_reasons.transfer_inbound'), type: CommonActions.IMPORT, value: '4' },
			{ label: t('ns_inoutbound:inoutbound_reasons.transfer_outbound'), type: CommonActions.EXPORT, value: '5' }, //
			{ label: t('ns_inoutbound:inoutbound_reasons.recycling'), type: CommonActions.EXPORT, value: '6' },
			{ label: t('ns_inoutbound:inoutbound_reasons.return_for_repair'), type: CommonActions.EXPORT, value: '7' }
		],
		[i18n.language]
	)

	const { data: warehouseOptions, isLoading } = useQuery({
		queryKey: [WAREHOUSE_LIST_QUERY_KEY],
		queryFn: WarehouseService.getWarehouseList,
		select: (response) =>
			Array.isArray(response.metadata)
				? response.metadata.map((item) => ({
						label: item.warehouse_name,
						value: item.warehouse_num
					}))
				: []
	})

	const { data: storageAreaOptions } = useQuery({
		queryKey: [WAREHOUSE_STORAGE_LIST_KEY, warehouseNum],
		queryFn: () => WarehouseStorageService.getWarehouseStorages(warehouseNum),
		enabled: !!warehouseNum,
		select: (response: ResponseBody<IWarehouseStorageArea[]>) => {
			console.log(response.metadata)
			return Array.isArray(response.metadata)
				? response.metadata.map((item) => ({
						label: item.storage_name,
						value: item.storage_num
					}))
				: []
		}
	})

	useEffect(() => {
		form.setValue('inoutbound_type', CommonActions.IMPORT)
	}, [])

	return (
		<Div className='grid h-full grid-cols-2 gap-10'>
			<Div className='flex flex-col items-stretch divide-y divide-border rounded-[var(--radius)] border border-border'>
				<Div className='flex basis-16 items-center justify-between px-4 text-center'>
					<Typography variant='h6'>EPC code</Typography>
					<Typography variant='small' color='muted'></Typography>
				</Div>
				{epcCode.length === 0 ? (
					<Div className='flex basis-full items-center justify-center gap-x-4'>
						<Icon name='TicketX' stroke='hsl(var(--muted-foreground))' size={40} strokeWidth={1} />
						<Typography color='muted'>Empty</Typography>
					</Div>
				) : (
					<Div className='flex flex-1 basis-full flex-col items-stretch overflow-y-scroll p-1 scrollbar'>
						{epcCode.map((item) => (
							<Typography className='px-4 py-2 uppercase transition-all duration-200 hover:bg-secondary'>
								{item}
							</Typography>
						))}
					</Div>
				)}
				<Div className='flex basis-16 items-center justify-between px-4'>
					<Typography variant='small' color='muted'>
						Data automatically sync every 5s
					</Typography>
					<Button>Start reading</Button>
				</Div>
			</Div>
			<Div className='flex flex-col items-stretch gap-y-6'>
				<Div className='flex basis-1/3 flex-col items-center justify-center space-y-6 rounded-[var(--radius)] border p-4 text-center'>
					<Typography variant='h5'>{t('ns_inoutbound:warehouse_input_output_number')}</Typography>
					<Typography variant='h1'>0</Typography>
				</Div>
				<FormProvider {...form}>
					<Form>
						<Div className='col-span-full'>
							<FormField
								name='inoutbound_type'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('ns_common:common_fields.actions')}</FormLabel>
										<FormMessage />
										<RadioGroup
											className='grid grid-cols-2'
											value={field.value}
											defaultValue={CommonActions.IMPORT}
											onValueChange={(value: CommonActions) => field.onChange(value)}>
											<FormItem>
												<FormLabel
													htmlFor={CommonActions.IMPORT}
													className={cn(
														'flex cursor-pointer select-none items-center rounded-[var(--radius)] border p-6 font-medium transition-colors duration-200',
														field.value === CommonActions.IMPORT && 'bg-primary text-primary-foreground'
													)}>
													<FormControl>
														<RadioGroupItem
															id={CommonActions.IMPORT}
															value={CommonActions.IMPORT}
															className='hidden'
														/>
													</FormControl>
													{t('ns_inoutbound:action_types.warehouse_input')}
													<Icon
														name='CircleCheckBig'
														size={20}
														className={cn(
															'ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200',
															field.value === CommonActions.IMPORT && 'scale-100 opacity-100'
														)}
													/>
												</FormLabel>
											</FormItem>
											<FormItem>
												<FormLabel
													htmlFor='2'
													className={cn(
														'flex cursor-pointer select-none items-center rounded-[var(--radius)]  border p-6 font-medium transition-all duration-200',
														field.value == CommonActions.EXPORT && 'bg-primary text-primary-foreground'
													)}>
													<FormControl>
														<RadioGroupItem id='2' value={CommonActions.EXPORT} className='sr-only' />
													</FormControl>
													{t('ns_inoutbound:action_types.warehouse_output')}
													<Icon
														name='CircleCheckBig'
														size={20}
														className={cn(
															'ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200',
															field.value === CommonActions.EXPORT && 'scale-100 opacity-100'
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
								name='type_storage'
								label={t('ns_inoutbound:labels.imp_exp_reason')}
								options={storageTypes.filter((item) => item.type === form.watch('inoutbound_type'))}
							/>
						</Div>
						<Div
							className={cn(
								'col-span-1',
								form.watch('inoutbound_type') === CommonActions.EXPORT ? 'hidden' : 'block'
							)}>
							<SelectFieldControl
								disabled={isLoading}
								control={form.control}
								name='rfid_use'
								label={t('ns_inoutbound:labels.imp_archive_warehouse')}
								options={warehouseOptions}
							/>
						</Div>
						<Div
							className={cn(
								'col-span-1',
								form.watch('inoutbound_type') === CommonActions.EXPORT ? 'hidden' : 'block'
							)}>
							<SelectFieldControl
								disabled={warehouseOptions?.length === 0}
								control={form.control}
								name='storage'
								label={t('ns_inoutbound:labels.imp_location')}
								options={storageAreaOptions}
							/>
						</Div>

						<Div className='col-span-full flex items-center justify-end'>
							<Button type='submit' className='gap-x-2' disabled={epcCode.length === 0}>
								<Icon name='Check' /> {t('ns_common:actions.save')}
							</Button>
						</Div>
					</Form>
				</FormProvider>
			</Div>
		</Div>
	)
}

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`
