import { useGetCommandNumberDetailQuery, useSearchCommandNumberQuery } from '@/app/(features)/_apis/use-order.api'
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
	DivProps,
	FormDescription,
	FormLabel,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	SelectFieldControl,
	Typography,
	TypographyProps
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { usePrevious } from 'ahooks'
import { debounce, uniqBy } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useCombineEpcInfoMutation } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { usePageContext } from '../../_contexts/-page-context'
import { ExchangeEpcFormValue, exchangeEpcSchema } from '../../_schemas/exchange-epc.schema'

const ExchangeEpcFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const { scannedOrders, connection } = usePageContext('scannedOrders', 'connection')
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [availableCmdSequence, setAvailableCmdSequence] = useState([])
	const [isExchangeAll, setIsExchangeAll] = useState<CheckedState>(false)
	const { mutateAsync, isPending, isError } = useCombineEpcInfoMutation()

	const {
		exchangeEpcDialogOpen: open,
		defaultExchangeEpcFormValues: defaultValues,
		setExchangeEpcDialogOpen: setOpen,
		resetSelectedRows
	} = useOrderDetailContext(
		'exchangeEpcDialogOpen',
		'defaultExchangeEpcFormValues',
		'setExchangeEpcDialogOpen',
		'resetSelectedRows'
	)
	const form = useForm<ExchangeEpcFormValue>({
		resolver: zodResolver(exchangeEpcSchema),
		reValidateMode: 'onChange',
		criteriaMode: 'all',
		mode: 'onChange'
	})
	const quantity = useWatch({ control: form.control, name: 'quantity' })
	const actualOrder = useWatch({ control: form.control, name: 'mo_no_actual' })
	const scannedSizeQuantity = useWatch({ control: form.control, name: 'scanned_size_qty' })

	const previousQuantity = usePrevious(quantity)
	const { data: availableCommandNumbers, refetch: fetchExchangableOrder } = useSearchCommandNumberQuery(searchTerm)
	const { data: orderDetail } = useGetCommandNumberDetailQuery(actualOrder)

	const exchangableOrders = useMemo(() => {
		return uniqBy(
			scannedOrders.filter(
				(item) => item.mo_no !== defaultValues?.mo_no && item.mat_ecolor === defaultValues?.mat_ecolor
			),
			'mo_no'
		)
	}, [defaultValues])

	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		form.reset(defaultValues)
	}, [defaultValues])

	useEffect(() => {
		if (!connection || !defaultValues) return
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => fetchExchangableOrder(), 200)
		return () => {
			clearTimeout(timeoutRef.current)
		}
	}, [searchTerm, connection])

	useEffect(() => {
		if (orderDetail && orderDetail.orders && orderDetail.sizes) {
			setAvailableCmdSequence(
				orderDetail.orders.map((item) => ({
					label: item.mo_noseq,
					value: item.mo_noseq
				}))
			)
			const matchedSize = orderDetail.sizes.find((item) => item.size_numcode === defaultValues?.size_numcode)
			form.setValue('size_numcode_match', matchedSize?.size_numcode ?? 'N/A')
			form.setValue('size_qty', matchedSize?.size_qty ?? 0)
		}
	}, [orderDetail])

	const handleSelectSubCommandNumber = (value: string) => {
		const currOrderInfo = orderDetail?.orders?.find((item) => item?.mo_noseq === value)
		if (currOrderInfo) {
			form.reset({
				...form.getValues(),
				mat_code: currOrderInfo.mat_code,
				mo_no_actual: currOrderInfo.mo_no,
				mat_ecolor_match: currOrderInfo.mat_ecolor,
				or_cust_po: currOrderInfo.or_cust_po,
				or_no: currOrderInfo.or_no,
				cust_shoes_style: currOrderInfo.cust_shoes_style,
				shoes_style_code_factory_match: currOrderInfo.shoes_style_code_factory,
				size_code: currOrderInfo.size_code
			})
		}
	}

	const handleToggleSelectAll = (checked: CheckedState) => {
		setIsExchangeAll(checked)
		if (checked) form.setValue('quantity', defaultValues?.scanned_size_qty ?? 0)
		else form.setValue('quantity', previousQuantity ?? 0)
	}

	const handleExchangeEpc = async (data: ExchangeEpcFormValue) => {
		try {
			await mutateAsync({
				mat_code: data.mat_code,
				mo_no: data.mo_no,
				mo_no_actual: data.mo_no_actual,
				or_no: data.or_no,
				mo_noseq: data.mo_noseq,
				or_cust_po: data.or_cust_po,
				shoes_style_code_factory: data.shoes_style_code_factory,
				cust_shoes_style: data.cust_shoes_style,
				size_numcode: data.size_numcode,
				size_code: data.size_code,
				size_qty: data.size_qty,
				quantity: data.quantity
			})
			toast.success(t('ns_common:notification.success'))
			resetSelectedRows()
			setOpen(!open)
		} catch {
			toast.error(t('ns_common:notification.error'))
		}
	}

	useEffect(() => {
		console.log('form values :>>', form.getValues())
	}, [form])

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open)
			}}>
			<DialogContent className='grid max-w-3xl gap-6'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.exchange_epc')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.exchange_epc_dialog_desc')}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleExchangeEpc)}>
						<ScrollShadow className='grid max-h-[70vh] grid-cols-6 gap-x-2 gap-y-10 py-4 !scrollbar-none xxl:max-h-[90vh]'>
							<Fieldset as='fieldset'>
								<Legend as='legend'>{t('ns_common:titles.original_data')}</Legend>
								<InputFieldControl label={t('ns_erp:fields.mo_no')} name='mo_no' readOnly={true} />
								<InputFieldControl label={t('ns_erp:fields.mat_ecolor')} name='mat_ecolor' readOnly={true} />
								<InputFieldControl
									label={t('ns_erp:fields.shoestyle_codefactory')}
									name='shoes_style_code_factory'
									readOnly={true}
								/>
								<InputFieldControl label='Size' name='size_numcode' readOnly={true} />
							</Fieldset>
							<Fieldset as='fieldset'>
								<Legend className='inline-flex items-center gap-x-2'>
									{t('ns_common:titles.target_data')}
								</Legend>
								<ComboboxFieldControl
									name='mo_no_actual'
									label={t('ns_erp:fields.mo_no_actual')}
									datalist={uniqBy([...exchangableOrders, ...(availableCommandNumbers ?? [])], 'mo_no')}
									labelField='mo_no'
									valueField='mo_no'
									onInput={debounce((value) => setSearchTerm(value), 200)}
									onSelect={(value) => {
										form.reset({
											...form.getValues(),
											mo_no_actual: value,
											mo_noseq: '',
											mat_code: '',
											shoes_style_code_factory_match: '',
											mat_ecolor_match: '',
											size_numcode_match: ''
										})
									}}
									shouldFilter={false}
								/>
								<SelectFieldControl
									name='mo_noseq'
									label={t('ns_erp:fields.mo_noseq')}
									datalist={availableCmdSequence}
									labelField='label'
									valueField='value'
									onValueChange={handleSelectSubCommandNumber}
								/>
								<InputFieldControl
									label={t('ns_erp:fields.shoestyle_codefactory')}
									name='shoes_style_code_factory_match'
									placeholder='XX01 XX01-1'
									readOnly={true}
								/>
								<InputFieldControl
									label={t('ns_erp:fields.mat_ecolor')}
									name='mat_ecolor_match'
									placeholder='Black'
									readOnly={true}
								/>
								<InputFieldControl label='Size' name='size_numcode_match' placeholder='10' readOnly={true} />
								<InputFieldControl
									autoComplete='off'
									name='quantity'
									label={t('ns_common:common_fields.quantity_with_limit', {
										limit: scannedSizeQuantity,
										defaultValue: `Quantity (max ${scannedSizeQuantity})`
									})}
									placeholder='1'
									type='number'
									disabled={!actualOrder}
									readOnly={Boolean(isExchangeAll)}
									min={1}
								/>
								<Div className='col-span-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm'>
									<Checkbox checked={isExchangeAll} onCheckedChange={handleToggleSelectAll} />
									<Div className='space-y-1.5 leading-none'>
										<FormLabel>{t('ns_inoutbound:labels.exchange_all')}</FormLabel>
										<FormDescription>{t('ns_inoutbound:description.exchange_all')}</FormDescription>
									</Div>
								</Div>
							</Fieldset>
						</ScrollShadow>
						<DialogFooter className='col-span-full'>
							<DialogClose asChild>
								<Button variant='secondary' onClick={() => form.reset()} disabled={isPending}>
									{t('ns_common:actions.cancel')}
								</Button>
							</DialogClose>
							<Button disabled={isPending}>
								{isPending && (
									<Icon name='LoaderCircle' className='animate-[spin_1.5s_linear_infinite]' role='img' />
								)}
								{isPending
									? t('ns_common:status.processing')
									: isError
										? t('ns_common:actions.retry')
										: t('ns_common:actions.confirm')}
							</Button>
						</DialogFooter>
					</Form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form`flex flex-col gap-y-6`
const Fieldset = tw(
	Div
)<DivProps>`group relative col-span-full grid grid-cols-2 gap-x-2 gap-y-6 rounded-md border px-4 pb-4 pt-8 sm:grid-cols-1`
const Legend = tw(
	Typography
)<TypographyProps>`z-10 text-sm text-muted-foreground absolute left-2 top-0 -translate-y-1/2 bg-popover px-2 font-medium`

export default ExchangeEpcFormDialog
