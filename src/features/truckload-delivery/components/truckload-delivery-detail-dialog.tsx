'use no memo'

import { CommonActions, PresetBreakPoints, UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import env from '@common/utils/env'
import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@components/guards/role-base-access-control'
import { GhostButton } from '@components/shared/ghost-button'
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	FieldGroup,
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
} from '@components/ui'
import { Typewriter } from '@components/ui/@custom/type-writter'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuth from '@hooks/use-auth'
import useCopyToClipboard from '@hooks/use-copy-to-clipboard'
import useMediaQuery from '@hooks/use-media-query'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { isNil, pick, uniqBy } from 'lodash-es'
import { Copy, CopyCheck } from 'lucide'
import { MorphIcon } from 'morphicons/react'
import React, { Fragment, memo, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import type { Resolver } from 'react-hook-form'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { TruckloadDeliveryStatus } from '../constants'
import type { SignatureType } from '../contexts/page-context'
import { usePageContext } from '../contexts/page-context'
import { useUpsertPurchaseOrdersMutation } from '../hooks/use-truckload-delivery-request'
import { type UpsertPurchaseOrdersFormValues, upsertPurchaseOrdersSchema } from '../schemas'
import type { ITruckloadDelivery, ITruckloadDeliveryPacking } from '../types'
import TruckloadDeliveryDetailRow from './truckload-delivery-detail-row'

const signatureRolesMap: Map<SignatureType, UserRole[]> = new Map([
	['ie_signature', [UserRole.IE_STAFF]],
	['warehouse_officer_signature', [UserRole.FG_WAREHOUSE_STAFF]],
	['security_1_signature', [UserRole.SECURITY_GUARD]],
	['security_2_signature', [UserRole.SECURITY_GUARD]]
])

const TruckloadDeliveryDetailDialog: React.FC<{ data: ITruckloadDelivery }> = ({ data }) => {
	const { t } = useTranslation()
	const [open, setOpen] = useState<boolean>(false)
	const [copyToClipboard, { data: coppiedText }] = useCopyToClipboard()

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open)
			}}>
			<DialogTrigger className='text-muted-foreground hover:text-foreground absolute inset-0 flex cursor-pointer items-center justify-center duration-200'>
				<Icon name='SquareArrowOutUpRight' size={14} />
			</DialogTrigger>
			<DialogContent className='max-w-8xl h-screen w-full overflow-hidden rounded-none xl:h-[95vh] xl:rounded-lg'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.dispatch_order_detail')}</DialogTitle>
					<DialogDescription className='inline-flex items-center gap-x-2'>
						{data.dispatch_order}
						<GhostButton
							aria-pressed={coppiedText === data.dispatch_order}
							className='aria-pressed:[&>svg]:stroke-active [&>svg]:stroke-muted-foreground hover:[&>svg]:stroke-foreground'
							onClick={() => copyToClipboard(data.dispatch_order)}>
							<MorphIcon
								icon={coppiedText === data.dispatch_order ? CopyCheck : Copy}
								size={16}
								spring='smooth'
							/>
						</GhostButton>
					</DialogDescription>
				</DialogHeader>
				<PurchaseOrdersTableForm data={data} open={open} />
				<SignatureTable
					data={pick(data, [
						'dispatch_order',
						'license_plate',
						'approval_status',
						'ie_signature',
						'warehouse_officer_signature',
						'security_1_signature',
						'security_2_signature'
					])}
				/>
			</DialogContent>
		</Dialog>
	)
}

