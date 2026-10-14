'use no memo'

import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { MultiSelectFieldControl } from '@components/forms/multi-select'
import { Button, buttonVariants } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, Form as FormProvider } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Separator } from '@components/ui/separator'
import { StockFlow } from '@features/finished-goods/constants/enums'
import { useGetScanningEpcs } from '@features/finished-goods/hooks/use-finished-goods-epc-request'
import { zodResolver } from '@hookform/resolvers/zod'
import { PopoverClose } from '@radix-ui/react-popover'
import { useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useDeleteEpcMutation } from '../../../hooks/use-inbound-request'
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
	const form = useForm({
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

	const handleDeleteEpcs = async (data) => {
		await deleteAsync(data)
		setOpen(false)
		form.reset()
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				className='opacity-0 group-hover/cell:opacity-100 data-[state=open]:opacity-100'
				onMouseEnter={() =>
					queryClient.query({
						queryKey: [
							'INBOUND_EPC_BY_SIZE',
							{
								['mo_no:eq']: data.mo_no,
								['size_numcode:eq']: data.size_numcode
							}
						]
					})
				}>
				<Icon className='stroke-destructive' name='Trash2' />
			</PopoverTrigger>
			<PopoverContent align='start' className='w-96' side='bottom'>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleDeleteEpcs)}>
						<MultiSelectFieldControl
							datalist={availableEpcs}
							label={t('ns_common:common_fields.quantity')}
							labelField='epc'
							loading={isLoading}
							maxCount={2}
							name='epcs'
							valueField='epc'
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
							<Button disabled={isPending} type='submit' variant='destructive'>
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
