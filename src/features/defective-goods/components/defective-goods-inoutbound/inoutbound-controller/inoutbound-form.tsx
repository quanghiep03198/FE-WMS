import { CommonActions, UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { DropdownSelect } from '@components/customs/dropdown-select'
import { InputFieldControl } from '@components/forms/input'
import { SelectFieldControl } from '@components/forms/select'
import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@components/guards/role-base-access-control'
import { Button } from '@components/ui/button'
import { Form as FormProvider } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { Separator } from '@components/ui/separator'
import { StockFlow } from '@features/finished-goods/constants/enums'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateEffect } from 'ahooks'
import { Fragment, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'

import { DefectiveGoodsOutboundPurpose } from '@features/defective-goods/constants/enums'
import { usePageContext } from '@features/defective-goods/contexts/page-context'
import PurchaseOrderFieldControl from '@features/rfid-agent/components/playground/purchase-order-field-control'
import { useUpdateDefectiveGoodsStockMutation } from '../../../hooks/use-defective-goods-request'
import { useFilterQuery } from '../../../hooks/use-filter-query'
import {
	defectiveGoodsInboundFormValues,
	defectiveGoodsOutboundFormValues,
	type InboundOutboundFormValues
} from '../../../schemas/defective-goods-inoutbound.schema'
import QuantityFiledControl from './quantity-field-control'

const InoutboundForm: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()

	const { searchParams, setParams } = useFilterQuery()
	const schemaRef = useRef(
		searchParams.action === StockFlow.INBOUND ? defectiveGoodsInboundFormValues : defectiveGoodsOutboundFormValues
	)
	const form = useForm<InboundOutboundFormValues>({
		resolver: zodResolver(schemaRef.current),
		defaultValues: {
			epcs: [],
			...(searchParams.action === StockFlow.INBOUND && { storage_location: null }),
			...(searchParams.action === StockFlow.OUTBOUND && { outbound_purpose: null })
		} as unknown as InboundOutboundFormValues,
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
			searchParams.action === StockFlow.INBOUND ? defectiveGoodsInboundFormValues : defectiveGoodsOutboundFormValues
		form.reset()
	}, [searchParams.action])

	event$.useSubscription((e) => {
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
					...(searchParams.action === StockFlow.INBOUND && { storage_location: '' }),
					...(searchParams.action === StockFlow.OUTBOUND && { outbound_purpose: '' })
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
				labelField='label'
				placeholder={t('ns_common:common_fields.actions')}
				valueField='value'
				datalist={[
					{ label: t('ns_inoutbound:action_types.stock_in'), value: StockFlow.INBOUND },
					{ label: t('ns_inoutbound:action_types.stock_out'), value: StockFlow.OUTBOUND }
				]}
				selectProps={{
					value: searchParams.action,
					onValueChange: (value) => {
						setParams({ ...searchParams, action: value as StockFlow })
					}
				}}
				selectTriggerProps={{
					className: 'flex @4xl:hidden max-w-28'
				}}
			/>
			<RadioGroup
				className='hidden items-center gap-x-6 @4xl:flex'
				defaultValue={searchParams.action}
				disabled={isPending}
				value={searchParams.action}
				onValueChange={(value) => setParams({ ...searchParams, action: value as StockFlow })}>
				<Div className='flex items-center space-y-0 space-x-3'>
					<RadioGroupItem id='action-inbound' value={StockFlow.INBOUND} />
					<Label className='font-normal' htmlFor='action-inbound'>
						{t('ns_inoutbound:action_types.stock_in')}
					</Label>
				</Div>
				<Div className='flex items-center space-y-0 space-x-3'>
					<RadioGroupItem id='action-outbound' value={StockFlow.OUTBOUND} />
					<Label className='font-normal' htmlFor='action-outbound'>
						{t('ns_inoutbound:action_types.stock_out')}
					</Label>
				</Div>
			</RadioGroup>
			<Separator className='h-6 w-0.5' orientation='vertical' />
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
						{searchParams.action === StockFlow.OUTBOUND ? (
							<Fragment>
								<SelectFieldControl
									errorMessageVariant='tooltip'
									labelField='label'
									name='outbound_purpose'
									placeholder={t('ns_inoutbound:placeholders.outbound_purpose')}
									valueField='value'
									datalist={[
										{
											label: t('ns_inoutbound:inoutbound_actions.shipping'),
											value: DefectiveGoodsOutboundPurpose.SHIPPING
										},
										{
											label: t('ns_inoutbound:inoutbound_actions.downgrade'),
											value: DefectiveGoodsOutboundPurpose.DOWNGRADE
										},
										{
											label: t('ns_inoutbound:inoutbound_actions.lab'),
											value: DefectiveGoodsOutboundPurpose.LAB
										},
										{
											label: t('ns_inoutbound:inoutbound_actions.ruin'),
											value: DefectiveGoodsOutboundPurpose.RUIN
										}
									]}
								/>
								{currentOutboundPurpose === DefectiveGoodsOutboundPurpose.SHIPPING && (
									<PurchaseOrderFieldControl
										errorMessageVariant='tooltip'
										label={undefined}
										placeholder={t('ns_erp:fields.po')}
									/>
								)}
							</Fragment>
						) : (
							<InputFieldControl
								autoComplete='off'
								errorMessageVariant='tooltip'
								name='storage_location'
								placeholder={t('ns_inoutbound:placeholders.enter_storage_location')}
								onChange={(e) => form.setValue('storage_location', e.currentTarget.value.toUpperCase())}
							/>
						)}
					</Div>
					<Separator className='h-6 w-0.5' orientation='vertical' />
					<RoleBaseAccessControl
						authorizedRoles={[UserRole.DG_WAREHOUSE_STAFF]}
						mode='fallback'
						fallbackComponent={
							<Button
								className='cursor-not-allowed'
								type='button'
								onClick={() =>
									toast.warning(t('ns_common:errors.403_notification'), { id: ACTION_RESTRICTED_TOAST_ID })
								}>
								<Icon name='Lock' /> {t('ns_common:actions.save')}
							</Button>
						}>
						<Button disabled={disabled} type='submit'>
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
