import RoleBaseAccessControl from '@/app/-components/-guard/role-base-access-control'
import { CommonActions, PresetBreakPoints, UserRole } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import {
	Button,
	Div,
	FieldSet,
	Icon,
	Separator,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@/components/ui'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useIsFetching } from '@tanstack/react-query'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { pick, sortBy, uniqBy } from 'lodash-es'
import React, { Fragment, useCallback, useEffect, useRef } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { v4 as uuid } from 'uuid'
import { uuidv4 } from 'zod'
import { TruckloadDeliveryStatus } from '../-constants'
import { SignatureType, usePageContext } from '../-contexts/page-context'
import { TruckloadDeliveryQueryKeys, useUpsertPurchaseOrdersMutation } from '../-hooks/use-truckload-delivery-asm'
import { type UpsertPurchaseOrdersFormValues, upsertPurchaseOrdersSchema } from '../-schemas'
import TruckloadDeliveryDetailRow from './truckload-delivery-detail-row'

type TruckloadDeliveryDetailTableProps = {
	data: ITruckloadDelivery
	onCollapse?: () => void
}

/**
 * @description Determine if the item is already stored to database
 * @param item
 * @returns {boolean}
 */
const getIsStoredToDatabase = (item: ITruckloadDelivery['delivery_details'][number]): boolean => {
	return typeof item.id === 'number'
}

/**
 * @description Determine if the item is newly added and not yet stored to database
 * @param item
 * @returns {boolean}
 */
const getIsCurrentlyAdded = (item: UpsertPurchaseOrdersFormValues['outbound_purchase_orders'][number]): boolean => {
	return uuidv4().safeParse(item.id).success
}

const TruckloadDeliveryDetailTable: React.FC<TruckloadDeliveryDetailTableProps> = ({ data, onCollapse }) => {
	const { t } = useTranslation()
	const [action, setAction, resetAction] = useResetState<CommonActions.UPDATE | null>(null)
	const form = useForm<UpsertPurchaseOrdersFormValues>({
		resolver: zodResolver(upsertPurchaseOrdersSchema)
	})
	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'outbound_purchase_orders' })
	const { user } = useAuth()
	const { mutateAsync, isPending, isError } = useUpsertPurchaseOrdersMutation()
	const toastRef = useRef<string | number | null>(null)
	const isLargeScreen = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)
	const isFetching = useIsFetching({
		predicate: (query) => query.queryKey.some((key) => key === TruckloadDeliveryQueryKeys.TRUCKLOAD_DELIVERY)
	})

	useEffect(() => {
		if (isPending || isFetching) return
		handleResetDeliveryDetails(true)
	}, [data, isPending, isPending])

	const handleResetDeliveryDetails = (shouldKeepUpdating: boolean) => {
		if (isPending || isFetching) return
		if (!shouldKeepUpdating) resetAction()
		// * Default form values from backend data
		const defaultFormValues = Array.isArray(data.delivery_details)
			? uniqBy(
					data.delivery_details
						.filter(getIsStoredToDatabase)
						.map((item) => pick(item, ['id', 'po', 'outbound_qty'])),
					(item) => item.id
				)
			: []

		// * Include newly added item using UUID v4 format, which is not yet saved to backend
		const addedItems = form.getValues('outbound_purchase_orders').filter(getIsCurrentlyAdded)

		// * Reset form values
		form.reset({
			dispatch_order: data.dispatch_order,
			outbound_purchase_orders: sortBy(
				[...defaultFormValues, ...(shouldKeepUpdating ? addedItems : [])],
				(item) => item.id
			)
		})
	}

	const handleSaveChanges = async (payload: UpsertPurchaseOrdersFormValues) => {
		toastRef.current = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(payload)
			toast.success(t('ns_common:notification.success'), { id: toastRef.current })
			handleResetDeliveryDetails(false)
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastRef.current })
		}
	}

	const handleRemoveFieldItem = useCallback(remove, [])

	return (
		<Div className='space-y-6 overflow-clip rounded-md border bg-background'>
			<Div className='relative'>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleSaveChanges)}>
						<FieldSet className='max-h-[28rem] overflow-scroll md:max-h-[500px]'>
							<Table className='w-full table-auto border-separate border-spacing-0 [&_td:has(input)]:!p-0.5 [&_td>span]:line-clamp-1 [&_td]:h-12 [&_td]:border-x-0 [&_th>span]:line-clamp-1 [&_th]:border-x-0 [&_th]:bg-table-head'>
								<TableHeader className='sticky top-0 z-10'>
									<TableRow>
										<TableHead colSpan={isLargeScreen ? 7 : 4} align='center' className='text-foreground'>
											{data.dispatch_order}
										</TableHead>
									</TableRow>
									<TableRow>
										<TableHead align='left' title={t('ns_erp:fields.po')} className='w-[30%] xl:w-[15%]'>
											<span>{t('ns_erp:fields.po')}</span>
										</TableHead>
										{isLargeScreen ? (
											<Fragment>
												<TableHead
													align='left'
													title={t('ns_erp:fields.brand_name')}
													className='md:hidden lg:hidden xl:w-[15%]'>
													<span>{t('ns_erp:fields.brand_name')}</span>
												</TableHead>
												<TableHead
													align='left'
													title={t('ns_erp:fields.factory_shoes_style')}
													className='md:hidden lg:hidden xl:w-[15%]'>
													<span>{t('ns_erp:fields.factory_shoes_style')}</span>
												</TableHead>
												<TableHead
													align='left'
													title={t('ns_erp:fields.color_sn')}
													className='md:hidden lg:hidden xl:w-[15%]'>
													<span>{t('ns_erp:fields.color_sn')}</span>
												</TableHead>
											</Fragment>
										) : (
											<TableHead align='left' className='w-[30%] xl:hidden'>
												<span>{t('ns_erp:titles.product_info')}</span>
											</TableHead>
										)}
										<TableHead
											align='left'
											title={t('ns_erp:fields.outbound_qty')}
											className='w-[30%] xl:w-[15%]'>
											<span>{t('ns_erp:fields.outbound_qty')}</span>
										</TableHead>
										{isLargeScreen && (
											<TableHead
												align='left'
												title={t('ns_common:common_fields.created_by')}
												className='md:hidden lg:hidden'>
												<span>{t('ns_common:common_fields.created_by')}</span>
											</TableHead>
										)}
										<TableHead align='right' className='w-[10%]'></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{fields.map((field, index) => {
										const rowData = data?.delivery_details?.[index] ?? {
											id: uuid(),
											po: '',
											brand_name: null,
											factory_shoes_style: null,
											color_sn: null,
											outbound_qty: 0,
											user_code_created: user.username,
											created: new Date(),
											max_outbound_qty: null
										}

										return (
											<TruckloadDeliveryDetailRow
												key={field.id}
												index={index}
												readonly={!action || data.approval_status === TruckloadDeliveryStatus.CONFIRMED}
												deletable={data.approval_status !== TruckloadDeliveryStatus.CONFIRMED}
												defaultValues={rowData}
												onRemove={handleRemoveFieldItem}
											/>
										)
									})}
								</TableBody>
								<TableFooter className='sticky bottom-0 z-10 table-footer-group'>
									{/* Summary table header */}
									<TableRow className='xl:hidden [&>th]:border-t'>
										<TableHead className='w-[25%]' colSpan={1} align='left'>
											<span>{t('ns_erp:fields.container_sealing_time')}</span>
										</TableHead>
										<TableHead className='w-[25%]' colSpan={1} align='left'>
											<span>{t('ns_erp:fields.factory_departure_time')}</span>
										</TableHead>
										<TableHead className='w-[25%]' colSpan={1} align='left'>
											<span>{t('ns_erp:fields.actual_factory_departure_time')}</span>
										</TableHead>
										<TableHead colSpan={1} align='left'>
											<span>{t('ns_common:common_fields.total')}</span>
										</TableHead>
									</TableRow>
									{/* Summary table body */}
									<TableRow className='xl:hidden'>
										<TableCell colSpan={1} align='left' className='w-[25%]'>
											{data.container_sealing_time ? (
												format(new Date(data.container_sealing_time), 'yyyy-MM-dd HH:mm')
											) : (
												<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
													<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
													{t('ns_common:titles.unknown')}
												</Typography>
											)}
										</TableCell>
										<TableCell colSpan={1} align='left' className='w-[25%]'>
											{data.factory_departure_time ? (
												format(new Date(data.factory_departure_time), 'yyyy-MM-dd HH:mm')
											) : (
												<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
													<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
													{t('ns_common:titles.unknown')}
												</Typography>
											)}
										</TableCell>
										<TableCell colSpan={1} align='left' className='w-[25%]'>
											{data.actual_factory_departure_time ? (
												format(new Date(data.actual_factory_departure_time), 'yyyy-MM-dd HH:mm')
											) : (
												<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
													<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
													{t('ns_common:titles.unknown')}
												</Typography>
											)}
										</TableCell>
										<TableCell colSpan={1} align='left'>
											{data?.total_outbound_qty}
										</TableCell>
									</TableRow>
									{/* Signatures */}
									<TableRow className='xl:[&>td]:border-t'>
										<TableCell
											colSpan={'100%' as unknown as React.ComponentProps<typeof TableCell>['colSpan']}
											className='p-0'>
											<Div className='grid grid-cols-4 [&>div]:place-content-center [&>div]:place-items-center [&>div]:px-3 [&>div]:text-center'>
												<Div className='h-10 border-b py-2'>
													<span className='line-clamp-1' title={t('ns_erp:fields.ie_signature')}>
														{t('ns_erp:fields.ie_signature')}
													</span>
												</Div>
												<Div className='h-10 border-b py-2'>
													<span
														className='line-clamp-1'
														title={t('ns_erp:fields.warehouse_officer_signature')}>
														{t('ns_erp:fields.warehouse_officer_signature')}
													</span>
												</Div>
												<Div className='h-10 border-b py-2'>
													<span
														className='line-clamp-1'
														title={t('ns_erp:fields.security_guard_signature', {
															number: 1,
															defaultValue: null
														})}>
														{t('ns_erp:fields.security_guard_signature', {
															number: 1,
															defaultValue: null
														})}
													</span>
												</Div>
												<Div className='h-10 border-b py-2'>
													<span
														className='line-clamp-1'
														title={t('ns_erp:fields.security_guard_signature', {
															number: 2,
															defaultValue: null
														})}>
														{t('ns_erp:fields.security_guard_signature', {
															number: 2,
															defaultValue: null
														})}
													</span>
												</Div>
												<Div className='has-[button]:py-2'>
													<Signature
														data={data}
														type='ie_signature'
														disabled={
															!!data.security_2_signature &&
															data.approval_status === TruckloadDeliveryStatus.CONFIRMED
														}
													/>
												</Div>
												<Div className='has-[button]:py-2'>
													<Signature
														data={data}
														type='warehouse_officer_signature'
														disabled={
															!data.license_plate ||
															(!!data.security_2_signature &&
																data.approval_status === TruckloadDeliveryStatus.CONFIRMED)
														}
													/>
												</Div>
												<Div className='has-[button]:py-2'>
													<Signature
														data={data}
														type='security_1_signature'
														disabled={
															!data.license_plate ||
															(!!data.security_2_signature &&
																data.approval_status === TruckloadDeliveryStatus.CONFIRMED)
														}
													/>
												</Div>
												<Div className='has-[button]:py-2'>
													<Signature
														data={data}
														type='security_2_signature'
														disabled={!data.license_plate}
													/>
												</Div>
											</Div>
										</TableCell>
									</TableRow>
								</TableFooter>
							</Table>
						</FieldSet>
						<Div className='m-4 grid place-content-center place-items-center gap-y-4 rounded-md border border-dashed p-4'>
							{action && (
								<Div className='col-span-full inline-flex items-stretch'>
									<Icon
										name='BotMessageSquare'
										size={24}
										className='mr-2 duration-500 animate-in zoom-in-0 slide-in-from-bottom-2'
									/>
									&quot;
									<Typewriter
										className='text-sm italic'
										text={t('ns_inoutbound:description.duplicate_po_added')}
										typeSpeed={25}
										delay={0}
									/>
									&quot;
								</Div>
							)}
							<Div className='flex items-center gap-x-1'>
								<RoleBaseAccessControl
									authorizedRoles={[UserRole.FG_WAREHOUSE_STAFF, UserRole.IE_STAFF]}
									mode='fallback'
									fallbackComponent={
										<Button
											type='button'
											onClick={() =>
												toast.warning(t('ns_common:errors.403_notification'), { id: 'action-403-warning' })
											}
											size='sm'
											className='w-full'>
											<Icon name='Lock' />
											{t('ns_common:actions.update')}
										</Button>
									}>
									{!action ? (
										<Button
											variant='default'
											type='button'
											size='sm'
											disabled={data.approval_status === TruckloadDeliveryStatus.CONFIRMED}
											onClick={() => setAction(CommonActions.UPDATE)}>
											<Icon name='PencilLine' /> {t('ns_common:actions.update')}
										</Button>
									) : (
										<Fragment>
											<Button
												variant='outline'
												type='button'
												size='sm'
												className='border-dashed'
												disabled={isPending}
												onClick={() =>
													append({
														id: uuid(),
														po: '',
														outbound_qty: null,
														max_outbound_qty: null
													})
												}>
												<Icon name='ListPlus' /> {t('ns_common:table.add_row')}
											</Button>
											<Separator orientation='vertical' className='mx-2 h-8' />
											<Button type='submit' size='sm' disabled={isPending}>
												<Icon
													name={isPending ? 'LoaderCircle' : 'Check'}
													className={isPending && 'animate-spin'}
												/>
												{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
											</Button>
											<Button
												type='button'
												size='sm'
												variant='secondary'
												onClick={() => handleResetDeliveryDetails(false)}
												disabled={isPending}>
												<Icon name='X' />
												{t('ns_common:actions.cancel')}
											</Button>
										</Fragment>
									)}
								</RoleBaseAccessControl>
								{action && <Separator orientation='vertical' className='mx-2 h-8' />}
								<Button
									variant='outline'
									type='button'
									size='sm'
									onClick={() => {
										onCollapse()
										handleResetDeliveryDetails(false)
									}}>
									<Icon name='ChevronsUp' /> {t('ns_common:actions.fold')}
								</Button>
							</Div>
						</Div>
					</Form>
				</FormProvider>
			</Div>
		</Div>
	)
}

