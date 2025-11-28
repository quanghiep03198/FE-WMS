'use no memo'

import { useGetCommandNumberDetailQuery, useSearchCommandNumberQuery } from '@/app/(features)/-hooks/use-order-asm'
import { FALLBACK_VALUE } from '@/common/constants/constants'
import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Checkbox,
	ComboboxFieldControl,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Div,
	Form as FormProvider,
	Icon,
	Label,
	SelectFieldControl,
	Separator,
	Typography
} from '@/components/ui'
import { InputFieldControl } from '@/components/ui/@field-control/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useResetState } from 'ahooks'
import { omit } from 'lodash-es'
import { useEffect, useId, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useOrderDetailContext } from '../../-contexts/order-detail-context'
import { useUpsertEpcInfoMutation } from '../../-hooks/use-rfid-inbound-asm'
import { updateEpcFormSchema, UpdateEpcFormValues } from '../../-schemas/fill-epc-data.schema'

const DEFAULT_FORM_VALUES: UpdateEpcFormValues = {
	mo_no: FALLBACK_VALUE,
	mo_no_actual: '',
	color_sn: FALLBACK_VALUE,
	color_sn_actual: '',
	factory_shoes_style: FALLBACK_VALUE,
	factory_shoes_style_actual: '',
	mo_noseq: '',
	size_numcode: FALLBACK_VALUE,
	size_numcode_actual: '',
	size_qty: 0,
	cust_shoes_style: '',
	mat_code: '',
	or_cust_po: '',
	or_no: '',
	quantity: 0,
	size_code: ''
}

