import { Languages } from '@/common/constants/enums'
import useQueryParams from '@/common/hooks/use-query-params'
import { IMonthlyInventoryReport } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import { Button, Div, Form, Icon, InputFieldControl } from '@/components/ui'
import { InventoryService } from '@/services/inventory.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useIsFetching, useMutation, useQueryClient } from '@tanstack/react-query'
import { useBoolean } from 'ahooks'
import { format } from 'date-fns'
import React, { Fragment, useMemo, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { z } from 'zod'
import { INVENTORY_REPORT_PROVIDE_TAG } from '../../_apis/use-report.api'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'

const reportDataSchema = z.object({
	data: z.array(
		z.object({
			size_numcode: z.string(),
			mn_ist_qty: z.number().min(0, { message: 'Invalid value' }),
			mn_ost_qty: z.number().min(0, { message: 'Invalid value' })
		})
	)
})

type BaseUpdateUpdateQuery = Pick<
	IMonthlyInventoryReport,
	'actual_po' | 'mo_no' | 'shoes_style_code_factory' | 'cust_shoestyle' | 'inv_type' | 'inv_year_month'
> & { size_numcode: string }

type InventoryReportDetailTableProps = {
	queries: Omit<BaseUpdateUpdateQuery, 'size_numcode'>
	data: IMonthlyInventoryReport['detail']
}

type ReportDataFormValues = z.infer<typeof reportDataSchema>

export const InventoryReportDetailTable: React.FC<InventoryReportDetailTableProps> = ({ queries, data }) => {
	const { t, i18n } = useTranslation()

	const { searchParams } = useQueryParams<{ 'month.eq': string }>({ 'month.eq': format(new Date(), 'yyyy-MM') })

	// * Handle toggle enable editing
	const [isEditing, { setTrue: enableEditing, setFalse: disableEditing }] = useBoolean(false)

	const form = useForm<ReportDataFormValues>({
		shouldUseNativeValidation: true,
		reValidateMode: 'onChange',
		mode: 'onChange',
		resolver: zodResolver(reportDataSchema),
		defaultValues: {
			data: data.map((item) => ({
				size_numcode: item.size,
				mn_ist_qty: item.actual_instock_qty,
				mn_ost_qty: item.actual_outstock_qty
			}))
		}
	})
	const { fields } = useFieldArray({ name: 'data', control: form.control })
	const abortControllerRef = useRef<AbortController | null>(null)
	const queryClient = useQueryClient()

	const { data: currentTenant } = useGetTenantByFactory()

	// * Implement optimistic update on save manual changes
	const { mutateAsync, isPending, isError } = useMutation({
		mutationFn: async (payload: ReportDataFormValues['data']) => {
			return await InventoryService.updateInventoryAuditReport(
				currentTenant?.id,
				abortControllerRef.current?.signal,
				{ ...queries, po: queries.actual_po, inv_year_month: searchParams['month.eq'] },
				payload
			)
		},
		onMutate: async (variable) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({
				queryKey: [INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, searchParams],
				exact: true
			})
			// Snapshot the previous value
			const previousData = queryClient.getQueryData([INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, searchParams])

			// Optimistically update to the new value
			queryClient.setQueryData([INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, searchParams], variable)
			return { previousData }
		},
		onSuccess: () => {
			toast.success(t('ns_common:notification.success'))
			disableEditing()
		},
		onError: (_error, _variable, context) => {
			toast.error(t('ns_common:notification.error'))
			queryClient.setQueryData([INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, searchParams], context.previousData)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, searchParams],
				exact: true
			})
		}
	})

	const handleCancelUpdate = () => {
		abortControllerRef.current.abort()
		disableEditing()
		form.reset({
			data: data.map((item) => ({
				size_numcode: item.size,
				mn_ist_qty: item.actual_instock_qty,
				mn_ost_qty: item.actual_outstock_qty
			}))
		})
	}

	const handleStartUpdate = () => {
		abortControllerRef.current = new AbortController()
		enableEditing()
	}

	const fetchingQueries = useIsFetching({
		queryKey: [INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, searchParams],
		exact: true,
		type: 'active',
		fetchStatus: 'fetching',
		stale: false
	})

	const isLoading = useMemo(
		() => form.formState.isSubmitting || isPending || fetchingQueries > 0,
		[isPending, fetchingQueries, form.formState]
	)

	return (
		<ScrollArea>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(async ({ data }) => await mutateAsync(data))}>
					<Table>
						{Array.isArray(data) && data.length > 0 ? (
							<Fragment>
								<TableRow>
									<TableVerticalHeader>Size</TableVerticalHeader>
									{data.map((item) => (
										<TableCellHead key={item.size}>{item.size}</TableCellHead>
									))}
								</TableRow>
								<TableRow>
									<TableVerticalHeader>{t('ns_erp:fields.mo_size_qty')}</TableVerticalHeader>
									{data.map((item) => (
										<TableCell key={item.size}>{item.order_qty_by_size}</TableCell>
									))}
								</TableRow>
								<TableRow>
									<TableVerticalHeader>{t('ns_erp:fields.total_init_qty')}</TableVerticalHeader>
									{data.map((item) => (
										<TableCell key={item.size}>{item.initial_stock_qty}</TableCell>
									))}
								</TableRow>
								<TableRow>
									<TableVerticalHeader>{t('ns_erp:fields.inbound_qty')}</TableVerticalHeader>
									{data.map((item) => (
										<TableCell key={item.size}>{item.instock_qty}</TableCell>
									))}
								</TableRow>
								<TableRow>
									<TableVerticalHeader>{t('ns_erp:fields.outbound_qty')}</TableVerticalHeader>
									{data.map((item) => (
										<TableCell key={item.size}>{item.outstock_qty}</TableCell>
									))}
								</TableRow>
								<TableRow>
									<TableVerticalHeader>
										{i18n.language === Languages.VIETNAMESE
											? t('ns_common:actions.increment')
											: t('ns_erp:fields.actual_instock_qty')}
									</TableVerticalHeader>
									{fields.length > 0 &&
										fields.map((field, index) => {
											const error = form.getFieldState(`data.${index}.mn_ist_qty`).error
											return (
												<TableCell
													key={field.id}
													aria-invalid={!!error}
													className='p-0 aria-[invalid=true]:border aria-[invalid=true]:border-destructive'>
													<InputFieldControl
														name={`data.${index}.mn_ist_qty`}
														type='number'
														className={cn(
															'h-auto w-full whitespace-nowrap rounded-none border-none bg-transparent p-0 shadow-none focus:outline-none',
															form.watch(`data.${index}.mn_ist_qty`) !== 0
																? 'text-destructive disabled:text-destructive/80'
																: 'text-foreground'
														)}
														disabled={!isEditing || isLoading}
													/>
												</TableCell>
											)
										})}
								</TableRow>
								<TableRow>
									<TableVerticalHeader>
										{i18n.language === Languages.VIETNAMESE
											? t('ns_common:actions.decrement')
											: t('ns_erp:fields.actual_outstock_qty')}
									</TableVerticalHeader>
									{fields.length > 0 &&
										fields.map((field, index) => {
											const error = form.getFieldState(`data.${index}.mn_ost_qty`).error
											return (
												<TableCell
													key={field.id}
													aria-invalid={!!error}
													className='p-0 aria-[invalid=true]:border aria-[invalid=true]:border-destructive'>
													<InputFieldControl
														name={`data.${index}.mn_ost_qty`}
														type='number'
														className={cn(
															'h-auto w-full whitespace-nowrap rounded-none border-none bg-transparent p-0 shadow-none focus:outline-none',
															form.watch(`data.${index}.mn_ost_qty`) !== 0
																? 'text-destructive disabled:text-destructive/80'
																: 'text-foreground'
														)}
														disabled={!isEditing || isLoading}
													/>
												</TableCell>
											)
										})}
								</TableRow>
								<TableRow>
									<TableVerticalHeader>{t('ns_erp:fields.final_inventory_qty')}</TableVerticalHeader>
									{data.map((item) => (
										<TableCell key={item.size} className='hover:!ring-primary'>
											{item.final_stock_qty}
										</TableCell>
									))}
								</TableRow>
							</Fragment>
						) : (
							<Div className='p-10 font-medium'>{t('ns_common:table.no_data')}</Div>
						)}
						<TableRow className='*:border-none'>
							<TableVerticalHeader className='sticky left-0 !w-full flex-1'>
								<Div className='inline-grid grid-cols-2 gap-x-2'>
									{isEditing ? (
										<Button
											type='button'
											size='sm'
											variant='destructive'
											onClick={() => handleCancelUpdate()}>
											<Icon name='X' role='presentation' />
											{t('ns_common:actions.cancel')}
										</Button>
									) : (
										<Button type='button' size='sm' variant='outline' onClick={() => handleStartUpdate()}>
											<Icon name='Pencil' role='presentation' /> {t('ns_common:actions.update')}
										</Button>
									)}
									<Button type='submit' size='sm' disabled={!isEditing || isLoading}>
										<Icon
											name={isPending ? 'LoaderCircle' : 'Check'}
											role='presentation'
											className={isPending && 'animate-spin'}
										/>{' '}
										{isPending
											? t('ns_common:status.processing')
											: isError
												? t('ns_common:actions.retry')
												: t('ns_common:actions.save')}
									</Button>
								</Div>
							</TableVerticalHeader>
							<TableCell className='flex-1' />
						</TableRow>
					</Table>
				</form>
			</Form>
		</ScrollArea>
	)
}

const ScrollArea = tw.div`relative h-fit max-w-full overflow-auto overflow-x-scroll rounded-md border bg-background`
const Table = tw.div`[&>*>:first-child]:top-0 [&>*>:first-child]:font-medium [&>*>:first-child]:text-table-head-foreground`
const TableVerticalHeader = tw.div`sticky left-0 z-10 lowercase first-letter:uppercase`
const TableRow = tw.div`flex [&>*]:px-4 [&>*]:border-b [&>*]:bg-background [&>*]:py-2 [&>*]:whitespace-nowrap [&>*]:border-r [&>:last-child]:border-r-0 [&>:last-child]:flex-1 [&>:first-child]:basis-52 [&>:first-child]:min-w-52 [&>:not(:first-child)]:basis-24 [&>:not(:first-child)]:min-w-24`
const TableCell = tw.div`text-foreground text-left`
const TableCellHead = tw.div`text-table-head-foreground font-medium text-left`

InventoryReportDetailTable.displayName = 'InboundReportDetailTable'
