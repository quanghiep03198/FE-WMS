'use no memo'

import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@/app/-components/-guard/role-base-access-control'
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
import type { ITruckloadDelivery, ITruckloadDeliveryDetail } from '@/services/truckload-delivery.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { pick, sortBy, uniqBy } from 'lodash-es'
import React, { Fragment, useEffect } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { v4 as uuid } from 'uuid'
import { uuidv4 } from 'zod'
import { TruckloadDeliveryStatus } from '../-constants'
import type { SignatureType } from '../-contexts/page-context'
import { usePageContext } from '../-contexts/page-context'
import {
	getTruckloadDeliveryDetailQueryOptions,
	useUpsertPurchaseOrdersMutation
} from '../-hooks/use-truckload-delivery-asm'
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

const TruckloadDeliveryDetailTable: React.FC<TruckloadDeliveryDetailTableProps> = ({
	data: {
		dispatch_order,
		license_plate,
		approval_status,
		ie_signature,
		warehouse_officer_signature,
		security_1_signature,
		security_2_signature,
		container_sealing_time,
		factory_departure_time,
		actual_departure_time,
		total_outbound_qty
	},
	onCollapse
}) => {
	const { t } = useTranslation()
	const [action, setAction, resetAction] = useResetState<CommonActions.UPDATE | null>(null)
	const form = useForm<UpsertPurchaseOrdersFormValues>({
		resolver: zodResolver(upsertPurchaseOrdersSchema)
	})
	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'outbound_purchase_orders' })
	const { user } = useAuth()
	const { mutateAsync, isPending, isError } = useUpsertPurchaseOrdersMutation(dispatch_order)
	const isLargeScreen = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)
	const { data } = useQuery(getTruckloadDeliveryDetailQueryOptions(dispatch_order))

	const handleResetDeliveryDetails = (shouldKeepUpdating: boolean) => {
		if (!shouldKeepUpdating) resetAction()
		// * Default form values from backend data
		const defaultFormValues = Array.isArray(data)
			? uniqBy(
					data.filter(getIsStoredToDatabase).map((item) => pick(item, ['id', 'po', 'outbound_qty'])),
					(item) => item.id
				)
			: []

		// * Include newly added item using UUID v4 format, which is not yet saved to backend
		const addedItems = form.getValues('outbound_purchase_orders').filter(getIsCurrentlyAdded)

		// * Reset form values
		const newFormValues = {
			dispatch_order,
			outbound_purchase_orders: sortBy(
				[...defaultFormValues, ...(shouldKeepUpdating ? addedItems : [])],
				(item) => item.id
			)
		}
		form.reset(newFormValues)
	}

	useEffect(() => {
		// if (isPending || isFetching) return
		handleResetDeliveryDetails(true)
	}, [data, isPending, isPending])

	const handleSaveChanges = async (payload: UpsertPurchaseOrdersFormValues) => {
		const toastId = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(payload)
			toast.success(t('ns_common:notification.success'), { id: toastId })
			handleResetDeliveryDetails(false)
			// refetch()
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastId })
		}
	}

	const signatureData = {
		dispatch_order,
		license_plate,
		approval_status,
		ie_signature,
		warehouse_officer_signature,
		security_1_signature,
		security_2_signature
	}

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
											{dispatch_order}
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
										const defaultValues = data.find((item) => item.po === field.po)
										const rowData: ITruckloadDeliveryDetail = defaultValues
											? {
													...defaultValues,
													max_outbound_qty: defaultValues.po_qty - defaultValues.dispatched_outbound_qty
												}
											: {
													id: uuid(),
													po: '',
													brand_name: null,
													factory_shoes_style: null,
													color_sn: null,
													outbound_qty: 0,
													dispatched_outbound_qty: 0,
													po_qty: 0,
													user_code_created: user.username,
													created: new Date(),
													max_outbound_qty: null
												}

										return (
											<TruckloadDeliveryDetailRow
												key={field.id}
												index={index}
												readOnly={!action || approval_status === TruckloadDeliveryStatus.CONFIRMED}
												deletable={approval_status !== TruckloadDeliveryStatus.CONFIRMED}
												defaultValues={rowData}
												onRemove={remove}
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
											<span>{t('ns_erp:fields.actual_departure_time')}</span>
										</TableHead>
										<TableHead colSpan={1} align='left'>
											<span>{t('ns_common:common_fields.total')}</span>
										</TableHead>
									</TableRow>
									{/* Summary table body */}
									<TableRow className='xl:hidden'>
										<TableCell colSpan={1} align='left' className='w-[25%]'>
											{container_sealing_time ? (
												format(new Date(container_sealing_time), 'yyyy-MM-dd HH:mm')
											) : (
												<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
													<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
													{t('ns_common:titles.unknown')}
												</Typography>
											)}
										</TableCell>
										<TableCell colSpan={1} align='left' className='w-[25%]'>
											{factory_departure_time ? (
												format(new Date(factory_departure_time), 'yyyy-MM-dd HH:mm')
											) : (
												<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
													<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
													{t('ns_common:titles.unknown')}
												</Typography>
											)}
										</TableCell>
										<TableCell colSpan={1} align='left' className='w-[25%]'>
											{actual_departure_time ? (
												format(new Date(actual_departure_time), 'yyyy-MM-dd HH:mm')
											) : (
												<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
													<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
													{t('ns_common:titles.unknown')}
												</Typography>
											)}
										</TableCell>
										<TableCell colSpan={1} align='left'>
											{total_outbound_qty}
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
														data={signatureData}
														type='ie_signature'
														disabled={
															!!security_2_signature &&
															approval_status === TruckloadDeliveryStatus.CONFIRMED
														}
													/>
												</Div>
												<Div className='has-[button]:py-2'>
													<Signature
														data={signatureData}
														type='warehouse_officer_signature'
														disabled={
															!license_plate ||
															(!!security_2_signature &&
																approval_status === TruckloadDeliveryStatus.CONFIRMED)
														}
													/>
												</Div>
												<Div className='has-[button]:py-2'>
													<Signature
														data={signatureData}
														type='security_1_signature'
														disabled={
															!license_plate ||
															(!!security_2_signature &&
																approval_status === TruckloadDeliveryStatus.CONFIRMED)
														}
													/>
												</Div>
												<Div className='has-[button]:py-2'>
													<Signature
														data={signatureData}
														type='security_2_signature'
														disabled={!license_plate}
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
												toast.warning(t('ns_common:errors.403_notification'), {
													id: ACTION_RESTRICTED_TOAST_ID
												})
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
											disabled={approval_status === TruckloadDeliveryStatus.CONFIRMED}
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
	data: Pick<ITruckloadDelivery, 'dispatch_order' | 'license_plate' | 'approval_status'>
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
						alt={type}
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
