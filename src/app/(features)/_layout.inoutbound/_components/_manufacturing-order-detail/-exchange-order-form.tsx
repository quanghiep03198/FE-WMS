import {
	Button,
	Checkbox,
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
import { useResetState } from 'ahooks'
import { pick, uniqBy } from 'lodash'
import { useEffect, useId, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useExchangeEpcMutation } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-exchange-form.context'
import { usePageContext } from '../../_contexts/-page-context'
import { ExchangeOrderFormValue, exchangeOrderSchema } from '../../_schemas/exchange-epc.schema'
import NoExchangeOrder from './-no-exchangable-order'

const ExchangeOrderFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const { scannedSizes } = usePageContext()
	const checkboxId = useId()
	const [isConfirmed, setIsConfirmed, resetConfirm] = useResetState<CheckedState>(false)
	const {
		exchangeOrderDialogOpen: open,
		setExchangeOrderDialogOpen: setOpen,
		defaultExchangeOrderFormValues: defaultValues
	} = useOrderDetailContext((state) =>
		pick(state, [
			'exchangeOrderDialogOpen',
			'defaultExchangeOrderFormValues',
			'setExchangeOrderDialogOpen',
			'setDefaultExchangeEpcFormValues'
		])
	)
	const form = useForm<ExchangeOrderFormValue>({
		resolver: zodResolver(exchangeOrderSchema)
	})

	const exchangableOrders = useMemo(() => {
		if (!Array.isArray(scannedSizes) || !defaultValues?.mo_no) return []
		const filteredOrderSizes = scannedSizes.filter((item) => item.mo_no === defaultValues.mo_no)
		return uniqBy(
			scannedSizes
				.filter((size) =>
					filteredOrderSizes.some(
						(item) =>
							item.mo_no !== size.mo_no &&
							item.mat_code === size.mat_code &&
							item.size_numcode === size.size_numcode
					)
				)
				.map((item) => item.mo_no),
			'mo_no'
		).map((item) => ({ label: item, value: item }))
	}, [scannedSizes, defaultValues])

	useEffect(() => {
		if (defaultValues) form.reset({ mo_no: defaultValues.mo_no, multi: true })
	}, [defaultValues])

	const { mutateAsync, isPending } = useExchangeEpcMutation()

	const handleExchangeEpc = async (data: ExchangeOrderFormValue) => {
		try {
			await mutateAsync({ ...data, multi: true })
			toast.success(t('ns_common:notification.success'))
			setOpen(!open)
			form.reset()
			resetConfirm()
		} catch (error) {
			toast.error(t('ns_common:notification.error'))
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='grid max-w-xl gap-6'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.exchange_epc')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.exchange_epc_dialog_desc')}</DialogDescription>
				</DialogHeader>
				{exchangableOrders.length === 0 ? (
					<NoExchangeOrder />
				) : (
					<FormProvider {...form}>
						<Form onSubmit={form.handleSubmit(handleExchangeEpc)}>
							<InputFieldControl name='mo_no' label={t('ns_erp:fields.mo_no')} disabled />
							<SelectFieldControl
								name='mo_no_actual'
								label={t('ns_erp:fields.mo_no_actual')}
								datalist={exchangableOrders}
								labelField='label'
								valueField='value'
								description={t('ns_inoutbound:description.transferred_order')}
							/>
							<Div className='space-y-4 py-4 shadow-sm'>
								<Div className='space-y-1.5 leading-none'>
									<Typography className='inline-flex items-center gap-x-2 font-semibold text-warning'>
										<Icon name='TriangleAlert' /> Caution
									</Typography>
									<Typography variant='small'>
										The action of swapping production orders cannot be undone. Please make sure to confirm
										your changes before proceeding.
										{/* 警告： 生产订单交换操作无法撤销。请在继续之前确认您的更改。 */}
										{/* Cảnh báo: Tác vụ hoán đổi chỉ lệnh sản xuất không thể hoàn tác. Vui lòng xác nhận các thay đổi của bạn trước khi tiếp tục. */}
									</Typography>
								</Div>
								<Separator />
								<Div className='inline-flex items-center gap-x-3'>
									<Checkbox
										id={checkboxId}
										checked={isConfirmed}
										onCheckedChange={(value) => setIsConfirmed(value)}
									/>
									<Label htmlFor={checkboxId}>I understand and want to proceed</Label>
								</Div>
							</Div>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant='secondary'>{t('ns_common:actions.cancel')}</Button>
								</DialogClose>
								<Button type='submit' disabled={!isConfirmed || isPending}>
									{isPending && (
										<Icon name='LoaderCircle' role='img' className='animate-[spin_1.5s_linear_infinite]' />
									)}
									{isPending ? t('ns_common:status.processing') : t('ns_common:actions.confirm')}
								</Button>
							</DialogFooter>
						</Form>
					</FormProvider>
				)}
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form`flex flex-col items-stretch gap-6`

export default ExchangeOrderFormDialog
