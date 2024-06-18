import { WarehouseTypes } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IEmployee } from '@/common/types/entities'
import {
	Button,
	ComboboxFieldControl,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Div,
	Form as FormProvider,
	SelectFieldControl,
	Typography
} from '@/components/ui'
import { InputFieldControl } from '@/components/ui/@hook-form/input-field-control'
import { WarehouseFormValue, warehouseFormSchema } from '@/schemas/warehouse.schema'
import { EmployeeService } from '@/services/employee.service'
import { WarehouseService } from '@/services/warehouse.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDeepCompareEffect } from 'ahooks'
import _ from 'lodash'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { FormAction } from './-warehouse-list'
import { useBlocker } from '@tanstack/react-router'

type WarehouseFormDialogProps = { onFormActionChange: React.Dispatch<FormAction> } & FormAction['payload'] &
	Required<Pick<React.ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>>

const WarehouseFormDialog: React.FC<WarehouseFormDialogProps> = ({
	open,
	title,
	type,
	defaultValues,
	onOpenChange,
	onFormActionChange
}) => {
	const [employeeSearchTerm, setEmployeeSearchTerm] = useState<string>('')
	const { t } = useTranslation()
	const { userCompany } = useAuth()
	const form = useForm<WarehouseFormValue>({
		resolver: zodResolver(warehouseFormSchema)
	})

	const queryClient = useQueryClient()

	const { data: departmentOptions } = useQuery({
		queryKey: ['departments', userCompany],
		queryFn: () => WarehouseService.getWarehouseDepartments(userCompany),
		select: (data) => {
			return Array.isArray(data?.metadata)
				? data.metadata.map((dept) => ({
						label: dept.MES_dept_name,
						value: dept.ERP_dept_code
					}))
				: []
		}
	})

	const { data: employees } = useQuery({
		queryKey: ['employees', employeeSearchTerm],
		queryFn: () => EmployeeService.searchEmployee({ search: employeeSearchTerm }),
		select: (data) => data?.metadata
	})

	useDeepCompareEffect(() => {
		form.reset({ ...defaultValues, company_code: userCompany })
	}, [type, defaultValues, open])

	const { searchParams } = useQueryParams()

	const { mutateAsync } = useMutation({
		mutationKey: ['warehouse', Object.values(searchParams)],
		mutationFn: (data: WarehouseFormValue) => {
			switch (type) {
				case 'add':
					return WarehouseService.createWarehouse(data)
				case 'update':
					console.log(type)
					return WarehouseService.updateWarehouse(defaultValues.id, data)
				default:
					throw new Error('Invalid actions')
			}
		},
		onMutate: () => {
			const id = crypto.randomUUID()
			toast.loading(t('ns_common:notification.processing_request'), { id })
			return { id }
		},
		onSuccess: (_data, _vars, { id }) => {
			toast.success(t('ns_common:notification.success'), { id })
			onOpenChange(!open)
			onFormActionChange({ type: undefined })
			return queryClient.invalidateQueries({ queryKey: ['warehouses'] })
		},
		onError: (_data, _vars, { id }) => toast.error(t('ns_common:notification.success'), { id })
	})

	const handleOpenStateChange = (open) => {
		if (!open) onFormActionChange({ type: undefined })
		onOpenChange(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenStateChange}>
			<DialogContent className='w-full max-w-2xl bg-popover'>
				<DialogHeader>
					<DialogTitle>{t(title, { ns: 'ns_warehouse', defaultValue: title })}</DialogTitle>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit((data) => mutateAsync(data))}>
						<FormItem>
							<InputFieldControl
								placeholder='Some warehouse name ...'
								name='warehouse_name'
								control={form.control}
								label={t('ns_warehouse:fields.warehouse_name')}
							/>
						</FormItem>
						<FormItem>
							<SelectFieldControl
								options={Object.entries(WarehouseTypes).map(([key, value]) => ({
									label: t(value, { ns: 'ns_warehouse', defaultValue: value }),
									value: key
								}))}
								name='type_warehouse'
								control={form.control}
								label={t('ns_warehouse:fields.type_warehouse')}
							/>
						</FormItem>
						<FormItem>
							<InputFieldControl
								disabled
								placeholder='Some warehouse name ...'
								name='company_code'
								control={form.control}
								label={t('ns_company:company')}
								defaultValue={userCompany}
							/>
						</FormItem>
						<FormItem>
							<SelectFieldControl
								label={t('ns_company:department')}
								name='dept_code'
								options={departmentOptions}
								control={form.control}
							/>
						</FormItem>
						<FormItem>
							<InputFieldControl
								name='area'
								placeholder='1,000 (m²)'
								control={form.control}
								type='number'
								label={t('ns_warehouse:fields.area')}
							/>
						</FormItem>
						<FormItem>
							<ComboboxFieldControl
								label={t('ns_warehouse:fields.manager')}
								form={form}
								control={form.control}
								name='employee_code'
								placeholder='Search employee ...'
								onInput={_.debounce((value) => setEmployeeSearchTerm(value), 500)}
								data={employees}
								labelField='employee_name'
								valueField='employee_code'
								template={({ data }: { data: IEmployee }) => (
									<Div className='space-y-1'>
										<Typography className='line-clamp-1'>{data.employee_name}</Typography>
										<Typography variant='small' className='line-clamp-1' color='muted'>
											{data.employee_code}
										</Typography>
									</Div>
								)}
							/>
						</FormItem>
						{/* Form actions */}
						<DialogFooter className='col-span-full'>
							<Button
								type='button'
								variant='outline'
								onClick={() => {
									onFormActionChange({ type: null })
									onOpenChange(false)
								}}>
								{t('ns_common:actions.cancel')}
							</Button>
							<Button type='submit'>{t('ns_common:actions.submit')}</Button>
						</DialogFooter>
					</Form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`
const FormItem = tw.div`col-span-1 sm:col-span-full md:col-span-full`

export default WarehouseFormDialog
