import { warehouseTypes } from '@/common/constants/constants'
import { CommonActions } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import { IEmployee, IWarehouse } from '@/common/types/entities'
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
import {
	warehouseFormSchema,
	type PartialWarehouseFormValue,
	type WarehouseFormValue
} from '@/schemas/warehouse.schema'
import { EmployeeService } from '@/services/employee.service'
import { WarehouseService } from '@/services/warehouse.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDeepCompareEffect } from 'ahooks'
import _ from 'lodash'
import { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { type TAction, type TFormAction } from '../_reducers/-form.reducer'

export type TFormValues<T> = (T extends CommonActions.CREATE
	? WarehouseFormValue
	: T extends CommonActions.UPDATE
		? PartialWarehouseFormValue
		: {}) &
	Pick<IWarehouse, 'id'>

type FormAction = TFormAction<TFormValues<TAction>>

const WarehouseFormDialog = (props: {
	open: boolean
	title: string
	type: TAction
	defaultValues: TFormValues<typeof props.type>
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
	onFormActionChange: React.Dispatch<FormAction>
}) => {
	const { open, title, type, defaultValues, onOpenChange, onFormActionChange } = props

	const [employeeSearchTerm, setEmployeeSearchTerm] = useState<string>('')
	const { t } = useTranslation()
	const { userCompany } = useAuth()
	const form = useForm<TFormValues<typeof type>>({
		resolver: zodResolver(warehouseFormSchema)
	})

	const queryClient = useQueryClient()

	const { data: departments } = useQuery({
		queryKey: ['departments', userCompany],
		queryFn: () => WarehouseService.getWarehouseDepartments(userCompany),
		select: (data) => (Array.isArray(data.metadata) ? data.metadata : [])
	})

	const { data: employees } = useQuery({
		queryKey: ['employees', employeeSearchTerm],
		queryFn: () => EmployeeService.searchEmployee({ dept_code: form.watch('dept_code'), search: employeeSearchTerm }),
		select: (data) => data?.metadata
	})

	useDeepCompareEffect(() => {
		form.reset({ ...defaultValues, company_code: userCompany })
	}, [type, defaultValues, open])

	const { mutateAsync } = useMutation({
		mutationKey: ['warehouse'],
		mutationFn: (payload: TFormValues<typeof type>) => {
			switch (type) {
				case CommonActions.CREATE:
					return WarehouseService.createWarehouse(payload)
				case CommonActions.UPDATE:
					return WarehouseService.updateWarehouse((defaultValues as TFormValues<CommonActions.UPDATE>).id, payload)
				default:
					throw new Error('Invalid actions')
			}
		},
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			onOpenChange(!open)
			onFormActionChange({ type: undefined })
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: ['warehouses'] })
		},
		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})

	const handleOpenStateChange = (open) => {
		if (!open) onFormActionChange({ type: undefined })
		onOpenChange(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenStateChange}>
			<DialogContent className='w-full max-w-3xl bg-popover'>
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
								options={Object.entries(warehouseTypes).map(([key, value]) => ({
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
							<ComboboxFieldControl
								label={t('ns_company:department')}
								form={form}
								control={form.control}
								name='dept_code'
								placeholder='Search department ...'
								data={departments}
								labelField='MES_dept_name'
								valueField='ERP_dept_code'
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
								disabled={!form.watch('dept_code')}
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
									onFormActionChange({ type: undefined })
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

export default memo(WarehouseFormDialog)
