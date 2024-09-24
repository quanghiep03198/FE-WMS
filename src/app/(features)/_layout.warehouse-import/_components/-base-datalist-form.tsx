import { CofactoryRef } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import { IWarehouse } from '@/common/types/entities'
import {
	Button,
	ComboboxFieldControl,
	DatePickerFieldControl,
	Div,
	Form as FormProvider,
	InputFieldControl,
	SelectFieldControl,
	Typography
} from '@/components/ui'
import { useStepContext } from '@/components/ui/@custom/step'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetInoutboundDeptQuery } from '../../_layout.inoutbound/_apis/rfid.api'
import { useGetWarehouseStorageQuery } from '../../_layout.warehouse/_apis/warehouse-storage.api'
import { useGetWarehouseQuery } from '../../_layout.warehouse/_apis/warehouse.api'
import { InoutboundOrderTypes } from '../_constants/warehouse-import.const'
import { useDatalistDialogContext } from '../_contexts/-datalist-dialog-context'
import { usePageContext } from '../_contexts/-page-context'
import { ImportOrderValue, importOrderSchema } from '../_schemas/import-order.schema'

const BaseDatalistForm: React.FC = () => {
	const { orderCount } = usePageContext()
	const { t } = useTranslation()
	const { user } = useAuth()
	const { importOrderValue, setImportOrderValue } = useDatalistDialogContext()
	const { dispatch } = useStepContext()

	// * Generate new import order code
	const generateNextOrderCode = useCallback(() => {
		const orderPrefix = 'SN'
		const cofactoryCode = CofactoryRef[user.company_code]
		const orderDate = format(new Date(), 'yyMMdd')
		const orderIndex = orderCount + 1
		return `${orderPrefix}${cofactoryCode}${orderDate}${orderIndex}`
	}, [])

	const form = useForm<ImportOrderValue>({
		resolver: zodResolver(importOrderSchema),
		defaultValues: importOrderValue
			? importOrderValue
			: {
					sno_no: generateNextOrderCode(),
					sno_date: new Date(),
					warehouse_num: '',
					storage_num: '',
					type_inventorylist: ''
				}
	})
	const warehouseNum = form.watch('warehouse_num')

	// * Get warehouses datalist
	const { data: warehouseOptions, isLoading } = useGetWarehouseQuery<IWarehouse[]>({
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})

	// * Get warehouse storage datalist
	const { data: storageAreaOptions } = useGetWarehouseStorageQuery(warehouseNum, {
		enabled: Boolean(warehouseNum),
		select: (response) => response.metadata
	})

	// * Get half-finished production departments
	const { data: inoutboundDepts } = useGetInoutboundDeptQuery()

	// * Get type inventory list options
	const inboundOrderTypes = Object.entries(InoutboundOrderTypes).map(([k, v]) => ({
		label: t(k, { ns: 'ns_erp', defaultValue: v }),
		value: v
	}))

	const handleCreateOrder = (data: ImportOrderValue) => {
		setImportOrderValue(data)
		dispatch({ type: 'NEXT_STEP' })
	}

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(handleCreateOrder)}>
				<FieldSet>
					<Lengend>Import order information</Lengend>
					<Div className='col-span-1 sm:col-span-full'>
						<InputFieldControl
							name='sno_no'
							control={form.control}
							label={t('ns_erp:fields.sno_no')}
							placeholder='SNA24040774'
							description='Order code is automatically generated'
							disabled
						/>
					</Div>
					<Div className='col-span-1 sm:col-span-full'>
						<DatePickerFieldControl
							name='sno_date'
							control={form.control}
							label={t('ns_erp:fields.sno_date')}
							description='Date of order creation'
						/>
					</Div>
					<Div className='col-span-1 sm:col-span-full'>
						<SelectFieldControl
							control={form.control}
							name='type_inventorylist'
							label={t('ns_company:department')}
							datalist={inboundOrderTypes}
							labelField='label'
							valueField='value'
						/>
					</Div>
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
							name='storage_num'
							datalist={storageAreaOptions}
							labelField='storage_name'
							valueField='storage_num'
							form={form}
							shouldFilter={false}
							disabled={!warehouseNum}
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
					<Div className='col-span-full'>
						<Button type='submit' className='w-full lg:w-auto xl:w-auto'>
							{t('ns_common:actions.proceed')}
						</Button>
					</Div>
				</FieldSet>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`mx-auto flex w-full max-w-4xl`
const FieldSet = tw.fieldset`grid grid-cols-2 gap-x-2 gap-y-6 flex-1 overflow-x-hidden`
const Lengend = tw.legend`font-semibold text-lg mb-6`

export default BaseDatalistForm
