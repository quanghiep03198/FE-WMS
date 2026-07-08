import { useGetCommandNumberDetailQuery, useSearchCommandNumberQuery } from '@/app/(features)/-hooks/use-order-asm'
import { useEffectOnce } from '@/common/hooks/use-effect-once'
import type { DivProps, TypographyProps } from '@/components/ui'
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
	FormDescription,
	FormLabel,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	SelectFieldControl,
	Typography
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { useSocketContext } from '@/stores/socket.store'
import { zodResolver } from '@hookform/resolvers/zod'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { usePrevious } from 'ahooks'
import { debounce, uniqBy } from 'lodash-es'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useOrderDetailContext } from '../../-contexts/order-detail-context'
import { usePageContext } from '../../-contexts/page-context'
import { useUpsertEpcInfoMutation } from '../../-hooks/use-rfid-inbound-asm'
import type { ExchangeEpcFormValue } from '../../-schemas/exchange-epc.schema'
import { exchangeEpcSchema } from '../../-schemas/exchange-epc.schema'

const ExchangeEpcFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const { scannedOrders } = usePageContext('scannedOrders')
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [availableCmdSequence, setAvailableCmdSequence] = useState([])
	const [isExchangeAll, setIsExchangeAll] = useState<CheckedState>(false)
	const { mutateAsync, isPending, isError } = useUpsertEpcInfoMutation()

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
	const { io } = useSocketContext('io')

	const exchangableOrders = useMemo(() => {
		return uniqBy(
			scannedOrders.filter(
				(item) => item.mo_no !== defaultValues?.mo_no && item.color_sn === defaultValues?.color_sn
			),
			'mo_no'
		)
	}, [defaultValues])

	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		form.reset(defaultValues)
	}, [defaultValues])

	useEffect(() => {
		if (!defaultValues) return
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => fetchExchangableOrder(), 200)
		return () => {
			clearTimeout(timeoutRef.current)
		}
	}, [searchTerm])

	useEffect(() => {
		if (orderDetail && orderDetail.orders && orderDetail.sizes) {
			setAvailableCmdSequence(
				orderDetail.orders.map((item) => ({
					label: item.mo_noseq,
					value: item.mo_noseq
				}))
			)
		}
	}, [orderDetail])

	const handleSelectSubCommandNumber = (value: string) => {
		const currOrderInfo = orderDetail?.orders?.find((item) => item?.mo_noseq === value)
		if (currOrderInfo) {
			const matchedSize = orderDetail.sizes.find((item) => item.size_numcode === defaultValues?.size_numcode)
			form.reset({
				...form.getValues(),
				color_sn_actual: currOrderInfo.color_sn,
				cust_shoes_style: currOrderInfo.cust_shoes_style,
				factory_shoes_style_actual: currOrderInfo.factory_shoes_style,
				mat_code: currOrderInfo.mat_code,
				mo_no_actual: currOrderInfo.mo_no,
				or_no: currOrderInfo.or_no,
				or_cust_po: currOrderInfo.or_cust_po,
				size_code: currOrderInfo.size_code,
				size_qty: currOrderInfo.size_sumqty,
				size_numcode_actual: matchedSize?.size_numcode ?? 'N/A',
				// filter values
				factory_shoes_style: defaultValues.factory_shoes_style,
				color_sn: defaultValues.color_sn,
				mo_no: defaultValues.mo_no,
				size_numcode: defaultValues.size_numcode
			})
		}
	}

	const handleToggleSelectAll = (checked: CheckedState) => {
		setIsExchangeAll(checked)
		if (checked) form.setValue('quantity', defaultValues?.scanned_size_qty ?? 0)
		else form.setValue('quantity', previousQuantity ?? 0)
	}

	const toastId = useRef<string | number>(null)

	const handleExchangeEpc = async (data: ExchangeEpcFormValue) => {
		toastId.current = toast.loading(t('ns_common:notification.processing_request'))
		await mutateAsync(data)

		resetSelectedRows()
		setOpen(!open)
	}

	useEffectOnce(() => {
		const notifySuccess = (message: string) => toast.success(message, { id: toastId.current })
		const notifyError = (message: string) => toast.error(message, { id: toastId.current })
		io.on('exchange_mo.success', notifySuccess)
		io.on('exchange_mo.error', notifyError)

		return () => {
			io.off('exchange_mo.success', notifySuccess)
			io.off('exchange_mo.error', notifyError)
		}
	})

	const handleOpenChange = (open: boolean) => {
		setOpen(open)
		if (!open) {
			form.reset(defaultValues)
			setIsExchangeAll(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
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
								<InputFieldControl label={t('ns_erp:fields.color_sn')} name='color_sn' readOnly={true} />
								<InputFieldControl
									label={t('ns_erp:fields.factory_shoes_style')}
									name='factory_shoes_style'
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
									shouldFilter={false}
									onInput={debounce((value) => setSearchTerm(value), 200)}
									onSelect={(value) => {
										form.reset({
											...form.getValues(),
											mo_no_actual: value,
											factory_shoes_style_actual: '',
											color_sn_actual: '',
											size_numcode_actual: '',
											mo_noseq: '',
											mat_code: '',
											or_no: '',
											or_cust_po: '',
											cust_shoes_style: '',
											size_code: '',
											size_qty: 0
										})
									}}
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
									label={t('ns_erp:fields.factory_shoes_style')}
									name='factory_shoes_style_actual'
									placeholder='XX01 XX01-1'
									readOnly={true}
								/>
								<InputFieldControl
									label={t('ns_erp:fields.color_sn')}
									name='color_sn_actual'
									placeholder='Black'
									readOnly={true}
								/>
								<InputFieldControl label='Size' name='size_numcode_actual' placeholder='10' readOnly={true} />
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
								{isPending && <Icon name='LoaderCircle' className='animate-[spin_1.5s_linear_infinite]' />}
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