const PurchaseOrdersTableForm: React.FC<{ data: ITruckloadDelivery; open: boolean }> = ({ data, open }) => {
	const [action, setAction, resetAction] = useResetState<CommonActions.UPDATE | null>(null)
	const { t } = useTranslation()
	const { mutateAsync, isPending, isError } = useUpsertPurchaseOrdersMutation()
	const { user } = useAuth()
	const form = useForm<UpsertPurchaseOrdersFormValues>({
		resolver: zodResolver(upsertPurchaseOrdersSchema) as Resolver<UpsertPurchaseOrdersFormValues>
	})

	const isLargeScreen = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)
	const { fields, append, remove } = useFieldArray({ control: form.control, name: 'outbound_purchase_orders' })
	const handleResetDeliveryDetails = () => {
		if (!data.dispatch_order || !Array.isArray(data.packing)) return

		const defaultFormValues = uniqBy(
			data.packing.map((item) => ({
				...pick(item, ['po', 'outbound_qty', 'brand_name', 'factory_shoes_style', 'color_sn', 'created_at']),
				brand_name: item.brand_name ?? undefined,
				factory_shoes_style: item.factory_shoes_style ?? undefined,
				color_sn: item.color_sn ?? undefined,
				max_outbound_qty: !isNil(item.max_outbound_qty)
					? item.outbound_qty
					: item.order_qty - item.dispatched_outbound_qty + item.outbound_qty,
				created_by: item.created_by?.username
			})),
			(item) => item.po
		)

		// * Reset form values
		const newFormValues = {
			dispatch_order: data.dispatch_order,
			outbound_purchase_orders: defaultFormValues.sort(
				(a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
			)
		}

		form.reset(newFormValues)
	}

	useEffect(() => {
		if (open) handleResetDeliveryDetails()
		else form.reset()
	}, [open, data.packing, data.dispatch_order])

	const handleSaveChanges = async (payload: UpsertPurchaseOrdersFormValues) => {
		const toastId = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(payload)
			toast.success(t('ns_common:notification.success'), { id: toastId })
		} catch (e) {
			console.error('Error on handleSaveChanges :>>', e)
			toast.error(t('ns_common:notification.error'), { id: toastId })
		} finally {
			form.reset({
				dispatch_order: data.dispatch_order,
				outbound_purchase_orders: uniqBy(
					data.packing.map((item) => ({
						...pick(item, ['po', 'outbound_qty', 'created_at']),
						max_outbound_qty: !isNil(item.max_outbound_qty)
							? item.outbound_qty
							: item.order_qty - item.dispatched_outbound_qty + item.outbound_qty
					})),
					(item) => item.po
				)
			})
		}
	}

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(handleSaveChanges)}>
				<FieldSet className='h-[50vh] overflow-scroll md:max-h-full'>
					<Table className='[&_th]:bg-table-head w-full table-auto border-separate border-spacing-0 [&_td]:h-12 [&_td]:border-x-0 [&_td:has(input)]:p-0.5! [&_td>span]:line-clamp-1 [&_th]:border-x-0 [&_th>span]:line-clamp-1'>
						<TableHeader className='sticky top-0 z-10'>
							<TableRow>
								<TableHead align='left' className='w-[30%] xl:w-[15%]' title={t('ns_erp:fields.po')}>
									<span>{t('ns_erp:fields.po')}</span>
								</TableHead>
								{isLargeScreen ? (
									<Fragment>
										<TableHead
											align='left'
											className='md:hidden lg:hidden xl:w-[15%]'
											title={t('ns_erp:fields.brand_name')}>
											<span>{t('ns_erp:fields.brand_name')}</span>
										</TableHead>
										<TableHead
											align='left'
											className='md:hidden lg:hidden xl:w-[15%]'
											title={t('ns_erp:fields.factory_shoes_style')}>
											<span>{t('ns_erp:fields.factory_shoes_style')}</span>
										</TableHead>
										<TableHead
											align='left'
											className='md:hidden lg:hidden xl:w-[15%]'
											title={t('ns_erp:fields.color_sn')}>
											<span>{t('ns_erp:fields.color_sn')}</span>
										</TableHead>
									</Fragment>
								) : (
									<TableHead align='left' className='w-[30%] xl:hidden'>
										<span>{t('ns_erp:titles.product_info')}</span>
									</TableHead>
								)}
								<TableHead align='left' className='w-[30%] xl:w-[15%]' title={t('ns_erp:fields.outbound_qty')}>
									<span>{t('ns_erp:fields.outbound_qty')}</span>
								</TableHead>
								{isLargeScreen && (
									<TableHead
										align='left'
										className='md:hidden lg:hidden'
										title={t('ns_common:common_fields.created_by')}>
										<span>{t('ns_common:common_fields.created_by')}</span>
									</TableHead>
								)}
								<TableHead align='right' className='w-[10%]'></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{fields.map((field, index) => {
								const defaultValues = data.packing.find((item) => item.po === field.po)
								const rowData: ITruckloadDeliveryPacking = !isNil(defaultValues)
									? {
											...defaultValues,
											max_outbound_qty: defaultValues.order_qty - defaultValues.dispatched_outbound_qty
										}
									: {
											po: '',
											brand_name: '',
											factory_shoes_style: '',
											color_sn: '',
											order_qty: Infinity,
											outbound_qty: 0,
											dispatched_outbound_qty: 0,
											user_code_created: user?.username,
											created: new Date(),
											max_outbound_qty: Infinity,
											created_by: user?.username
										}

								return (
									<TruckloadDeliveryDetailRow
										defaultValues={rowData}
										deletable={data.approval_status !== TruckloadDeliveryStatus.CONFIRMED}
										dispatchOrder={data.dispatch_order}
										index={index}
										isLargeScreen={isLargeScreen}
										isPersisted={data.packing.some((item) => item.po === field.po)}
										key={field.po || field.id}
										readOnly={!action || data.approval_status === TruckloadDeliveryStatus.CONFIRMED}
										onRemove={remove}
									/>
								)
							})}
						</TableBody>
						<TableFooter className='sticky bottom-0 z-10 xl:hidden [&_th]:border-t'>
							<TableRow>
								<TableHead align='left' className='w-1/4'>
									<span>{t('ns_erp:fields.container_sealing_time')}</span>
								</TableHead>
								<TableHead align='left' className='w-1/4'>
									<span>{t('ns_erp:fields.factory_departure_time')}</span>
								</TableHead>
								<TableHead align='left' className='w-1/4'>
									<span>{t('ns_erp:fields.actual_departure_time')}</span>
								</TableHead>
								<TableHead align='left' className='w-1/4'>
									<span>{t('ns_common:common_fields.total')}</span>
								</TableHead>
							</TableRow>
							<TableRow>
								<TableCell>
									{data.container_sealing_time ? (
										format(new Date(data.container_sealing_time), 'yyyy-MM-dd HH:mm')
									) : (
										<Typography className='flex items-center gap-x-2' color='muted' variant='small'>
											<Icon name='ClockAlert' stroke='var(--muted-foreground)' />
											{t('ns_common:titles.unknown')}
										</Typography>
									)}
								</TableCell>
								<TableCell>
									{data.factory_departure_time ? (
										format(new Date(data.factory_departure_time), 'yyyy-MM-dd HH:mm')
									) : (
										<Typography className='flex items-center gap-x-2' color='muted' variant='small'>
											<Icon name='ClockAlert' stroke='var(--muted-foreground)' />
											{t('ns_common:titles.unknown')}
										</Typography>
									)}
								</TableCell>
								<TableCell>
									{data.actual_departure_time ? (
										format(new Date(data.actual_departure_time), 'yyyy-MM-dd HH:mm')
									) : (
										<Typography className='flex items-center gap-x-2' color='muted' variant='small'>
											<Icon name='ClockAlert' stroke='var(--muted-foreground)' />
											{t('ns_common:titles.unknown')}
										</Typography>
									)}
								</TableCell>
								<TableCell>{data.total_outbound_qty}</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</FieldSet>

				{/* Form Actions */}
				<FieldGroup className='grid place-content-center place-items-center gap-y-4 rounded-md pt-6'>
					<Div className='col-span-full inline-flex items-stretch'>
						<Icon
							className='animate-in zoom-in-0 slide-in-from-bottom-2 mr-2 duration-500'
							name='BotMessageSquare'
							size={24}
						/>
						&quot;
						<Typewriter
							className='text-sm italic'
							delay={0}
							text={t('ns_inoutbound:description.duplicate_po_added')}
							typeSpeed={18}
						/>
						&quot;
					</Div>
					<Div className='flex items-center gap-x-2'>
						<RoleBaseAccessControl
							authorizedRoles={[UserRole.FG_WAREHOUSE_STAFF, UserRole.IE_STAFF]}
							mode='fallback'
							fallbackComponent={
								<Button
									className='w-full'
									size='sm'
									type='button'
									onClick={() =>
										toast.warning(t('ns_common:errors.403_notification'), {
											id: ACTION_RESTRICTED_TOAST_ID
										})
									}>
									<Icon name='Lock' />
									{t('ns_common:actions.update')}
								</Button>
							}>
							{!action ? (
								<Button
									disabled={data.approval_status === TruckloadDeliveryStatus.CONFIRMED}
									size='sm'
									type='button'
									variant='default'
									onClick={() => setAction(CommonActions.UPDATE)}>
									<Icon name='PencilLine' /> {t('ns_common:actions.update')}
								</Button>
							) : (
								<Fragment>
									<Button
										className='border-dashed'
										disabled={isPending}
										size='sm'
										type='button'
										variant='outline'
										onClick={() =>
											append({
												po: '',
												outbound_qty: 0,
												max_outbound_qty: Infinity,
												brand_name: t('ns_common:titles.unknown'),
												factory_shoes_style: t('ns_common:titles.unknown'),
												color_sn: t('ns_common:titles.unknown'),
												created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
												created_by: user?.username
											})
										}>
										<Icon name='ListPlus' /> {t('ns_common:table.add_row')}
									</Button>
									<Separator className='mx-2 h-8' orientation='vertical' />
									<Button disabled={isPending} size='sm' type='submit'>
										<Icon
											className={cn(isPending && 'animate-spin')}
											name={isPending ? 'LoaderCircle' : 'SaveAll'}
										/>
										{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
									</Button>
									<Button
										disabled={isPending}
										size='sm'
										type='button'
										variant='secondary'
										onClick={() => {
											handleResetDeliveryDetails()
											resetAction()
										}}>
										<Icon name='Undo2' />
										{t('ns_common:actions.cancel')}
									</Button>
								</Fragment>
							)}
						</RoleBaseAccessControl>
						{action && <Separator className='mx-2 h-8' orientation='vertical' />}
						<DialogClose asChild>
							<Button size='sm' variant='secondary'>
								<Icon name='X' />
								{t('ns_common:actions.close')}
							</Button>
						</DialogClose>
					</Div>
				</FieldGroup>
			</Form>
		</FormProvider>
	)
}

