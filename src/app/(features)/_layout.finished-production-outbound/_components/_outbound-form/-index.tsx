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
	Separator,
	Typography
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useDebounce, useResetState, useUpdateEffect } from 'ahooks'
import { useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useUpdateStockOutMutation } from '../../_apis/outbound-rfid.api'
import { outboundValidator } from '../../_schemas/outbound.schema'

const OutboundForm: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [isConfirmed, setIsConfirmed, resetConfirm] = useResetState<CheckedState>(false)
	const [autoCompleteOpen, setAutoCompleteOpen] = useState<boolean>(false)
	const checkboxId = useId()
	const inputRef = useRef<HTMLInputElement>(null)
	const { t } = useTranslation()
	const form = useForm({
		resolver: zodResolver(outboundValidator),
		defaultValues: {
			po: ''
		}
	})
	const debouncedSearchTerm = useDebounce(searchTerm, { wait: 500 })
	const { data: purchaseOrders } = useSearchPurchaseOrderQuery(debouncedSearchTerm)
	const { mutateAsync, isPending, isError } = useUpdateStockOutMutation()

	const handleSubmit = async (data) => {
		const id = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(data)
			resetConfirm()
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	useUpdateEffect(() => {
		if (autoCompleteOpen) {
			setAutoCompleteOpen(purchaseOrders?.length > 0)
		}
	}, [purchaseOrders])

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name='po'
					render={({ field }) => {
						return (
							<FormItem className='flex flex-col'>
								<FormLabel htmlFor='po'>{t('ns_erp:fields.po')}</FormLabel>
								<FormControl>
									<Popover defaultOpen={false} open={autoCompleteOpen} onOpenChange={setAutoCompleteOpen}>
										<PopoverTrigger>
											<Input
												ref={inputRef}
												id='po'
												autoComplete='off'
												placeholder='xxxx-xxxx-xxxx'
												className={cn(
													'tracking-wider placeholder:tracking-widest',
													form.getFieldState('po').error &&
														'border-destructive bg-background focus:border-destructive'
												)}
												value={field.value}
												onClick={(e) => e.stopPropagation()}
												onFocus={() => setAutoCompleteOpen(true)}
												onChange={(e) => {
													setSearchTerm(e.target.value)
													field.onChange(e)
												}}
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
														onClick={() => form.setValue('po', po)}>
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
						<Label htmlFor=''>{t('ns_common:confirmation.understand_and_proceed')}</Label>
					</Div>
				</Div>
				<Button type='submit' size='lg' disabled={isPending || !isConfirmed}>
					<Icon
						name={isPending ? 'LoaderCircle' : 'Check'}
						role='img'
						className={cn(isPending && 'animate-spin')}
					/>
					{isError ? t('ns_common:actions.retry') : t('ns_common:actions.submit')}
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`h-full flex items-stretch gap-y-6 flex-col border rounded-md p-6`

export default OutboundForm
