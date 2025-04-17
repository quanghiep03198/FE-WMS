import useQueryParams from '@/common/hooks/use-query-params'
import { IMonthlyInventoryReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Button, Div, Form, Icon, InputFieldControl } from '@/components/ui'
import { ReportService } from '@/services/report.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useBoolean } from 'ahooks'
import { format } from 'date-fns'
import { pick } from 'lodash'
import React, { Fragment, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { z } from 'zod'
import { INVENTORY_REPORT_PROVIDE_TAG } from '../../_apis/use-report.api'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'
import { UrlQueryParams } from './-report-master-table'

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
	'po' | 'mo_no' | 'shoes_style_code_factory' | 'cust_shoestyle' | 'inv_type' | 'inv_year_month'
> & { size_numcode: string }

type InventoryReportDetailTableProps = {
	queries: Omit<BaseUpdateUpdateQuery, 'size_numcode'>
	data: IMonthlyInventoryReport['size_data']
}

type ReportDataFormValues = z.infer<typeof reportDataSchema>

export const InventoryReportDetailTable: React.FC<InventoryReportDetailTableProps> = ({ queries, data }) => {
	const { t } = useTranslation()

	const { searchParams } = useQueryParams<UrlQueryParams>({
		'month.eq': format(new Date(), 'yyyy-MM'),
		'auto-refresh': false
	})

	// Handle toggle enable editing
	const [isEditing, { setTrue: enableEditing, setFalse: disableEditing }] = useBoolean(false)

	const form = useForm<ReportDataFormValues>({
		shouldUseNativeValidation: true,
		resolver: zodResolver(reportDataSchema),
		defaultValues: {
			data: data.map((item) => ({
				size_numcode: item.size,
				mn_ist_qty: item.mn_ist_qty,
				mn_ost_qty: item.mn_ost_qty
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
			return await ReportService.updateInventoryReport(
				currentTenant?.id,
				abortControllerRef.current?.signal,
				queries,
				payload
			)
		},
		onMutate: async (variable) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({
				queryKey: [INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, pick(searchParams, 'month.eq')],
				exact: true
			})
			// Snapshot the previous value
			const previousData = queryClient.getQueryData([
				INVENTORY_REPORT_PROVIDE_TAG,
				currentTenant?.id,
				pick(searchParams, 'month.eq')
			])

			// Optimistically update to the new value
			queryClient.setQueryData(
				[INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, pick(searchParams, 'month.eq')],
				variable
			)
			return { previousData }
		},
		onSuccess: () => {
			disableEditing()
		},
		onError: (_error, _variable, context) => {
			queryClient.setQueryData(
				[INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, pick(searchParams, 'month.eq')],
				context.previousData
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: [INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, pick(searchParams, 'month.eq')],
				exact: true
			})
		}
	})

	return (
		<ScrollArea>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(async ({ data }) => await mutateAsync(data))}>
					<Table>
						{Array.isArray(data) && data.length > 0 ? (
							<Fragment>
								<TableRow>
									<TableVerticalHeader align='left'>Size</TableVerticalHeader>
									{data.map((item) => (
										<TableCellHead key={item.size} align='center'>
											{item.size}
										</TableCellHead>
									))}
								</TableRow>
								<TableRow>
									<TableVerticalHeader align='left'>{t('ns_erp:fields.total_init_qty')}</TableVerticalHeader>
									{data.map((item) => (
										<TableCell key={item.size} align='center'>
											{formatIntlNumber(item.int_qty)}
										</TableCell>
									))}
								</TableRow>
								<TableRow>
									<TableVerticalHeader align='left'>{t('ns_erp:fields.mo_size_qty')}</TableVerticalHeader>
									{data.map((item) => (
										<TableCell key={item.size} align='center'>
											{formatIntlNumber(item.ms_qty)}
										</TableCell>
									))}
								</TableRow>
								<TableRow>
									<TableVerticalHeader align='left'>{t('ns_erp:fields.inbound_qty')}</TableVerticalHeader>
									{data.map((item) => (
										<TableCell key={item.size} align='center'>
											{formatIntlNumber(item.ist_qty)}
										</TableCell>
									))}
								</TableRow>
								<TableRow>
									<TableVerticalHeader align='left'>{t('ns_erp:fields.outbound_qty')}</TableVerticalHeader>
									{data.map((item) => (
										<TableCell key={item.size} align='center'>
											{formatIntlNumber(item.ost_qty)}
										</TableCell>
									))}
								</TableRow>
								<TableRow>
									<TableVerticalHeader align='left'>
										{t('ns_erp:fields.actual_instock_qty')}
									</TableVerticalHeader>
									{fields.length > 0 &&
										fields.map((field, index) => {
											return (
												<TableCell key={field.id} align='center'>
													<InputFieldControl
														name={`data.${index}.mn_ist_qty`}
														type='number'
														className='h-auto w-full whitespace-nowrap rounded-none border-none bg-transparent p-0 shadow-none focus-within:border-none focus:outline-none'
														disabled={!isEditing || isPending}
													/>
												</TableCell>
											)
										})}
								</TableRow>
								<TableRow>
									<TableVerticalHeader align='left'>
										{t('ns_erp:fields.actual_outstock_qty')}
									</TableVerticalHeader>
									{fields.length > 0 &&
										fields.map((field, index) => {
											const error = form.getFieldState(`data.${index}.mn_ost_qty`).error
											return (
												<TableCell
													key={field.id}
													align='center'
													aria-invalid={error ? true : false}
													className='p-0 aria-[invalid=true]:border aria-[invalid=true]:border-destructive'>
													<InputFieldControl
														name={`data.${index}.mn_ost_qty`}
														type='number'
														className='h-auto w-full whitespace-nowrap rounded-none border-none bg-transparent p-0 shadow-none focus-within:border-none focus:outline-none'
														disabled={!isEditing || isPending}
													/>
												</TableCell>
											)
										})}
								</TableRow>
								<TableRow>
									<TableVerticalHeader align='left'>
										{t('ns_erp:fields.final_inventory_qty')}
									</TableVerticalHeader>
									{data.map((item) => (
										<TableCell key={item.size} align='center' className='hover:!ring-primary'>
											{item.fnl_qty}
										</TableCell>
									))}
								</TableRow>
							</Fragment>
						) : (
							<Div align='center' className='p-10 font-medium'>
								{t('ns_common:table.no_data')}
							</Div>
						)}
						<TableRow className='w-full'>
							<TableCell className='!w-full flex-1'>
								<Div className='inline-grid grid-cols-2 gap-x-2'>
									{isEditing ? (
										<Button
											type='button'
											size='sm'
											variant='destructive'
											onClick={() => {
												if (isPending) abortControllerRef.current.abort()
												disableEditing()
												form.reset({
													data: data.map((item) => ({
														size_numcode: item.size,
														mn_ist_qty: item.mn_ist_qty,
														mn_ost_qty: item.mn_ost_qty
													}))
												})
											}}>
											<Icon name='X' role='img' />
											{t('ns_common:actions.cancel')}
										</Button>
									) : (
										<Button
											type='button'
											size='sm'
											variant='outline'
											onClick={() => {
												abortControllerRef.current = new AbortController()
												enableEditing()
											}}>
											<Icon name='Pencil' role='img' /> {t('ns_common:actions.update')}
										</Button>
									)}

									<Button type='submit' size='sm' disabled={!isEditing || isPending}>
										<Icon
											name={isPending ? 'LoaderCircle' : 'Check'}
											role='img'
											className={isPending && 'animate-spin'}
										/>{' '}
										{isPending
											? t('ns_common:status.processing')
											: isError
												? t('ns_common:actions.retry')
												: t('ns_common:actions.save')}
									</Button>
								</Div>
							</TableCell>
						</TableRow>
					</Table>
				</form>{' '}
			</Form>
		</ScrollArea>
	)
}

const ScrollArea = tw.div`relative h-fit max-w-full overflow-auto overflow-x-scroll rounded-md border bg-background`
const Table = tw.div`[&>*>:first-child]:top-0 [&>*>:first-child]:font-medium [&>*>:first-child]:text-table-head-foreground`
const TableVerticalHeader = tw.div`sticky left-0 z-10`
const TableRow = tw.div`flex [&>*]:px-4 [&>*]:border-b [&>*]:bg-background [&>*]:py-2 [&>*]:whitespace-nowrap [&>*]:border-r [&>:last-child]:border-r-0 [&>:last-child]:flex-1 [&>:first-child]:basis-52 [&>:first-child]:min-w-52 [&>:not(:first-child)]:basis-24 [&>:not(:first-child)]:min-w-24`
const TableCell = tw.div`text-foreground text-left`
const TableCellHead = tw.div`text-table-head-foreground font-medium text-left`

InventoryReportDetailTable.displayName = 'InboundReportDetailTable'
