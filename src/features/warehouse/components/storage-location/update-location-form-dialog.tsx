'use no memo'

import { CommonActions } from '@common/constants/enums'
import { InputFieldControl } from '@components/forms/input'
import { Button } from '@components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@components/ui/dialog'
import { FieldGroup } from '@components/ui/field'
import { FormItem, Form as FormProvider } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { useStorageLocationPageContext } from '@features/warehouse/contexts/storage-location-page-context'
import { useUpdateStorageMutation } from '@features/warehouse/hooks/use-warehouse-storage-request'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from '@tanstack/react-router'
import { capitalize } from 'lodash-es'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { updateStorageLocationSchema } from '../../schemas/storage-location.schema'

const UpdateLocationFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const warehouseId = useParams({
		from: '/(features)/_layout/(warehouse)/storage-locations/$warehouseId',
		select: (params) => params.warehouseId
	})

	const { event$ } = useStorageLocationPageContext()

	const form = useForm({
		resolver: zodResolver(updateStorageLocationSchema)
	})

	event$.useSubscription(({ action, payload }) => {
		if (action !== CommonActions.UPDATE) return
		form.reset(payload)
		setOpen(true)
	})

	const [open, setOpen] = useState<boolean>(false)
	const { mutateAsync, isPending } = useUpdateStorageMutation(warehouseId)

	const formSubmitHandler = async (data) => {
		await mutateAsync(data)
		setOpen((prev) => !prev)
	}

	return (
		<Dialog
			open={open || isPending}
			onOpenChange={(open) => {
				setOpen(open)
				if (!open) form.reset()
			}}>
			<DialogContent className='bg-popover w-full max-w-xl'>
				<DialogHeader>
					<DialogTitle className='lowercase first-letter:uppercase'>
						{t('ns_warehouse:form.update_storage_location_title')}
					</DialogTitle>
				</DialogHeader>
				<FormProvider {...form}>
					<form className='space-y-6' onSubmit={form.handleSubmit(formSubmitHandler)}>
						<FieldGroup>
							<FormItem>
								<Label>{t('ns_warehouse:fields.warehouse_name')}</Label>
								<Input disabled value={warehouseId} />
							</FormItem>
							<InputFieldControl
								label={t('ns_warehouse:fields.storage_name')}
								name='name'
								placeholder={capitalize(
									t('ns_common:form_placeholder.fill', {
										object: t('ns_warehouse:fields.storage_name')
									})
								)}
							/>
						</FieldGroup>
						<DialogFooter className='col-span-full'>
							<DialogClose asChild>
								<Button type='button' variant='outline' onClick={() => form.reset()}>
									{t('ns_common:actions.cancel')}
								</Button>
							</DialogClose>
							<Button disabled={isPending} type='submit'>
								{isPending && <Icon className='animate-spin' name='LoaderCircle' />}
								{t('ns_common:actions.submit')}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

export default UpdateLocationFormDialog
