'use no memo'

import { useGetCommandNumberDetailQuery, useSearchCommandNumberQuery } from '@/app/(features)/_apis/use-order.api'
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
import { InputFieldControl } from '@/components/ui/@hook-form/input-field-control'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useEffect, useId, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useCombineEpcInfoMutation } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { EpcCombinationFormValues, epcCombinationSchema } from '../../_schemas/epc-combination.schema'

const DEFAULT_FORM_VALUES = {
	mo_no: '',
	mat_code: '',
	shoes_style_code_factory: '',
	mo_noseq: '',
	size_numcode: '',
	size_qty: 0,
	quantity: null
}

const CraftEpcInfoDialog: React.FC<any> = () => {
	const { t } = useTranslation()
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [availableSizes, setAvailableSizes] = useState([])
	const [availableCmdSequence, setAvailableCmdSequence] = useState([])
	const [isConfirmed, setIsConfirmed] = useState<CheckedState>(false)
	const { craftEpcInfoDialogOpen, setCraftEpcInfoDialogOpen } = useOrderDetailContext(
		'craftEpcInfoDialogOpen',
		'setCraftEpcInfoDialogOpen'
	)
	const form = useForm<EpcCombinationFormValues>({
		resolver: zodResolver(epcCombinationSchema),
		defaultValues: DEFAULT_FORM_VALUES
	})
	const checkboxId = useId()
	const currentCommandNumber = useWatch({ control: form.control, name: 'mo_no' })
	const currentSizeQty = useWatch({ control: form.control, name: 'size_sumqty' })

	const { data: commandNumbers } = useSearchCommandNumberQuery(searchTerm)
	const { data: orderDetail } = useGetCommandNumberDetailQuery(currentCommandNumber)
	const { mutateAsync } = useCombineEpcInfoMutation()

	useEffect(() => {
		if (orderDetail) {
			form.reset({
				...form.getValues(),
				...orderDetail
			})
			setAvailableSizes(orderDetail.sizes)
			setAvailableCmdSequence(
				orderDetail.mo_noseqs.map((item) => ({
					label: item,
					value: item
				}))
			)
		}
	}, [orderDetail])

	const handleCombineEpcInfo = async (data: EpcCombinationFormValues) => {
		const id = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(data)
			toast.success(t('ns_common:notification.success'), { id })
			setCraftEpcInfoDialogOpen(false)
		} catch {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	return (
		<Dialog open={craftEpcInfoDialogOpen} onOpenChange={setCraftEpcInfoDialogOpen}>
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle>{t('ns_erp:rfid_match_craft_form.title')}</DialogTitle>
					<DialogDescription>{t('ns_erp:rfid_match_craft_form.description')}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleCombineEpcInfo)}>
						<ComboboxFieldControl
							name='mo_no'
							label={t('ns_erp:fields.mo_no_actual')}
							datalist={commandNumbers}
							labelField='mo_no'
							valueField='mo_no'
							onInput={setSearchTerm}
						/>
						<InputFieldControl
							label={t('ns_erp:fields.mat_code')}
							name='mat_code'
							placeholder={t('ns_erp:fields.mat_code')}
							readOnly={true}
						/>
						<InputFieldControl
							label={t('ns_erp:fields.shoestyle_codefactory')}
							placeholder={t('ns_erp:fields.shoestyle_codefactory')}
							name='shoes_style_code_factory'
							readOnly={true}
						/>
						<SelectFieldControl
							label={t('ns_erp:fields.mo_noseq')}
							name='mo_noseq'
							datalist={availableCmdSequence}
							labelField='label'
							valueField='value'
						/>
						<SelectFieldControl
							label='Size'
							name='size_numcode'
							datalist={availableSizes}
							labelField='size_numcode'
							valueField='size_numcode'
							onValueChange={(value) => {
								const selectedSize = availableSizes.find((size) => size.size_numcode === value)
								form.reset({ ...form.getValues(), size_sumqty: selectedSize?.size_qty ?? 0 })
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
							<Div className='space-y-1.5 leading-none'>
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

export default CraftEpcInfoDialog
