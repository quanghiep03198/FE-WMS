import { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import {
	Button,
	Div,
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
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { DefectiveGoodsOutboundPurpose } from '../-constants'
import { useFilterQuery } from '../-hooks/use-filter-query'
import {
	DefectiveGoodsInboundFormValues,
	defectiveGoodsInboundFormValues,
	DefectiveGoodsOutboundFormValues,
	defectiveGoodsOutboundFormValues
} from '../-schemas'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'
import { useUpdateDefectiveGoodsStockMutation } from '../../-hooks/use-defective-goods-asm'
import QuantityFiledControl from './quantity-field-control'

export type FormValues = DefectiveGoodsInboundFormValues | DefectiveGoodsOutboundFormValues

const InoutboundForm: React.FC = () => {
	const { t } = useTranslation()
	const { scannedEpcs, resetScannedEpcs } = useReaderPlaygroundStore('scannedEpcs', 'resetScannedEpcs')

	const { searchParams, setParams } = useFilterQuery()
	const schemaRef = useRef(
		searchParams.action === RFIDDataType.INBOUND ? defectiveGoodsInboundFormValues : defectiveGoodsOutboundFormValues
	)
	const form = useForm<FormValues>({
		resolver: zodResolver(schemaRef.current)
	})

	useUpdateEffect(() => {
		schemaRef.current =
			searchParams.action === RFIDDataType.INBOUND
				? defectiveGoodsInboundFormValues
				: defectiveGoodsOutboundFormValues
		form.reset()
	}, [searchParams.action])

	useUpdateEffect(() => {
		if (scannedEpcs.length === 0) form.reset()
		else form.setValue('epcs', scannedEpcs)
	}, [scannedEpcs])

	const { mutateAsync, isPending, isError } = useUpdateDefectiveGoodsStockMutation()

	const handleFormSubmission = (data: FormValues) => {
		toast.promise(mutateAsync(data), {
			loading: t('ns_common:notification.processing_request'),
			success: () => {
				resetScannedEpcs()
				return t('ns_common:notification.success')
			},
			error: t('ns_common:notification.error')
		})
	}

	const disabled = !Array.isArray(scannedEpcs) || scannedEpcs.length === 0 || isPending

	return (
		<Div className='flex w-full flex-row items-center justify-between gap-x-6 @6xl:flex-1 @6xl:justify-end'>
			<RadioGroup
				disabled={isPending}
				onValueChange={(value) => setParams({ ...searchParams, action: value as RFIDDataType })}
				defaultValue={searchParams.action}
				value={searchParams.action}
				className='flex items-center gap-x-6'>
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
			<Separator orientation='vertical' className='h-6 min-w-0.5 max-w-0.5' />
			<FormProvider {...form}>
				<Form onSubmit={form.handleSubmit(handleFormSubmission)}>
					<Div className='grid w-full max-w-full flex-1 auto-cols-fr grid-flow-col gap-x-2 *:flex-1 @6xl:max-w-96'>
						<QuantityFiledControl />
						{searchParams.action === RFIDDataType.OUTBOUND ? (
							<SelectFieldControl
								name='outbound_purpose'
								errorMessageVariant='tooltip'
								placeholder={t('ns_inoutbound:placeholders.outbound_purpose')}
								datalist={[
									{
										label: t('ns_inoutbound:inoutbound_actions.sell'),
										value: DefectiveGoodsOutboundPurpose.SELL
									},
									{
										label: t('ns_inoutbound:inoutbound_actions.recycle'),
										value: DefectiveGoodsOutboundPurpose.RECYCLE
									},
									{
										label: t('ns_inoutbound:inoutbound_actions.giveaway'),
										value: DefectiveGoodsOutboundPurpose.GIVEAWAY
									}
								]}
								labelField='label'
								valueField='value'
							/>
						) : (
							<InputFieldControl
								name='storage_location'
								errorMessageVariant='tooltip'
								placeholder={t('ns_inoutbound:placeholders.enter_storage_location')}
								autoComplete='off'
							/>
						)}
					</Div>
					<Separator orientation='vertical' className='h-6 min-w-0.5 max-w-0.5' />
					<Button type='submit' disabled={disabled}>
						<Icon name='Check' />
						{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
					</Button>
				</Form>
			</FormProvider>
		</Div>
	)
}

const Form = tw.form`flex flex-row items-center gap-x-6 flex-1 @6xl:flex-initial`

export default InoutboundForm
