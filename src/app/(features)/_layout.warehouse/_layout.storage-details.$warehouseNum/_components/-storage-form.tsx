// #region Modules
import { WAREHOUSE_STORAGE_PROVIDE_TAG } from '@/app/(features)/_layout.warehouse/_composables/-use-warehouse-storage-api'
import { CommonActions } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import { IWarehouseStorage } from '@/common/types/entities'
import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Form as FormProvider,
	SelectFieldControl,
	TextareaFieldControl
} from '@/components/ui'
import { InputFieldControl } from '@/components/ui/@hook-form/input-field-control'
import { WarehouseStorageService } from '@/services/warehouse-storage.service'
import { WarehouseService } from '@/services/warehouse.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useDeepCompareEffect } from 'ahooks'
import { pick } from 'lodash'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { warehouseStorageTypes } from '../../_constants/-warehouse.constant'
import { usePageContext } from '../../_contexts/-page-context'
import { PartialStorageFormValue, StorageFormValue, storageFormSchema } from '../../_schemas/-warehouse.schema'
// #endregion

// #region Type declarations
export type FormValues<T> = Pick<IWarehouseStorage, 'storage_num'> &
	(T extends CommonActions.CREATE ? Required<StorageFormValue> : PartialStorageFormValue)

type WarehouseStorageFormDialogProps = {
	open: boolean
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}
// #endregion

// #region Component declaration
const WarehouseStorageFormDialog: React.FC = () => {
	const { warehouseNum } = useParams({ strict: false })
	const { t } = useTranslation()
	const { user } = useAuth()
	const {
		dialogFormState: { open, type, dialogTitle, defaultFormValues },
		dispatch
	} = usePageContext()
	const form = useForm<FormValues<typeof type>>({
		resolver: zodResolver(storageFormSchema)
	})

	const queryClient = useQueryClient()

	const { data: warehouse } = useSuspenseQuery({
		queryKey: ['warehouses', warehouseNum],
		queryFn: () => WarehouseService.getWarehouseByNum(warehouseNum),
		select: (response) => response.metadata
	})

	useDeepCompareEffect(() => {
		form.reset({
			company_code: user?.company_code,
			...defaultFormValues,
			...pick(warehouse, ['warehouse_num', 'warehouse_name'])
		})
	}, [dialogTitle, defaultFormValues, open, warehouse])

	const { mutateAsync, isPending } = useMutation({
		mutationKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum],
		mutationFn: (payload: FormValues<typeof type>) => {
			switch (type) {
				case CommonActions.CREATE: {
					return WarehouseStorageService.createWarehouseStorage(payload)
				}
				case CommonActions.UPDATE: {
					return WarehouseStorageService.updateWarehouseStorage(defaultFormValues.storage_num, payload)
				}
				default: {
					throw new Error('Invalid actions')
				}
			}
		},
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			dispatch({ type: undefined })
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum] })
		},
		onError: (_data, _variables, context) => {
			toast.error(t('ns_common:notification.error'), { id: context })
		}
	})

	// const handleOpenStateChange = (open) => {
	// 	if (!open) dispatch({ type: undefined })
	// }

	return (
		<Dialog open={open} onOpenChange={() => dispatch({ type: undefined })}>
			<DialogContent className='w-full max-w-2xl bg-popover'>
				<DialogHeader>
					<DialogTitle className='lowercase first-letter:uppercase'>
						{t(dialogTitle, { ns: 'ns_warehouse', defaultValue: dialogTitle })}
					</DialogTitle>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit((data) => mutateAsync(data))}>
						<InputFieldControl
							placeholder='Some storage name ...'
							name='storage_name'
							control={form.control}
							label={t('ns_warehouse:fields.storage_name')}
						/>
						<SelectFieldControl
							name='type_storage'
							control={form.control}
							label={t('ns_warehouse:fields.type_storage')}
							options={Object.entries(warehouseStorageTypes).map(([key, value]) => ({
								label: t(value, { ns: 'ns_warehouse', defaultValue: value }),
								value: key
							}))}
						/>
						<TextareaFieldControl
							name='remark'
							label={t('ns_common:common_fields.remark')}
							placeholder='Aditional remark ...'
							control={form.control}
							rows={5}
						/>
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
const Form = tw.form`flex flex-col items-stretch gap-6`
// #endregion

export default WarehouseStorageFormDialog
