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
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormProvider,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Input,
	Label,
	Separator,
	Typography
} from '@/components/ui'
import { InputFieldControl } from '@/components/ui/@hook-form/input-field-control'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { usePrevious, useResetState } from 'ahooks'
import { omit, uniqBy } from 'lodash'
import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { FALLBACK_ORDER_VALUE, useExchangeEpcMutation, useGetEpcQuery, useSearchOrderQuery } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { usePageContext } from '../../_contexts/-page-context'
import { ExchangeOrderFormValue, exchangeOrderSchema } from '../../_schemas/exchange-epc.schema'

const ExchangeOrderFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const [hoverCardOpen, setHoverCardOpen] = useState<boolean>(false)
	const [isConfirmed, setIsConfirmed, resetConfirm] = useResetState<CheckedState>(false)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const checkboxId = useId()
	const { scannedEpc, connection, setScannedEpc } = usePageContext('scannedEpc', 'connection', 'setScannedEpc')
	const {
		exchangeOrderDialogOpen: open,
		setExchangeOrderDialogOpen: setOpen,
		defaultExchangeOrderFormValues: defaultValues,
		resetSelectedRows
	} = useOrderDetailContext(
		'exchangeOrderDialogOpen',
		'defaultExchangeOrderFormValues',
		'setExchangeOrderDialogOpen',
		'setDefaultExchangeEpcFormValues',
		'resetSelectedRows'
	)

	const { mutateAsync, isPending } = useExchangeEpcMutation()
	const { data: currentEpcData } = useGetEpcQuery()

	const form = useForm<ExchangeOrderFormValue>({
		resolver: zodResolver(exchangeOrderSchema)
	})
	const isExchangeAll = form.watch('exchange_all')
	const quantity = form.watch('quantity')
	const actualOrder = form.watch('mo_no_actual')
	const previousQuantity = usePrevious(quantity)

	const { data: orderDetail, refetch: fetchExchangableOrder } = useSearchOrderQuery(defaultValues?.mo_no, actualOrder)

	useEffect(() => {
		if (!connection || !defaultValues || !actualOrder) return
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => fetchExchangableOrder(), 200)
		return () => {
			clearTimeout(timeoutRef.current)
		}
	}, [actualOrder, connection, actualOrder])

	useEffect(() => {
		if (defaultValues) form.reset(defaultValues)
	}, [defaultValues])

	useEffect(() => {
		if (isExchangeAll) form.setValue('quantity', defaultValues?.count ?? 0)
		else form.setValue('quantity', previousQuantity ?? 0)
	}, [isExchangeAll])

	const handleExchangeEpc = async (data: ExchangeOrderFormValue) => {
		try {
			await mutateAsync(omit({ ...data, quantity: data.quantity ?? data.count }, ['exchange_all', 'count']))
			toast.success(t('ns_common:notification.success'))
			setScannedEpc({ ...currentEpcData, data: uniqBy([...scannedEpc.data, ...currentEpcData.data], 'epc') })
			resetSelectedRows()
			setOpen(!open)
		} catch (error) {
			toast.error(t('ns_common:notification.error'))
		}
	}

	const handleOpenChange = (open: boolean) => {
		setOpen(open)
		if (!open) {
			form.reset()
			resetConfirm()
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='grid max-w-xl gap-6'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.exchange_order')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.exchange_epc_dialog_desc')}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<Form className='group' onSubmit={form.handleSubmit(handleExchangeEpc)}>
						<Div className='col-span-full'>
							<InputFieldControl name='mo_no' label={t('ns_erp:fields.mo_no')} readOnly />
						</Div>
						<Div className={defaultValues?.mo_no === FALLBACK_ORDER_VALUE ? 'col-span-1' : 'col-span-full'}>
							<HoverCard open={hoverCardOpen && Array.isArray(orderDetail) && orderDetail.length > 0}>
								<HoverCardTrigger type='button' className='item-stretch flex w-full flex-col'>
									<FormField
										control={form.control}
										name='mo_no_actual'
										render={({ field }) => {
											return (
												<FormItem className='w-full text-left'>
													<FormLabel>{t('ns_erp:fields.mo_no_actual')}</FormLabel>
													<FormControl>
														<Input
															value={field.value}
															onChange={field.onChange}
															placeholder='Enter a manufacturing order code'
															onFocus={() => setHoverCardOpen(true)}
															onBlur={() => setHoverCardOpen(false)}
															className='w-full'
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)
										}}
									/>
								</HoverCardTrigger>
								<HoverCardContent className='flex w-[var(--radix-hover-card-trigger-width)] flex-col items-stretch gap-y-1 p-1'>
									{Array.isArray(orderDetail) && orderDetail.length > 0 ? (
										<Div>
											{orderDetail.map((item) => (
												<Button
													key={item.mo_no}
													type='button'
													variant='ghost'
													size='sm'
													className='w-full justify-start'
													onClick={() => form.setValue('mo_no_actual', item?.mo_no)}>
													{item?.mo_no}
												</Button>
											))}
										</Div>
									) : (
										<Button type='button' variant='ghost' disabled className='font-normal'>
											No result match
										</Button>
									)}
								</HoverCardContent>
							</HoverCard>
						</Div>

						{defaultValues?.mo_no === FALLBACK_ORDER_VALUE && (
							<Fragment>
								<Div className='col-span-1'>
									<InputFieldControl
										name='quantity'
										type='number'
										placeholder='0'
										disabled={!actualOrder}
										readOnly={isExchangeAll}
										label={t('ns_common:common_fields.quantity')}
									/>
								</Div>
								<FormField
									control={form.control}
									name='exchange_all'
									render={({ field }) => (
										<FormItem className='col-span-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm'>
											<FormControl>
												<Checkbox checked={field.value} onCheckedChange={field.onChange} />
											</FormControl>
											<Div className='space-y-1.5 leading-none'>
												<FormLabel>{t('ns_inoutbound:labels.exchange_all')}</FormLabel>
												<FormDescription>{t('ns_inoutbound:description.exchange_all')}</FormDescription>
											</Div>
										</FormItem>
									)}
								/>
							</Fragment>
						)}

						<Div className='col-span-full space-y-4'>
							<Div className='space-y-1.5 leading-none'>
								<Typography className='inline-flex items-center gap-x-2 font-semibold text-warning'>
									<Icon name='TriangleAlert' /> {t('ns_common:titles.caution')}
								</Typography>
								<Typography variant='small'>
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
							<DialogClose asChild>
								<Button variant='secondary' disabled={isPending}>
									{t('ns_common:actions.cancel')}
								</Button>
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

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`

export default ExchangeOrderFormDialog
