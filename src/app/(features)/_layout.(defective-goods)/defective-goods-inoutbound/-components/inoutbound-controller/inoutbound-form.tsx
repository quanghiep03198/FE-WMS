import { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@/app/-components/-guard/role-base-access-control'
import { CommonActions, UserRole } from '@/common/constants/enums'
import { cn } from '@/common/utils/cn'
import {
	Button,
	Div,
	DropdownSelect,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	Label,
	RadioGroup,
	RadioGroupItem,
	SelectFieldControl,
	Separator
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateEffect } from 'ahooks'
import { Fragment, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { DefectiveGoodsOutboundPurpose } from '../../-constants'
import { useFilterQuery } from '../../-hooks/use-filter-query'
import {
	defectiveGoodsInboundFormValues,
	defectiveGoodsOutboundFormValues,
	type InboundOutboundFormValues
} from '../../-schemas'
import PurchaseOrderFieldControl from '../../../-components/rfid-reader-playground/purchase-order-field-control'
import { usePageContext } from '../../../-contexts/page-context'
import { useUpdateDefectiveGoodsStockMutation } from '../../../-hooks/use-defective-goods-asm'
import QuantityFiledControl from './quantity-field-control'

const InoutboundForm: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()

	const { searchParams, setParams } = useFilterQuery()
	const schemaRef = useRef(
		searchParams.action === RFIDDataType.INBOUND ? defectiveGoodsInboundFormValues : defectiveGoodsOutboundFormValues
	)
	const form = useForm<InboundOutboundFormValues>({
		resolver: zodResolver(schemaRef.current),
		defaultValues: {
			epcs: [],
			...(searchParams.action === RFIDDataType.INBOUND && { storage_location: null }),
			...(searchParams.action === RFIDDataType.OUTBOUND && { outbound_purpose: null })
		},
		resetOptions: { keepErrors: false, keepDirty: false, keepValues: false }
	})

	const scannedEpcs = useWatch({
		control: form.control,
		name: 'epcs'
	})
	const currentOutboundPurpose = useWatch({
		control: form.control,
		name: 'outbound_purpose'
	})

	useUpdateEffect(() => {
		schemaRef.current =
			searchParams.action === RFIDDataType.INBOUND
				? defectiveGoodsInboundFormValues
				: defectiveGoodsOutboundFormValues
		form.reset()
	}, [searchParams.action])

	event$.useSubscription((e: { action: CommonActions; payload: string[] }) => {
		if (e.action !== CommonActions.IMPORT) return
		if (e.payload.length === 0) form.reset()
		else form.setValue('epcs', e.payload)
	})

	const { mutateAsync, isPending, isError } = useUpdateDefectiveGoodsStockMutation()

	const handleFormSubmission = (data: InboundOutboundFormValues) => {
		toast.promise(mutateAsync(data), {
			loading: t('ns_common:notification.processing_request'),
			success: () => {
				event$.emit({ action: CommonActions.SAVE, payload: [] })
				form.reset({
					epcs: [],
					...(searchParams.action === RFIDDataType.INBOUND && { storage_location: '' }),
					...(searchParams.action === RFIDDataType.OUTBOUND && { outbound_purpose: '' })
				})
				return t('ns_common:notification.success')
			},
			error: t('ns_common:notification.error')
		})
	}

	const disabled = !Array.isArray(scannedEpcs) || scannedEpcs.length === 0 || isPending

	return (
		<Div className='flex w-full flex-row items-center justify-between gap-x-3 @4xl:gap-x-6 @6xl:flex-1 @6xl:justify-end'>
			<DropdownSelect
				datalist={[
					{ label: t('ns_inoutbound:action_types.warehouse_input'), value: RFIDDataType.INBOUND },
					{ label: t('ns_inoutbound:action_types.warehouse_output'), value: RFIDDataType.OUTBOUND }
				]}
				labelField='label'
				valueField='value'
				placeholder={t('ns_common:common_fields.actions')}
				selectProps={{
					value: searchParams.action,
					onValueChange: (value) => {
						setParams({ ...searchParams, action: value as RFIDDataType })
					}
				}}
				selectTriggerProps={{
					className: 'flex @4xl:hidden max-w-28'
				}}
			/>
			<RadioGroup
				disabled={isPending}
				onValueChange={(value) => setParams({ ...searchParams, action: value as RFIDDataType })}
				defaultValue={searchParams.action}
				value={searchParams.action}
				className='hidden items-center gap-x-6 @4xl:flex'>
				<Div className='flex items-center space-x-3 space-y-0'>
					<RadioGroupItem value={RFIDDataType.INBOUND} id='action-inbound' />
					<Label className='font-normal' htmlFor='action-inbound'>
						{t('ns_inoutbound:action_types.warehouse_input')}
					</Label>
				</Div>
				<Div className='flex items-center space-x-3 space-y-0'>
					<RadioGroupItem value={RFIDDataType.OUTBOUND} id='action-outbound' />
					<Label className='font-normal' htmlFor='action-outbound'>
						{t('ns_inoutbound:action_types.warehouse_output')}
					</Label>
				</Div>
			</RadioGroup>
			<Separator orientation='vertical' className='h-6 w-0.5' />
			<FormProvider {...form}>
				<Form onSubmit={form.handleSubmit(handleFormSubmission)}>
					<Div
						className={cn(
							'grid w-full max-w-full flex-1 grid-flow-col gap-x-1 @4xl:gap-x-2 @6xl:max-w-[calc(100cqw/3)]',
							currentOutboundPurpose === DefectiveGoodsOutboundPurpose.SHIPPING
								? 'auto-cols-[1fr_1.5fr_1.5fr] @4xl:auto-cols-fr'
								: 'auto-cols-fr'
						)}>
						<QuantityFiledControl />
						{searchParams.action === RFIDDataType.OUTBOUND ? (
							<Fragment>
								<SelectFieldControl
									name='outbound_purpose'
									errorMessageVariant='tooltip'
									placeholder={t('ns_inoutbound:placeholders.outbound_purpose')}
									datalist={[
										{
											label: t('ns_inoutbound:inoutbound_actions.shipping'),
											value: DefectiveGoodsOutboundPurpose.SHIPPING
										},
										{
											label: t('ns_inoutbound:inoutbound_actions.ruin'),
											value: DefectiveGoodsOutboundPurpose.RUIN
										},
										{
											label: t('ns_inoutbound:inoutbound_actions.lab'),
											value: DefectiveGoodsOutboundPurpose.LAB
										},
										{
											label: t('ns_inoutbound:inoutbound_actions.downgrade'),
											value: DefectiveGoodsOutboundPurpose.DOWNGRADE
										}
									]}
									labelField='label'
									valueField='value'
								/>
								{currentOutboundPurpose === DefectiveGoodsOutboundPurpose.SHIPPING && (
									<PurchaseOrderFieldControl
										label={null}
										errorMessageVariant='tooltip'
										placeholder={t('ns_erp:fields.po')}
									/>
								)}
							</Fragment>
						) : (
							<InputFieldControl
								name='storage_location'
								errorMessageVariant='tooltip'
								placeholder={t('ns_inoutbound:placeholders.enter_storage_location')}
								onChange={(e) => form.setValue('storage_location', e.currentTarget.value.toUpperCase())}
								autoComplete='off'
							/>
						)}
					</Div>
					<Separator orientation='vertical' className='h-6 w-0.5' />
					<RoleBaseAccessControl
						mode='fallback'
						authorizedRoles={[UserRole.DG_WAREHOUSE_STAFF]}
						fallbackComponent={
							<Button
								type='button'
								className='cursor-not-allowed'
								onClick={() =>
									toast.warning(t('ns_common:errors.403_notification'), { id: ACTION_RESTRICTED_TOAST_ID })
								}>
								<Icon name='Lock' /> {t('ns_common:actions.save')}
							</Button>
						}>
						<Button type='submit' disabled={disabled}>
							<Icon name='Check' />
							{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
						</Button>
					</RoleBaseAccessControl>
				</Form>
			</FormProvider>
		</Div>
	)
}

const Form = tw.form`flex flex-row items-center @4xl:gap-x-6 gap-x-3 flex-1 @6xl:flex-initial`

export default InoutboundForm
