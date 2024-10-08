import { CommonActions } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import { IEmployee, type IWarehouse } from '@/common/types/entities'
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
import { debounce } from 'lodash'
import React, { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useGetDepartmentQuery } from '../../../(auth)/_apis/department.api'
import { WAREHOUSE_PROVIDE_TAG } from '../_apis/warehouse.api'
import { warehouseTypes } from '../_constants/warehouse.const'
import { usePageContext } from '../_contexts/-page-context'
import { PartialWarehouseFormValue, warehouseFormSchema, type WarehouseFormValue } from '../_schemas/warehouse.schema'

export type FormValues<T> = (T extends CommonActions.CREATE
	? Required<WarehouseFormValue>
	: PartialWarehouseFormValue) &
	Pick<IWarehouse, 'id'>

const WarehouseFormDialog: React.FC = () => {
	const queryClient = useQueryClient()
	const {
		dialogFormState: { open, type, dialogTitle, defaultFormValues },
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
	const { data: departments } = useGetDepartmentQuery()

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
			dispatch({ type: 'RESET' })
			queryClient.invalidateQueries({ queryKey: [WAREHOUSE_PROVIDE_TAG] })
			return toast.success(t('ns_common:notification.success'), { id: context })
		},
		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})

	useDeepCompareEffect(() => {
		form.reset({ ...defaultFormValues, company_code: user?.company_code })
	}, [type, defaultFormValues, open])

	const warehouseTypeOptions = Object.entries(warehouseTypes).map(([key, value]) => ({
		label: t(value, { ns: 'ns_warehouse', defaultValue: value }) as string,
		value: key
	}))

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) dispatch({ type: 'RESET' })
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
								label={t('ns_warehouse:fields.warehouse_name')}
							/>
						</FormItem>
						<FormItem>
							<SelectFieldControl
								name='type_warehouse'
								label={t('ns_warehouse:fields.type_warehouse')}
								datalist={warehouseTypeOptions}
								labelField='label'
								valueField='value'
							/>
						</FormItem>
						<FormItem>
							<InputFieldControl
								disabled
								placeholder='Some warehouse name ...'
								name='company_code'
								label={t('ns_company:company')}
								defaultValue={user?.company_code}
							/>
						</FormItem>
						<FormItem>
							<ComboboxFieldControl
								name='dept_code'
								placeholder='Search department ...'
								label={t('ns_company:department')}
								datalist={departments}
								shouldFilter={false}
								labelField='dept_name'
								valueField='dept_code'
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
								datalist={employees}
								disabled={!department}
								shouldFilter={false}
								labelField='employee_name'
								valueField='employee_code'
								onInput={debounce((value) => setEmployeeSearchTerm(value), 500)}
								template={EmployeeComboboxSelection}
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
							<Button type='button' variant='outline' onClick={() => dispatch({ type: 'RESET' })}>
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

const EmployeeComboboxSelection: React.FC<{ data: IEmployee }> = ({ data }) => (
	<Div className='space-y-1'>
		<Typography className='line-clamp-1'>{data.employee_name}</Typography>
		<Typography variant='small' className='line-clamp-1' color='muted'>
			{data.employee_code}
		</Typography>
	</Div>
)

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`
const FormItem = tw.div`col-span-1 sm:col-span-full md:col-span-full`

export default memo(WarehouseFormDialog)
