import { CommonActions } from '@common/constants/enums'
import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Form as FormProvider,
	InputFieldControl
} from '@components/ui'
import { useWarehousePageContext } from '@features/warehouse/contexts/warehouse-page-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useResetState } from 'ahooks'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useCreateOrUpdateWarehouseMutation } from '../../hooks/use-warehouse-request'
import type { CreateWarehouseFormValue, UpdateWarehouseFormValue } from '../../schemas/warehouse.schema'
import {
	type CreateWarehouseFormSchema,
	type UpdateWarehouseFormSchema,
	createWarehouseFormSchema,
	updateWarehouseFormSchema
} from '../../schemas/warehouse.schema'

const WarehouseFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const [action, setAction, resetAction] = useResetState<CommonActions.CREATE | CommonActions.UPDATE | 'none'>('none')
	const [dialogTitle, setDialogTitle] = useState<string>(t('ns_warehouse:form.add_warehouse_title'))
	const { event$ } = useWarehousePageContext()

	const formSchemaRef = useRef<CreateWarehouseFormSchema | UpdateWarehouseFormSchema>(createWarehouseFormSchema)

	const form = useForm({
		resolver: zodResolver(formSchemaRef.current)
	})

	// Create/Update action
	const { mutateAsync, isPending } = useCreateOrUpdateWarehouseMutation(action)

	event$.useSubscription(({ action, payload }) => {
		setAction(action)
		if (action === CommonActions.CREATE) {
			setDialogTitle(t('ns_warehouse:form.add_warehouse_title'))
			formSchemaRef.current = createWarehouseFormSchema
			form.reset()
		} else if (action === CommonActions.UPDATE) {
			setDialogTitle(t('ns_warehouse:form.update_warehouse_title'))
			formSchemaRef.current = updateWarehouseFormSchema
			form.reset(payload)
		} else {
			form.reset()
		}
	})

	const handleSubmit = async (data) => {
		await mutateAsync(data as CreateWarehouseFormValue & UpdateWarehouseFormValue)
		resetAction()
		form.reset()
	}

	return (
		<Dialog
			open={action !== 'none'}
			onOpenChange={(open) => {
				if (!open) form.reset()
			}}>
			<DialogContent className='bg-popover w-full max-w-xl'>
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleSubmit)}>
						<FormItem>
							<InputFieldControl
								placeholder='A1'
								name='name'
								label={t('ns_warehouse:fields.warehouse_name')}
								className='uppercase'
							/>
						</FormItem>
						<FormItem>
							<InputFieldControl
								placeholder='30,000'
								name='capacity'
								type='number'
								step={1}
								label={t('ns_warehouse:fields.storage_capacity')}
							/>
						</FormItem>
						{/* Form actions */}
						<DialogFooter className='col-span-full'>
							<Button
								type='button'
								variant='outline'
								onClick={() => {
									form.reset()
									resetAction()
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

const Form = tw.form`flex flex-col gap-y-6`
const FormItem = tw.div`col-span-1 sm:col-span-full md:col-span-full`

export default WarehouseFormDialog
