'use no memo'

import { StockFlow } from '@/features/finished-goods/constants/enums'
import { useGetScanningEpcs } from '@/features/finished-goods/hooks/use-finished-goods-epc-request'
import { cn } from '@common/utils/cn'
import {
	Button,
	buttonVariants,
	Checkbox,
	Div,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Form as FormProvider,
	Icon,
	MultiSelectFieldControl,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator
} from '@components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { PopoverClose } from '@radix-ui/react-popover'
import { useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useDeleteEpcMutation } from '../../../hooks/use-inbound-request'
import type { DeleteScannedEpcsFormValues } from '../../../schemas/delete-epc.schema'
import { deleteScannedEpcsSchema } from '../../../schemas/delete-epc.schema'

type DeleteSizePopoverProps = {
	data: {
		mo_no: string
		size_numcode: string
	}
}

const DeleteSizePopover: React.FC<DeleteSizePopoverProps> = ({ data }) => {
	const { t } = useTranslation()
	const [open, setOpen] = useState<boolean>(false)
	const form = useForm<DeleteScannedEpcsFormValues>({
		resolver: zodResolver(deleteScannedEpcsSchema),
		mode: 'onSubmit',
		reValidateMode: 'onChange'
	})

	const queryClient = useQueryClient()
	const { data: availableEpcs, isLoading } = useGetScanningEpcs(
		StockFlow.INBOUND,
		{
			['mo_no:eq']: data.mo_no,
			['size_numcode:eq']: data.size_numcode
		},
		{ enabled: open }
	)

	const { mutateAsync: deleteAsync, isPending } = useDeleteEpcMutation()

	const handleDeleteEpcs = async (data: DeleteScannedEpcsFormValues) => {
		const id = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await deleteAsync(data)
			toast.success(t('ns_common:notification.success'), { id })
			setOpen(false)
			form.reset()
		} catch (e) {
			toast.error(e.message, { id })
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				className='opacity-0 group-hover/cell:opacity-100 data-[state=open]:opacity-100'
				onMouseEnter={() =>
					queryClient.prefetchQuery({
						queryKey: [
							'INBOUND_EPC_BY_SIZE',
							{
								['mo_no:eq']: data.mo_no,
								['size_numcode:eq']: data.size_numcode
							}
						]
					})
				}>
				<Icon name='Trash2' className='stroke-destructive' />
			</PopoverTrigger>
			<PopoverContent className='w-96' side='bottom' align='start'>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleDeleteEpcs)}>
						<MultiSelectFieldControl
							name='epcs'
							label={t('ns_common:common_fields.quantity')}
							datalist={availableEpcs}
							labelField='epc'
							valueField='epc'
							loading={isLoading}
							maxCount={2}
						/>
						<FormField
							control={form.control}
							name='rescannable'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-y-0 space-x-3'>
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<Div className='space-y-1.5 leading-none'>
										<FormLabel>{t('ns_inoutbound:labels.delete_and_unscannable')}</FormLabel>
									</Div>
								</FormItem>
							)}
						/>
						<Separator />
						<Div className='flex items-center justify-end gap-x-1'>
							<Button variant='destructive' type='submit' disabled={isPending}>
								{t('ns_common:actions.delete')}
							</Button>
							<PopoverClose
								type='button'
								className={cn(
									buttonVariants({
										variant: 'outline'
									})
								)}>
								{t('ns_common:actions.cancel')}
							</PopoverClose>
						</Div>
					</Form>
				</FormProvider>
			</PopoverContent>
		</Popover>
	)
}

const Form = tw.form`flex flex-col items-stretch gap-y-6 w-full`

export default DeleteSizePopover
