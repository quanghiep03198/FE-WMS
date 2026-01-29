import { FALLBACK_VALUE } from '@/common/constants/constants'
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
import { InputFieldControl } from '@/components/ui/@field-control/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useResetState } from 'ahooks'
import { debounce, uniqBy } from 'lodash-es'
import { useEffect, useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useOrderDetailContext } from '../../-contexts/order-detail-context'
import { usePageContext } from '../../-contexts/page-context'
import {
	useExchangeEpcMutation,
	useGetInboundEpcQuery,
	useSearchExchangableOrderQuery
} from '../../-hooks/use-rfid-inbound-asm'
import { ExchangeOrderFormValue, exchangeOrderSchema } from '../../-schemas/exchange-epc.schema'

const ExchangeOrderFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const [isConfirmed, setIsConfirmed, resetConfirm] = useResetState<CheckedState>(false)
	const checkboxId = useId()
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { scanningStatus, scannedEpc, connection, setScannedEpc } = usePageContext(
		'scanningStatus',
		'scannedEpc',
		'connection',
		'setScannedEpc'
	)
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
	const { data: currentEpcData } = useGetInboundEpcQuery()

	const form = useForm<ExchangeOrderFormValue>({
		resolver: zodResolver(exchangeOrderSchema)
	})

	const { data: orderDetail, refetch: fetchExchangableOrder } = useSearchExchangableOrderQuery({
		'mo_no.eq': defaultValues?.mo_no,
		'factory_shoes_style.eq': defaultValues?.factory_shoes_style,
		'color_sn.eq': defaultValues?.color_sn,
		q: searchTerm
	})

	useEffect(() => {
		if (!connection || !defaultValues) return
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => fetchExchangableOrder(), 200)
		return () => {
			clearTimeout(timeoutRef.current)
		}
	}, [searchTerm, defaultValues])

	useEffect(() => {
		if (defaultValues) form.reset(defaultValues)
	}, [defaultValues])

	const handleExchangeEpc = async (data: ExchangeOrderFormValue) => {
		try {
			await mutateAsync(data)
			toast.success(t('ns_common:notification.success'))
			if (scanningStatus === 'disconnected' && Array.isArray(currentEpcData?.data)) {
				setScannedEpc({ ...currentEpcData, data: uniqBy([...scannedEpc.data, ...currentEpcData.data], 'epc') })
			}
			resetSelectedRows()
			setOpen(!open)
		} catch {
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
						<Div className={defaultValues?.mo_no === FALLBACK_VALUE ? 'col-span-1' : 'col-span-full'}>
							<ComboboxFieldControl
								name='mo_no_actual'
								label={t('ns_erp:fields.mo_no_actual')}
								datalist={orderDetail ?? []}
								labelField='mo_no'
								valueField='mo_no'
								shouldFilter={false}
								onInput={debounce((value) => setSearchTerm(value), 200)}
								description={t('ns_inoutbound:description.transferred_order')}
							/>
						</Div>

						<Div className='col-span-full space-y-4'>
							<Div className='space-y-1.5 leading-none'>
								<Typography className='inline-flex items-center gap-x-2 font-semibold' color='destructive'>
									<Icon name='TriangleAlert' /> {t('ns_common:titles.caution')}
								</Typography>
								<Typography className='text-sm'>
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
								{isPending && <Icon name='LoaderCircle' className='animate-[spin_1.5s_linear_infinite]' />}
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
