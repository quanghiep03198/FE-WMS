import { warehouseStorageTypes } from '@/common/constants/constants'
import { CommonActions } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import { IWarehouseStorageArea } from '@/common/types/entities'
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
import { PartialStorageFormValue, StorageFormValue, storageFormSchema } from '@/schemas/warehouse.schema'
import { WarehouseService } from '@/services/warehouse.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useDeepCompareEffect } from 'ahooks'
import _ from 'lodash'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { type TAction, type TFormAction } from '../../_reducers/-form.reducer'
import { WarehouseStorageService } from '@/services/warehouse-storage.service'
import React from 'react'

export type FormValues<T> = Pick<IWarehouseStorageArea, 'storage_num'> &
	(T extends CommonActions.CREATE
		? Required<StorageFormValue>
		: T extends CommonActions.UPDATE
			? PartialStorageFormValue
			: {})

type FormAction = TFormAction<FormValues<TAction>>

const WarehouseStorageFormDialog = (props: {
	open: boolean
	title: string
	type: TAction
	defaultValues: FormValues<typeof props.type>
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
	onFormActionChange: React.Dispatch<FormAction>
}) => {
	const { open, title, type, defaultValues, onOpenChange, onFormActionChange } = props

	const { warehouseNum } = useParams({ strict: false })
	const { t } = useTranslation()
	const { userCompany } = useAuth()
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
			company_code: userCompany,
			...defaultValues,
			..._.pick(warehouse, ['warehouse_num', 'warehouse_name'])
		})
	}, [type, defaultValues, open, warehouse])

	const { mutateAsync } = useMutation({
		mutationKey: ['warehouse-storage', warehouseNum],
		mutationFn: (payload: FormValues<typeof type>) => {
			switch (type) {
				case CommonActions.CREATE:
					return WarehouseStorageService.createWarehouseStorage(payload)
				case CommonActions.UPDATE:
					return WarehouseStorageService.updateWarehouseStorage(defaultValues.storage_num, payload)
				default:
					throw new Error('Invalid actions')
			}
		},
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			onOpenChange(!open)
			onFormActionChange({ type: undefined })
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: ['warehouse-storage', warehouseNum] })
		},
		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})

	const handleOpenStateChange = (open) => {
		if (!open) onFormActionChange({ type: undefined })
		onOpenChange(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenStateChange}>
			<DialogContent className='w-full max-w-2xl bg-popover'>
				<DialogHeader>
					<DialogTitle className='lowercase first-letter:uppercase'>
						{t(title, { ns: 'ns_warehouse', defaultValue: title })}
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
							options={Object.entries(warehouseStorageTypes).map(([key, value]) => ({
								label: t(value, { ns: 'ns_warehouse', defaultValue: value }),
								value: key
							}))}
							name='type_storage'
							control={form.control}
							label={t('ns_warehouse:fields.type_storage')}
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

const Form = tw.form`flex flex-col items-stretch gap-6`

export default WarehouseStorageFormDialog