const Signature: React.FC<{
	data: Pick<ITruckloadDelivery, 'dispatch_order' | 'license_plate' | 'approval_status' | SignatureType>
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

	const signature = env('VITE_API_BASE_URL') + data[type]

	return (
		<RoleBaseAccessControl
			strict
			authorizedRoles={signatureRolesMap.get(type) ?? []}
			classNames={{ wrapper: '[&>[data-slot=rbac-mask]>svg]:size-4.5' }}>
			<Div className='grid place-items-center p-2'>
				{data[type] ? (
					<img
						alt={type}
						className='aspect-video max-w-24 cursor-pointer object-contain object-center md:max-w-20 dark:invert'
						loading='lazy'
						src={signature}
						onClick={handleUpdateSignature}
					/>
				) : (
					<Button
						disabled={disabled}
						size='icon'
						type='button'
						variant='secondary'
						onClick={handleUpdateSignature}>
						<Icon className='-rotate-90' name='PenTool' />
					</Button>
				)}
			</Div>
		</RoleBaseAccessControl>
	)
}

const SignatureTable: React.FC<{
	data: Pick<ITruckloadDelivery, 'dispatch_order' | 'license_plate' | 'approval_status' | SignatureType>
}> = memo(
	({ data }) => {
		const { t } = useTranslation()

		return (
			<Table className='w-full table-fixed [&_tr>*]:border-x-0'>
				<TableHeader>
					<TableRow className='*:bg-table-head'>
						<TableHead>
							<span className='line-clamp-1' title={t('ns_erp:fields.ie_signature')}>
								{t('ns_erp:fields.ie_signature')}
							</span>
						</TableHead>
						<TableHead>
							<span className='line-clamp-1' title={t('ns_erp:fields.warehouse_officer_signature')}>
								{t('ns_erp:fields.warehouse_officer_signature')}
							</span>
						</TableHead>
						<TableHead>
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
						</TableHead>
						<TableHead>
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
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>
							<Signature
								data={data}
								type='ie_signature'
								disabled={
									!!data?.security_2_signature && data?.approval_status === TruckloadDeliveryStatus.CONFIRMED
								}
							/>
						</TableCell>
						<TableCell>
							<Signature
								data={data}
								type='warehouse_officer_signature'
								disabled={
									!data.license_plate ||
									(!!data.security_2_signature && data.approval_status === TruckloadDeliveryStatus.CONFIRMED)
								}
							/>
						</TableCell>
						<TableCell>
							<Signature
								data={data}
								type='security_1_signature'
								disabled={
									!data.license_plate ||
									(!!data.security_2_signature && data.approval_status === TruckloadDeliveryStatus.CONFIRMED)
								}
							/>
						</TableCell>
						<TableCell>
							<Signature data={data} disabled={!data.license_plate} type='security_2_signature' />
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		)
	},
	(prevProps, nextProps) => isEqual(prevProps.data, nextProps.data)
)

SignatureTable.displayName = 'SignatureFieldSet'

const Form = tw.form`divide-y`

export default TruckloadDeliveryDetailDialog
