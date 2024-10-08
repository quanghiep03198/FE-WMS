import {
	Button,
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
	Separator,
	Typography
} from '@/components/ui'
import { InputFieldControl } from '@/components/ui/@hook-form/input-field-control'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useResetState } from 'ahooks'
import { debounce, pick } from 'lodash'
import { useEffect, useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useExchangeEpcMutation, useSearchExchangableOrderQuery } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-exchange-form.context'
import { ExchangeOrderFormValue, exchangeOrderSchema } from '../../_schemas/exchange-epc.schema'

const ExchangeOrderFormDialog: React.FC = () => {
	const { t } = useTranslation()
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

	// const exchangableOrders = useMemo(() => {
	// 	if (!Array.isArray(scannedSizes) || !defaultValues?.mo_no) return []
	// 	const filteredOrderSizes = scannedSizes.filter((item) => item.mo_no === defaultValues?.mo_no)
	// 	return uniqBy(
	// 		scannedSizes
	// 			.filter((size) =>
	// 				filteredOrderSizes.some(
	// 					(item) =>
	// 						item.mo_no !== size.mo_no &&
	// 						item.mat_code === size.mat_code &&
	// 						item.size_numcode === size.size_numcode
	// 				)
	// 			)
	// 			.map((item) => item.mo_no),
	// 		'mo_no'
	// 	).map((item) => ({ label: item, value: item }))
	// }, [scannedSizes, defaultValues])

	useEffect(() => {
		if (defaultValues) form.reset({ mo_no: defaultValues?.mo_no, multi: true })
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

				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleExchangeEpc)}>
						<InputFieldControl name='mo_no' label={t('ns_erp:fields.mo_no')} disabled />
						<OrderSearchFieldControl targetOrderRef={defaultValues?.mo_no} />
						<Div className='space-y-4 py-4 shadow-sm'>
							<Div className='space-y-1.5 leading-none'>
								<Typography className='inline-flex items-center gap-x-2 font-semibold text-warning'>
									<Icon name='TriangleAlert' /> {t('ns_common:titles.caution')}
								</Typography>
								<Typography variant='small'>
									{t('ns_inoutbound:notification.exchange_order_caution')}
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
								<Label htmlFor={checkboxId}>{t('ns_common:confirmation.understand_and_proceed')}</Label>
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
			</DialogContent>
		</Dialog>
	)
}

const OrderSearchFieldControl: React.FC<{ targetOrderRef: string }> = ({ targetOrderRef }) => {
	const { t } = useTranslation()
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { data, refetch, isLoading } = useSearchExchangableOrderQuery(targetOrderRef, searchTerm)

	console.log(data)

	useEffect(() => {
		refetch()
	}, [searchTerm])

	return (
		<ComboboxFieldControl
			name='mo_no_actual'
			label={t('ns_erp:fields.mo_no_actual')}
			datalist={data}
			shouldFilter={false}
			loading={isLoading}
			onInput={debounce((value) => setSearchTerm(value), 200)}
			labelField='mo_no'
			valueField='mo_no'
			description={t('ns_inoutbound:description.transferred_order')}
		/>
	)
}

const Form = tw.form`flex flex-col items-stretch gap-6`

export default ExchangeOrderFormDialog
