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
	Form as FormProvider,
	Icon,
	InputFieldControl,
	SelectFieldControl
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePrevious } from 'ahooks'
import { omit, pick, uniqBy } from 'lodash'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useExchangeEpcMutation, useManualFetchEpcQuery } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { OrderSize, usePageContext } from '../../_contexts/-page-context'
import { ExchangeEpcFormValue, exchangeEpcSchema } from '../../_schemas/exchange-epc.schema'
import NoExchangeOrder from './-no-exchangable-order'

const ExchangeEpcFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const { scannedEpc, setScannedEpc } = usePageContext((state) => pick(state, ['scannedEpc', 'setScannedEpc']))
	const { scannedSizes } = usePageContext((state) => pick(state, ['scannedSizes']))
	const {
		exchangeEpcDialogOpen: open,
		defaultExchangeEpcFormValues: defaultValues,
		setExchangeEpcDialogOpen: setOpen
	} = useOrderDetailContext((state) =>
		pick(state, ['exchangeEpcDialogOpen', 'defaultExchangeEpcFormValues', 'setExchangeEpcDialogOpen'])
	)

	const { data: currentEpcData } = useManualFetchEpcQuery()
	const { mutateAsync, isPending, isError } = useExchangeEpcMutation()
	const form = useForm<ExchangeEpcFormValue>({
		resolver: zodResolver(exchangeEpcSchema),
		mode: 'onChange'
	})
	const isExchangeAll = form.watch('exchange_all')
	const quantity = form.watch('quantity')
	const actualOrder = form.watch('mo_no_actual')
	const previousQuantity = usePrevious(quantity)

	const exchangableOrders = useMemo(() => {
		return uniqBy(
			scannedSizes.filter(
				(item) =>
					item.mo_no !== (defaultValues as OrderSize)?.mo_no &&
					item.mat_code === (defaultValues as OrderSize)?.mat_code
			),
			'mo_no'
		)
	}, [defaultValues])

	// * Reset quantity value when exchange all is checked
	useEffect(() => {
		if (isExchangeAll) form.setValue('quantity', defaultValues?.count ?? 0)
		else form.setValue('quantity', previousQuantity ?? 0)
	}, [isExchangeAll])

	// * Reset form when default values change
	useEffect(() => {
		form.reset({ ...defaultValues, multi: false })
	}, [defaultValues])

	/**
	 * @description Handle exchange EPC
	 * @param data
	 */
	const handleExchangeEpc = async (data: ExchangeEpcFormValue) => {
		try {
			const payload = omit(data, ['count', 'exchange_all'])
			await mutateAsync(payload)
			setScannedEpc({ ...currentEpcData, data: uniqBy([...scannedEpc.data, ...currentEpcData.data], 'epc') })
			toast.success(t('ns_common:notification.success'))
			setOpen(!open)
		} catch (error) {
			toast.error(t('ns_common:notification.error'))
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='grid max-w-3xl gap-6'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.exchange_epc')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.exchange_epc_dialog_desc')}</DialogDescription>
				</DialogHeader>
				{exchangableOrders.length === 0 ? (
					<NoExchangeOrder />
				) : (
					<FormProvider {...form}>
						<Form onSubmit={form.handleSubmit(handleExchangeEpc)}>
							<Div className='col-span-2'>
								<InputFieldControl readOnly label={t('ns_erp:fields.mo_no')} name='mo_no' disabled />
							</Div>
							<Div className='col-span-2'>
								<InputFieldControl readOnly label={t('ns_erp:fields.mat_code')} name='mat_code' disabled />
							</Div>
							<Div className='col-span-2'>
								<InputFieldControl readOnly label='Size' name='size_numcode' disabled />
							</Div>
							<Div className='col-span-3'>
								<SelectFieldControl
									name='mo_no_actual'
									label={t('ns_erp:fields.mo_no_actual')}
									datalist={exchangableOrders}
									labelField='mo_no'
									valueField='mo_no'
									description={t('ns_inoutbound:description.transferred_order')}
								/>
							</Div>
							<Div className='col-span-3'>
								<InputFieldControl
									autoComplete='off'
									name='quantity'
									label={t('ns_common:common_fields.quantity')}
									placeholder='1'
									type='number'
									disabled={!actualOrder}
									readOnly={isExchangeAll}
									description={t('ns_inoutbound:description.exchange_qty')}
									min={1}
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
							<DialogFooter className='col-span-full'>
								<DialogClose asChild>
									<Button variant='secondary' onClick={() => form.reset()}>
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
				)}
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form`grid grid-cols-6 gap-x-2 gap-y-6`

export default ExchangeEpcFormDialog
