'use no memo'

import useQueryParams from '@/common/hooks/use-query-params'
import { IMonthlyInventoryReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Div, Input } from '@/components/ui'
import { ReportService } from '@/services/report.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebounce, useUpdateEffect } from 'ahooks'
import { omit, pick } from 'lodash'
import React, { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { INVENTORY_REPORT_PROVIDE_TAG } from '../../_apis/use-report.api'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'

type BaseUpdateUpdateQuery = Pick<
	IMonthlyInventoryReport,
	'po' | 'mo_no' | 'shoes_style_code_factory' | 'cust_shoestyle' | 'inv_type' | 'inv_year_month'
> & { size_numcode: string }

export const InventoryReportDetailTable: React.FC<{
	info: Omit<BaseUpdateUpdateQuery, 'size_numcode'>
	sizes: IMonthlyInventoryReport['size_data']
}> = ({ info, sizes }) => {
	const { t } = useTranslation()

	return (
		<ScrollArea>
			<Table>
				{Array.isArray(sizes) && sizes.length > 0 ? (
					<Fragment>
						<TableRow>
							<TableVerticalHeader align='left'>Size</TableVerticalHeader>
							{sizes.map((item) => (
								<TableCellHead key={item.size} align='center'>
									{item.size}
								</TableCellHead>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.total_init_qty')}</TableVerticalHeader>
							{sizes.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.int_qty)}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.mo_size_qty')}</TableVerticalHeader>
							{sizes.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.ms_qty)}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.inbound_qty')}</TableVerticalHeader>
							{sizes.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.ist_qty)}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.outbound_qty')}</TableVerticalHeader>
							{sizes.map((item) => (
								<TableCell key={item.size} align='center'>
									{formatIntlNumber(item.ost_qty)}
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.actual_instock_qty')}</TableVerticalHeader>
							{sizes.map((item) => (
								<TableCell key={item.size} align='center'>
									<CellContentEditable
										{...{
											...info,
											size_numcode: item.size,
											name: 'mn_ist_qty',
											value: item.mn_ist_qty
										}}
									/>
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.actual_outstock_qty')}</TableVerticalHeader>
							{sizes.map((item) => (
								<TableCell key={item.size} align='center'>
									<CellContentEditable
										{...{
											...info,
											size_numcode: item.size,
											name: 'mn_ost_qty',
											value: item.mn_ost_qty
										}}
									/>
								</TableCell>
							))}
						</TableRow>
						<TableRow>
							<TableVerticalHeader align='left'>{t('ns_erp:fields.final_inventory_qty')}</TableVerticalHeader>
							{sizes.map((item) => (
								<TableCell key={item.size} align='center' className='hover:!ring-primary'>
									<CellContentEditable
										{...{ ...info, size_numcode: item.size, name: 'fnl_qty', value: item.fnl_qty }}
									/>
								</TableCell>
							))}
						</TableRow>
					</Fragment>
				) : (
					<Div align='center' className='p-10 font-medium'>
						{t('ns_common:table.no_data')}
					</Div>
				)}
			</Table>
		</ScrollArea>
	)
}

const CellContentEditable: React.FC<{ name: string; value: string | number } & BaseUpdateUpdateQuery> = (props) => {
	const [value, setValue] = useState<string | number>(props.value)
	const { searchParams } = useQueryParams()
	const debouncedValue = useDebounce(value, { wait: 500 })
	const { data: currentTenant } = useGetTenantByFactory()
	const queryClient = useQueryClient()

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async () =>
			await ReportService.updateInventoryReport(
				currentTenant?.id,
				{ ...omit(props, 'value') },
				{ [props.name]: +debouncedValue }
			),
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
		onError: (_error, _variable, context) => {
			queryClient.setQueryData(
				[INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, pick(searchParams, 'month.eq')],
				context.previousData
			)
		},
		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: [INVENTORY_REPORT_PROVIDE_TAG, currentTenant?.id, pick(searchParams, 'month.eq')],
				exact: true
			})
	})

	useUpdateEffect(() => {
		mutateAsync()
	}, [debouncedValue])

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
			}}>
			<Input
				type='number'
				name={props.name}
				className='h-auto whitespace-nowrap border-none p-0 text-center shadow-none focus-within:border-none focus:outline-none'
				disabled={isPending}
				defaultValue={props.value}
				value={value}
				required={true}
				onChange={(e) => setValue(e.currentTarget.value)}
			/>
		</form>
	)
}

const ScrollArea = tw.div`relative h-fit max-w-full overflow-auto overflow-x-scroll rounded-md border bg-background`
const Table = tw.div`[&>*>:first-child]:top-0 [&>*>:first-child]:font-medium [&>*>:first-child]:text-table-head-foreground`
const TableVerticalHeader = tw.div`sticky left-0 z-10`
const TableRow = tw.div`flex [&>*]:px-4 [&>*]:border-b [&>*]:bg-background [&>*]:py-2 [&>*]:whitespace-nowrap [&>*]:border-r [&>:last-child]:border-r-0 [&>:first-child]:basis-52 [&>:first-child]:min-w-52 [&>:not(:first-child)]:basis-24 [&>:not(:first-child)]:min-w-24`
const TableCell = tw.div`text-foreground`
const TableCellHead = tw.div`text-table-head-foreground font-medium`

InventoryReportDetailTable.displayName = 'InboundReportDetailTable'
