'use no memo'

import { useSearchPurchaseOrderQuery } from '@/app/(features)/_apis/use-order.api'
import { cn } from '@/common/utils/cn'
import {
	Button,
	Checkbox,
	Div,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormProvider,
	Icon,
	Input,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SelectFieldControl,
	Separator,
	Typography
} from '@/components/ui'
import { InputFieldControl } from '@/components/ui/@hook-form/input-field-control'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useDebounce, useResetState, useUpdateEffect } from 'ahooks'
import { omit, sortBy } from 'lodash'
import { useId, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useUpdateStockOutMutation } from '../../_apis/outbound-rfid.api'
import { usePageContext } from '../../_contexts/-page-context'
import { outboundValidator } from '../../_schemas/outbound.schema'

const OutboundForm: React.FC = () => {
	const [isConfirmed, setIsConfirmed, resetConfirm] = useResetState<CheckedState>(false)
	const [autoCompleteOpen, setAutoCompleteOpen] = useState<boolean>(false)
	const { scannedOrders } = usePageContext('scannedOrders')
	const checkboxId = useId()
	const inputRef = useRef<HTMLInputElement>(null)
	const { t } = useTranslation()
	const form = useForm({
		resolver: zodResolver(outboundValidator),
		mode: 'onChange',
		defaultValues: {
			po: '',
			mo_no: '',
			size_numcode: '',
			size_qty: 0,
			qty: undefined
		}
	})
	const currentPurchaseOrderValue = form.watch('po')
	const currentCommandNumber = form.watch('mo_no')
	const debouncedSearchTerm = useDebounce(currentPurchaseOrderValue, { wait: 500 })
	const { data: purchaseOrders } = useSearchPurchaseOrderQuery(debouncedSearchTerm)
	const { mutateAsync, isPending, isError } = useUpdateStockOutMutation()

	const handleSubmit = async (data) => {
		const id = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(data)
			console.log('data :>> ', omit(data, 'size_qty'))
			resetConfirm()
			toast.success(t('ns_common:notification.success'), { id })
			form.reset()
		} catch {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	useUpdateEffect(() => {
		if (!autoCompleteOpen && !!currentPurchaseOrderValue) {
			setAutoCompleteOpen(true)
		}
	}, [purchaseOrders, currentPurchaseOrderValue])

	const sizeDataList = useMemo(() => {
		const currentCommandNumberData = scannedOrders.find((item) => item.mo_no === currentCommandNumber)
		return Array.isArray(currentCommandNumberData?.sizes)
			? sortBy(currentCommandNumberData.sizes, 'size_numcode')
			: []
	}, [scannedOrders, currentCommandNumber])

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='po'
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel htmlFor='po'>{t('ns_erp:fields.po')}</FormLabel>
								<FormControl>
									<Popover defaultOpen={false} open={autoCompleteOpen} onOpenChange={setAutoCompleteOpen}>
										<PopoverTrigger className='w-full'>
											<Input
												ref={inputRef}
												id='po'
												autoComplete='off'
												placeholder='xxxx-xxxx-xxxx'
												className={cn(
													'w-full bg-background tracking-wider placeholder:tracking-widest',
													form.getFieldState('po').error &&
														'border-destructive focus-within:border-destructive'
												)}
												value={field.value}
												onClick={(e) => e.stopPropagation()}
												onFocus={() => setAutoCompleteOpen(true)}
												onChange={field.onChange}
											/>
										</PopoverTrigger>
										<PopoverContent
											hidden={purchaseOrders?.length === 0}
											className='w-[var(--radix-popover-trigger-width)] p-1'>
											{purchaseOrders?.length > 0 ? (
												purchaseOrders?.map(({ po }) => (
													<Div
														key={po}
														className='flex cursor-pointer items-center rounded-md p-2 hover:bg-secondary hover:text-secondary-foreground'
														onClick={() => {
															form.setValue('po', po)
															form.trigger('po')
														}}>
														<Typography variant='small' className='tracking-wider'>
															{po}
														</Typography>
														<Icon
															name='Check'
															className={cn(
																'ml-auto transition-opacity duration-200',
																field.value === po ? 'opacity-100' : 'opacity-0'
															)}
														/>
													</Div>
												))
											) : (
												<Typography variant='small' className='p-10 text-center'>
													{t('ns_common:table.no_data')}
												</Typography>
											)}
										</PopoverContent>
									</Popover>
								</FormControl>
								<FormMessage />
							</FormItem>
						)
					}}
				/>
				<SelectFieldControl
					label={t('ns_erp:fields.mo_no')}
					name='mo_no'
					datalist={sortBy(scannedOrders, 'mo_no')}
					labelField='mo_no'
					valueField='mo_no'
				/>
				<SelectFieldControl
					label='Size'
					name='size_numcode'
					datalist={sizeDataList}
					labelField='size_numcode'
					valueField='size_numcode'
					disabled={!currentCommandNumber}
					onValueChange={(value) => {
						form.setValue('size_qty', sizeDataList.find((item) => item.size_numcode === value)?.count ?? 0)
					}}
				/>
				<InputFieldControl
					label={t('ns_common:common_fields.quantity_with_limit', {
						limit: form.watch('size_qty'),
						defaultValue: null
					})}
					disabled={!form.watch('size_numcode')}
					name='qty'
					type='number'
					placeholder='0'
				/>
				<Div className='col-span-full space-y-3'>
					<Div className='space-y-1.5 leading-none'>
						<Typography className='inline-flex items-center gap-x-2 font-semibold text-warning'>
							<Icon name='TriangleAlert' /> {t('ns_common:titles.caution')}
						</Typography>
						<Typography variant='small'>
							{t('ns_inoutbound:notification.stock_out_submission_caution')}
						</Typography>
					</Div>
					<Separator />
					<Div className='inline-flex items-center gap-x-2'>
						<Checkbox id={checkboxId} checked={isConfirmed} onCheckedChange={(value) => setIsConfirmed(value)} />
						<Label htmlFor={checkboxId}>{t('ns_common:confirmation.understand_and_proceed')}</Label>
					</Div>
				</Div>
				<Div className='col-span-full grid grid-cols-2 items-end gap-2 sm:grid-cols-1'>
					<Button type='submit' size='lg' disabled={isPending || !isConfirmed}>
						<Icon
							name={isPending ? 'LoaderCircle' : 'Check'}
							role='img'
							className={cn(isPending && 'animate-spin')}
						/>
						{isError ? t('ns_common:actions.retry') : t('ns_common:actions.submit')}
					</Button>
					<Button variant='outline' type='button' size='lg' disabled={isPending} onClick={() => form.reset()}>
						<Icon name='Undo' role='img' />
						{t('ns_common:actions.reset')}
					</Button>
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`

export default OutboundForm