const FillEpcDataFormDialog: React.FC<any> = () => {
	const { t } = useTranslation()
	const [searchTerm, setSearchTerm, resetSearchTerm] = useResetState<string>('')
	const [availableSizes, setAvailableSizes] = useState([])
	const [availableCmdSequence, setAvailableCmdSequence] = useState([])
	const [isConfirmed, setIsConfirmed, resetConfirmation] = useResetState<CheckedState>(false)
	const { fillEpcDataDialogOpen, setFillEpcDataDialogOpen } = useOrderDetailContext(
		'fillEpcDataDialogOpen',
		'setFillEpcDataDialogOpen'
	)
	const form = useForm<UpdateEpcFormValues>({
		resolver: zodResolver(updateEpcFormSchema),
		defaultValues: DEFAULT_FORM_VALUES
	})
	const checkboxId = useId()
	const currCommandNumber = useWatch({ control: form.control, name: 'mo_no_actual' })
	const currCommandNumberSeq = useWatch({ control: form.control, name: 'mo_noseq' })
	const currentSizeQty = useWatch({ control: form.control, name: 'size_qty' })

	const { data: commandNumbers } = useSearchCommandNumberQuery(searchTerm)
	const { data: orderDetail } = useGetCommandNumberDetailQuery(currCommandNumber)
	const { mutateAsync } = useUpsertEpcInfoMutation()

	useEffect(() => {
		if (orderDetail && orderDetail.orders && orderDetail.sizes) {
			setAvailableSizes(orderDetail.sizes)
			setAvailableCmdSequence(
				orderDetail.orders.map((item) => ({
					label: item.mo_noseq,
					value: item.mo_noseq
				}))
			)
		}
	}, [orderDetail])

	useEffect(() => {
		const currOrderInfo = orderDetail?.orders?.find((item) => item?.mo_noseq === currCommandNumberSeq)
		if (currOrderInfo) {
			form.reset({
				...omit(currOrderInfo, ['mo_no', 'color_sn', 'factory_shoes_style']),
				...form.getValues(),
				mo_no: FALLBACK_VALUE,
				factory_shoes_style: FALLBACK_VALUE,
				color_sn: FALLBACK_VALUE,
				size_numcode: FALLBACK_VALUE,
				mo_no_actual: currOrderInfo.mo_no,
				color_sn_actual: currOrderInfo.color_sn,
				factory_shoes_style_actual: currOrderInfo.factory_shoes_style
			})
		}
	}, [currCommandNumberSeq])

	const handleCombineEpcInfo = async (data: UpdateEpcFormValues) => {
		const id = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync({ ...data, mo_no: FALLBACK_VALUE })
			toast.success(t('ns_common:notification.success'), { id })
			setFillEpcDataDialogOpen(false)
			form.reset(DEFAULT_FORM_VALUES)
		} catch {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	const handleDialogOpenChange = (open: boolean) => {
		setFillEpcDataDialogOpen(open)
		if (!open) {
			resetConfirmation()
			resetSearchTerm()
		}
	}

	return (
		<Dialog open={fillEpcDataDialogOpen} onOpenChange={handleDialogOpenChange}>
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle>{t('ns_erp:rfid_match_craft_form.title')}</DialogTitle>
					<DialogDescription>{t('ns_erp:rfid_match_craft_form.description')}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleCombineEpcInfo)}>
						<ComboboxFieldControl
							name='mo_no_actual'
							label={t('ns_erp:fields.mo_no_actual')}
							datalist={commandNumbers}
							labelField='mo_no'
							valueField='mo_no'
							onInput={setSearchTerm}
							onSelect={(value) => form.reset({ mo_no_actual: value })}
						/>
						<SelectFieldControl
							label={t('ns_erp:fields.mo_noseq')}
							name='mo_noseq'
							datalist={availableCmdSequence}
							labelField='label'
							valueField='value'
						/>
						<InputFieldControl
							label={t('ns_erp:fields.factory_shoes_style')}
							placeholder={t('ns_erp:fields.factory_shoes_style')}
							name='factory_shoes_style_actual'
							readOnly={true}
						/>
						<InputFieldControl
							label={t('ns_erp:fields.color_sn')}
							name='color_sn_actual'
							placeholder={t('ns_erp:fields.color_sn')}
							readOnly={true}
						/>
						<SelectFieldControl
							label='Size'
							name='size_numcode_actual'
							datalist={availableSizes}
							labelField='size_numcode'
							valueField='size_numcode'
							onValueChange={(value) => {
								const selectedSize = availableSizes.find((size) => size.size_numcode === value)
								form.reset({ ...form.getValues(), size_qty: selectedSize?.size_qty ?? 0 })
							}}
						/>
						<InputFieldControl
							label={t('ns_common:common_fields.quantity_with_limit', {
								limit: currentSizeQty ?? 0,
								defaultValue: null
							})}
							name='quantity'
							type='number'
							placeholder='0'
						/>
						<Div className='col-span-full space-y-4'>
							<Div className='flex flex-col space-y-1.5 leading-none'>
								<Typography className='inline-flex items-center gap-x-2 font-semibold text-warning'>
									<Icon name='TriangleAlert' /> {t('ns_common:titles.caution')}
								</Typography>
								<Typography variant='small' className='text-pretty'>
									{t('ns_inoutbound:notification.exchange_order_caution')}
								</Typography>
							</Div>
							<Separator />
							<Div className='inline-flex items-center gap-x-2'>
								<Checkbox
									id={checkboxId}
									checked={isConfirmed}
									onCheckedChange={(value) => setIsConfirmed(value)}
								/>
								<Label htmlFor={checkboxId}>{t('ns_common:confirmation.understand_and_proceed')}</Label>
							</Div>
						</Div>
						<DialogFooter className='col-span-full'>
							<DialogClose
								type='button'
								className={cn(buttonVariants({ variant: 'secondary' }))}
								onClick={() => {
									form.reset(DEFAULT_FORM_VALUES)
									form.clearErrors()
								}}>
								{t('ns_common:actions.cancel')}
							</DialogClose>
							<Button type='submit' disabled={!isConfirmed}>
								{t('ns_common:actions.proceed')}
							</Button>
						</DialogFooter>
					</Form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form`grid grid-cols-2 gap-y-6 gap-x-2`

export default FillEpcDataFormDialog
