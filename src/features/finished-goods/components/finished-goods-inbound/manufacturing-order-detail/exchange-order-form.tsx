import { FALLBACK_VALUE } from '@common/constants/constants'
import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { ComboboxFieldControl } from '@components/forms/combobox'
import { InputFieldControl } from '@components/forms/input'
import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@components/ui/dialog'
import { Form as FormProvider } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { Separator } from '@components/ui/separator'
import { useOrderDetailContext } from '@features/finished-goods/contexts/finished-goods-inbound/order-detail-context'
import { usePageContext } from '@features/finished-goods/contexts/finished-goods-inbound/page-context'
import {
	useExchangeEpcMutation,
	useSearchExchangableOrderQuery
} from '@features/finished-goods/hooks/use-finished-goods-mo-request'
import type { ExchangeOrderFormValue } from '@features/finished-goods/schemas/exchange-epc.schema'
import { exchangeOrderSchema } from '@features/finished-goods/schemas/exchange-epc.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { useResetState } from 'ahooks'
import { debounce, uniqBy } from 'lodash-es'
import { useEffect, useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetScanningInboundEpcQuery } from '../../../hooks/use-inbound-request'

const ExchangeOrderFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const [isConfirmed, setIsConfirmed, resetConfirm] = useResetState<CheckedState>(false)
	const checkboxId = useId()
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { scanningStatus, scannedEpc, setScannedEpc } = usePageContext('scanningStatus', 'scannedEpc', 'setScannedEpc')
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
	const { data: currentEpcData } = useGetScanningInboundEpcQuery()

	const form = useForm<ExchangeOrderFormValue>({
		resolver: zodResolver(exchangeOrderSchema)
	})

	const { data: orderDetail, refetch: fetchExchangableOrder } = useSearchExchangableOrderQuery({
		'mo_no:eq': defaultValues?.mo_no,
		'factory_shoes_style:eq': defaultValues?.factory_shoes_style,
		'color_sn:eq': defaultValues?.color_sn,
		q: searchTerm
	})

	useEffect(() => {
		if (!defaultValues) return
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => fetchExchangableOrder(), 200)
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, [searchTerm, defaultValues])

	useEffect(() => {
		if (defaultValues) form.reset(defaultValues)
	}, [defaultValues])

	const handleExchangeEpc = async (data: ExchangeOrderFormValue) => {
		await mutateAsync(data)

		if (scanningStatus === 'disconnected' && Array.isArray(currentEpcData?.data)) {
			setScannedEpc({ ...currentEpcData, data: uniqBy([...scannedEpc.data, ...currentEpcData.data], 'epc') })
		}
		resetSelectedRows()
		setOpen(!open)
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
							<InputFieldControl readOnly label={t('ns_erp:fields.mo_no')} name='mo_no' />
						</Div>
						<Div className={defaultValues?.mo_no === FALLBACK_VALUE ? 'col-span-1' : 'col-span-full'}>
							<ComboboxFieldControl
								datalist={orderDetail ?? []}
								description={t('ns_inoutbound:description.transferred_order')}
								label={t('ns_erp:fields.mo_no_actual')}
								labelField='mo_no'
								name='mo_no_actual'
								shouldFilter={false}
								valueField='mo_no'
								onInput={debounce((value) => setSearchTerm(value), 200)}
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
									checked={isConfirmed}
									id={checkboxId}
									onCheckedChange={(value) => setIsConfirmed(value)}
								/>
								<Label htmlFor={checkboxId}>{t('ns_common:confirmation.understand_and_proceed')}</Label>
							</Div>
						</Div>
						<DialogFooter className='col-span-full'>
							<DialogClose asChild>
								<Button disabled={isPending} variant='secondary'>
									{t('ns_common:actions.cancel')}
								</Button>
							</DialogClose>
							<Button disabled={!isConfirmed || isPending} type='submit'>
								{isPending && <Icon className='animate-[spin_1.5s_linear_infinite]' name='LoaderCircle' />}
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
