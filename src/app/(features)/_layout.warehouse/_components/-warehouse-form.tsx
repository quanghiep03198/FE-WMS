import { CommonActions } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import { type IEmployee, type IWarehouse } from '@/common/types/entities'
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
	TextareaFieldControl,
	Typography
} from '@/components/ui'
import { InputFieldControl } from '@/components/ui/@hook-form/input-field-control'
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
import { useGetDepartmentQuery } from '../../_composables/-use-department-api'
import { WAREHOUSE_PROVIDE_TAG } from '../_composables/-use-warehouse-api'
import { warehouseTypes } from '../_constants/-warehouse.constant'
import { usePageContext } from '../_contexts/-page-context'
import { PartialWarehouseFormValue, warehouseFormSchema, type WarehouseFormValue } from '../_schemas/-warehouse.schema'

export type FormValues<T> = (T extends CommonActions.CREATE
	? Required<WarehouseFormValue>
	: PartialWarehouseFormValue) &
	Pick<IWarehouse, 'id'>

type WarehouseFormDialogProps = {
	open: boolean
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const WarehouseFormDialog: React.FC<WarehouseFormDialogProps> = ({ open, onOpenChange }) => {
	const queryClient = useQueryClient()
	const {
		dialogFormState: { type, dialogTitle, defaultFormValues },
		dispatch
	} = usePageContext()
	const { user } = useAuth()
	const [employeeSearchTerm, setEmployeeSearchTerm] = useState<string>('')
	const { t } = useTranslation()
	const form = useForm<FormValues<typeof type>>({
		resolver: zodResolver(warehouseFormSchema)
	})
	const department = form.watch('dept_code')

	// Get department field values
	const { data: departments } = useGetDepartmentQuery(user?.company_code)

	// Get employee field values
	const { data: employees } = useQuery({
		queryKey: ['EMPLOYEES', employeeSearchTerm],
		queryFn: () => EmployeeService.searchEmployee({ dept_code: department, search: employeeSearchTerm }),
		select: (data) => data?.metadata
	})

	// Create/Update action
	const { mutateAsync, isPending } = useMutation({
		mutationKey: [WAREHOUSE_PROVIDE_TAG],
		mutationFn: (payload: FormValues<typeof type>) => {
			switch (type) {
				case CommonActions.CREATE: {
					return WarehouseService.createWarehouse(payload)
				}
				case CommonActions.UPDATE: {
					const id = defaultFormValues.id
					return WarehouseService.updateWarehouse({ id, payload })
				}
				default: {
					throw new Error('Invalid actions')
				}
			}
		},
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			onOpenChange(!open)
			dispatch({ type: 'RESET' })
			queryClient.invalidateQueries({ queryKey: [WAREHOUSE_PROVIDE_TAG] })
			return toast.success(t('ns_common:notification.success'), { id: context })
		},
		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})

	useDeepCompareEffect(() => {
		form.reset({ ...defaultFormValues, company_code: user?.company_code })
	}, [type, defaultFormValues, open])

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) dispatch({ type: 'RESET' })
				onOpenChange(open)
			}}>
			<DialogContent className='w-full max-w-3xl bg-popover'>
				<DialogHeader>
					<DialogTitle>{t(dialogTitle, { ns: 'ns_warehouse', defaultValue: dialogTitle })}</DialogTitle>
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
								name='type_warehouse'
								label={t('ns_warehouse:fields.type_warehouse')}
								control={form.control}
								options={Object.entries(warehouseTypes).map(([key, value]) => ({
									label: t(value, { ns: 'ns_warehouse', defaultValue: value }),
									value: key
								}))}
							/>
						</FormItem>
						<FormItem>
							<InputFieldControl
								disabled
								placeholder='Some warehouse name ...'
								name='company_code'
								control={form.control}
								label={t('ns_company:company')}
								defaultValue={user?.company_code}
							/>
						</FormItem>
						<FormItem>
							<ComboboxFieldControl
								name='dept_code'
								placeholder='Search department ...'
								label={t('ns_company:department')}
								form={form}
								data={departments}
								shouldFilter={false}
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
								name='employee_code'
								placeholder='Search employee ...'
								label={t('ns_warehouse:fields.manager')}
								form={form}
								data={employees}
								disabled={!department}
								shouldFilter={false}
								labelField='employee_name'
								valueField='employee_code'
								onInput={_.debounce((value) => setEmployeeSearchTerm(value), 500)}
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
						<FormItem className='col-span-full'>
							<TextareaFieldControl
								name='remark'
								label={t('ns_common:common_fields.remark')}
								placeholder='Aditional remark ...'
								control={form.control}
								rows={5}
							/>
						</FormItem>
						{/* Form actions */}
						<DialogFooter className='col-span-full'>
							<Button
								type='button'
								variant='outline'
								onClick={() => {
									dispatch({ type: 'RESET' })
									onOpenChange(false)
								}}>
								{t('ns_common:actions.cancel')}
							</Button>
							<Button type='submit' disabled={isPending}>
								{t('ns_common:actions.submit')}
							</Button>
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