const signatureRolesMap: Map<SignatureType, UserRole[]> = new Map([
	['ie_signature', [UserRole.IE_STAFF]],
	['warehouse_officer_signature', [UserRole.FG_WAREHOUSE_STAFF]],
	['security_1_signature', [UserRole.SECURITY_GUARD]],
	['security_2_signature', [UserRole.SECURITY_GUARD]]
])

const Signature: React.FC<{
	data: ITruckloadDelivery
	type: SignatureType
	disabled?: boolean
}> = ({ data, type, disabled }) => {
	const { event$ } = usePageContext()

	function handleUpdateSignature<Element extends HTMLElement>(e: React.MouseEvent<Element, MouseEvent>) {
		e.stopPropagation()
		if (disabled) return
		event$.emit({
			action: 'UPDATE_DISPATCH_ORDER_SIGNATURE',
			payload: {
				...pick(data, ['dispatch_order', 'license_plate', 'approval_status']),
				signature_type: type
			}
		})
	}

	return (
		<RoleBaseAccessControl
			authorizedRoles={signatureRolesMap.get(type)}
			classNames={{ wrapper: '[&>[data-slot=rbac-mask]>svg]:size-[18px]' }}>
			<Div className='grid place-items-center p-2'>
				{data[type] ? (
					<img
						loading='lazy'
						className='aspect-video max-w-24 cursor-pointer object-contain object-center dark:invert md:max-w-20'
						src={data[type]}
						onClick={handleUpdateSignature}
					/>
				) : (
					<Button
						disabled={disabled}
						size='icon'
						variant='secondary'
						type='button'
						onClick={handleUpdateSignature}>
						<Icon name='PenTool' className='rotate-[-90deg]' />
					</Button>
				)}
			</Div>
		</RoleBaseAccessControl>
	)
}

const Form = tw.form`flex flex-col`

export default TruckloadDeliveryDetailTable
