import RoleBaseAccessControl from '@/app/-components/-guard/role-base-access-control'
import { Languages, UserRole } from '@/common/constants/enums'
import useQueryParams from '@/common/hooks/use-query-params'
import type { IMonthlyInventoryAudit } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import { Button, Div, Form, Icon, InputFieldControl, Typography } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useIsFetching } from '@tanstack/react-query'
import { useBoolean, useUpdateEffect } from 'ahooks'
import { format } from 'date-fns'
import React, { Fragment, useMemo, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { InventoryAuditQueryKeys, useInventoryAuditMutation } from '../-hooks/use-inventory-audit-asm'
import type { InventoryAuditFormValues } from '../-schemas/inventory-audit.schema'
import { reportDataSchema } from '../-schemas/inventory-audit.schema'
import type { BaseUpdateUpdateQuery } from '../-types'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy-asm'

type InventoryReportDetailTableProps = {
	queries: Omit<BaseUpdateUpdateQuery, 'size_numcode'>
	data: IMonthlyInventoryAudit['detail']
}

export const InventoryReportDetailTable: React.FC<InventoryReportDetailTableProps> = ({ queries, data }) => {
	const { t, i18n } = useTranslation()

	const { searchParams } = useQueryParams<{ 'month:eq': string }>({ 'month:eq': format(new Date(), 'yyyy-MM') })

	// * Handle toggle enable editing
	const [isEditing, { setTrue: enableEditing, setFalse: disableEditing }] = useBoolean(false)

	const form = useForm<InventoryAuditFormValues>({
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

	const { data: currentTenant } = useGetTenantByFactory()

	// * Implement optimistic update on save manual changes
	const { mutateAsync, isPending, isError, isSuccess } = useInventoryAuditMutation(
		queries,
		abortControllerRef?.current?.signal
	)

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

	useUpdateEffect(() => {
		if (isSuccess) disableEditing()
	}, [isSuccess])

	const fetchingQueries = useIsFetching({
		queryKey: [InventoryAuditQueryKeys.INVENTORY_AUDIT, currentTenant?.id, searchParams],
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
													className='p-0 aria-[invalid=true]:bg-destructive'>
													<InputFieldControl
														name={`data.${index}.mn_ist_qty`}
														type='number'
														errorMessageVariant='tooltip'
														disabled={!isEditing || isLoading}
														className={cn(
															'h-auto w-full whitespace-nowrap rounded-none border-none bg-transparent p-0 shadow-none aria-[invalid=true]:bg-destructive/20 focus:outline-none',
															form.watch(`data.${index}.mn_ist_qty`) !== 0
																? 'text-destructive disabled:text-destructive/80'
																: 'text-foreground'
														)}
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
													className='p-0 aria-[invalid=true]:bg-destructive/20'>
													<InputFieldControl
														name={`data.${index}.mn_ost_qty`}
														type='number'
														errorMessageVariant='tooltip'
														disabled={!isEditing || isLoading}
														className={cn(
															'h-auto w-full whitespace-nowrap rounded-none border-none p-0 shadow-none aria-[invalid=true]:bg-destructive/20 focus:outline-none',
															form.watch(`data.${index}.mn_ost_qty`) !== 0
																? 'text-destructive disabled:text-destructive/80'
																: 'text-foreground'
														)}
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
								<RoleBaseAccessControl
									mode='fallback'
									authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF]}
									fallbackComponent={
										<Typography
											variant='small'
											color='destructive'
											className='inline-flex items-center gap-x-2 font-normal [text-transform:none]'>
											<Icon name='TriangleAlert' />
											{t('ns_auth:notification.viewonly')}
										</Typography>
									}>
									<Div className='inline-grid grid-cols-2 gap-x-2'>
										{isEditing ? (
											<Button
												type='button'
												size='sm'
												variant='secondary'
												onClick={() => handleCancelUpdate()}>
												<Icon name='X' />
												<span>{t('ns_common:actions.cancel')}</span>
											</Button>
										) : (
											<Button type='button' size='sm' variant='outline' onClick={() => handleStartUpdate()}>
												<Icon name='Pencil' /> {t('ns_common:actions.update')}
											</Button>
										)}
										{isEditing && (
											<Button type='submit' size='sm' disabled={isLoading}>
												<Icon
													name={isPending ? 'LoaderCircle' : 'Check'}
													className={isPending && 'animate-spin'}
												/>{' '}
												{isPending
													? t('ns_common:status.processing')
													: isError
														? t('ns_common:actions.retry')
														: t('ns_common:actions.save')}
											</Button>
										)}
									</Div>
								</RoleBaseAccessControl>
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
