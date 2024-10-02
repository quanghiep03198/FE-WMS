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
	SelectFieldControl,
	Typography
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePrevious } from 'ahooks'
import { omit, pick, uniqBy } from 'lodash'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useExchangeEpcMutation } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-exchange-form.context'
import { usePageContext } from '../../_contexts/-page-context'
import { ExchangeEpcFormValue, exchangeEpcSchema } from '../../_schemas/exchange-epc.schema'

const fallbackValues: ExchangeEpcFormValue = {
	mo_no: '',
	mat_code: '',
	size_numcode: '',
	mo_no_actual: '',
	quantity: 0
}

const ExchangeEpcFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const { open, defaultValues, setOpen } = useOrderDetailContext()
	const { scannedSizes } = usePageContext((state) => pick(state, ['scannedSizes', 'connection', 'setScannedSizes']))
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
					item.mo_no !== defaultValues?.mo_no &&
					item.size_numcode === defaultValues?.size_numcode &&
					item.mat_code === defaultValues?.mat_code
			),
			'mo_no'
		)
	}, [defaultValues])

	const { mutateAsync, isPending, isError } = useExchangeEpcMutation()

	const handleExchangeEpc = async (data: ExchangeEpcFormValue) => {
		try {
			const payload = omit(data, ['count', 'exchange_all'])
			await mutateAsync(payload)
			toast.success(t('ns_common:notification.success'))
		} catch (error) {
			toast.error(t('ns_common:notification.error'))
		}
	}

	useEffect(() => {
		if (isExchangeAll) form.setValue('quantity', defaultValues?.count ?? 0)
		else form.setValue('quantity', previousQuantity ?? 0)
	}, [isExchangeAll])

	useEffect(() => {
		form.reset(defaultValues)
	}, [defaultValues])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='grid max-w-2xl gap-6'>
				<DialogHeader>
					<DialogTitle>Exchange EPC</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				{exchangableOrders.length > 0 ? (
					<FormProvider {...form}>
						<Form onSubmit={form.handleSubmit(handleExchangeEpc)}>
							<Div className='col-span-2'>
								<InputFieldControl readOnly label='Manufacturing order' name='mo_no' disabled />
							</Div>
							<Div className='col-span-2'>
								<InputFieldControl readOnly label='Production code' name='mat_code' disabled />
							</Div>
							<Div className='col-span-2'>
								<InputFieldControl readOnly label='Size' name='size_numcode' disabled />
							</Div>
							<Div className='col-span-3'>
								<SelectFieldControl
									name='mo_no_actual'
									label='Actual order'
									datalist={exchangableOrders}
									labelField='mo_no'
									valueField='mo_no'
									description='The actual order code to be exchanged'
								/>
							</Div>
							<Div className='col-span-3'>
								<InputFieldControl
									autoComplete='off'
									name='quantity'
									label='Quantity'
									placeholder='0'
									type='number'
									// readOnly={isExchangeAll}
									disabled={isExchangeAll || !actualOrder}
									description='Number of exchanged items for the actual order'
									min={1}
								/>
							</Div>
							<FormField
								control={form.control}
								name='override'
								render={({ field }) => (
									<FormItem className='col-span-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm'>
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<Div className='space-y-1.5 leading-none'>
											<FormLabel>Override</FormLabel>
											<FormDescription>You can override both exchaged items if exists</FormDescription>
										</Div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='exchange_all'
								render={({ field }) => (
									<FormItem className='col-span-full flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm'>
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<Div className='space-y-1.5 leading-none'>
											<FormLabel>Exchange all</FormLabel>
											<FormDescription>
												You can exchange the whole EPC belongs to the selected size
											</FormDescription>
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
									{isPending ? 'Processing' : isError ? 'Retry' : 'Confirm'}
								</Button>
							</DialogFooter>
						</Form>
					</FormProvider>
				) : (
					<Div className='grid h-64 place-content-center rounded-lg border p-6 text-center'>
						<Div className='inline-flex max-w-xs flex-col items-center gap-2'>
							<Icon name='PackageOpen' size={40} className='stroke-foreground stroke-[1px] text-center' />
							<Typography className='font-medium'>No available item</Typography>
							<Typography variant='small' color='muted'>
								{t('ns_inoutbound:description.no_exchangable_order')}
							</Typography>
						</Div>
					</Div>
				)}
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form`grid grid-cols-6 gap-x-2 gap-y-6`

export default ExchangeEpcFormDialog
