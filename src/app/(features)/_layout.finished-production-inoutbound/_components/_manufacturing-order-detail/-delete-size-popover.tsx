'use no memo'

import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Checkbox,
	Div,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { PopoverClose } from '@radix-ui/react-popover'
import { usePrevious } from 'ahooks'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useDeleteEpcMutation } from '../../_apis/rfid.api'
import { DeleteScannedEpcsFormValues, deleteScannedEpcsSchema } from '../../_schemas/delete-epc.schema'

type DeleteSizePopoverProps = {
	data: {
		mo_no: string
		mat_code: string
		size_numcode: string
		quantity: number
	}
}

const DeleteSizePopover: React.FC<DeleteSizePopoverProps> = ({ data }) => {
	const { t } = useTranslation()
	const [open, setOpen] = useState<boolean>(false)
	const form = useForm<DeleteScannedEpcsFormValues>({
		resolver: zodResolver(deleteScannedEpcsSchema),
		mode: 'onChange'
	})

	const { mutateAsync: deleteAsync, isPending } = useDeleteEpcMutation()

	const isDeleteAll = form.watch('delete_all')
	const quantity = form.watch('quantity')
	const prevQuantity = usePrevious(quantity)

	useEffect(() => {
		form.reset({ ...data, max_quantity: data.quantity })
	}, [data])

	useEffect(() => {
		if (isDeleteAll) form.setValue('quantity', data.quantity)
		else form.setValue('quantity', prevQuantity)
	}, [isDeleteAll])

	const handleDeleteEpcs = async (data: DeleteScannedEpcsFormValues) => {
		const id = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await deleteAsync({
				['mo_no.eq']: data.mo_no,
				['size_numcode.eq']: data.size_numcode,
				['quantity.eq']: data.quantity
			})
			toast.success(t('ns_common:notification.success'), { id })
			setOpen(false)
		} catch (e) {
			toast.error(e.message, { id })
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger className='peer opacity-0 group-hover/cell:opacity-100 data-[state=open]:opacity-100'>
				<Icon name='Trash2' className='stroke-destructive' />
			</PopoverTrigger>
			<PopoverContent className='w-96' side='bottom' align='start'>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleDeleteEpcs)}>
						<InputFieldControl name='quantity' type='number' label={t('ns_common:common_fields.quantity')} />
						<FormField
							control={form.control}
							name='delete_all'
							render={({ field }) => (
								<FormItem className='col-span-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm'>
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<Div className='space-y-1.5 leading-none'>
										<FormLabel>{t('ns_inoutbound:labels.delete_all')}</FormLabel>
										<FormDescription>
											{t('ns_inoutbound:notification.confirm_delete_all_mono.description')}
										</FormDescription>
									</Div>
								</FormItem>
							)}
						/>
						<Div className='flex items-center justify-end gap-x-2'>
							<PopoverClose
								type='button'
								className={cn(
									buttonVariants({
										variant: 'outline'
									})
								)}>
								{t('ns_common:actions.cancel')}
							</PopoverClose>
							<Button variant='destructive' type='submit' disabled={isPending}>
								{t('ns_common:actions.delete')}
							</Button>
						</Div>
					</Form>
				</FormProvider>
			</PopoverContent>
		</Popover>
	)
}

const Form = tw.form`grid items-stretch gap-y-6`

export default DeleteSizePopover
