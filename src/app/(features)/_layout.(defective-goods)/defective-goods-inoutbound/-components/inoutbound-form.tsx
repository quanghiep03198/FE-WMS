import { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import { Button, Div, Form as FormProvider, Icon, Label, RadioGroup, RadioGroupItem, Separator } from '@/components/ui'
import { DefectiveGoodsService } from '@/services/defective-goods.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useUpdateEffect } from 'ahooks'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import {
	DefectiveGoodsInboundFormValues,
	defectiveGoodsInboundFormValues,
	DefectiveGoodsOutboundFormValues,
	defectiveGoodsOutboundFormValues
} from '../-schemas'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'
import OutboundPurposeFieldControl from './outbound-purpose-field-control'
import StorageLocationFieldControl from './storage-location-field-control'

export type FormValues = DefectiveGoodsInboundFormValues | DefectiveGoodsOutboundFormValues

const InoutboundForm: React.FC = () => {
	const { t } = useTranslation()
	const { scannedEpcs, resetScannedEpcs } = useReaderPlaygroundStore('scannedEpcs', 'resetScannedEpcs')
	const [action, setAction] = useState<RFIDDataType>(RFIDDataType.INBOUND)
	const schemaRef = useRef(
		action === RFIDDataType.INBOUND ? defectiveGoodsInboundFormValues : defectiveGoodsOutboundFormValues
	)
	const form = useForm<FormValues>({
		resolver: zodResolver(schemaRef.current)
	})

	useUpdateEffect(() => {
		schemaRef.current =
			action === RFIDDataType.INBOUND ? defectiveGoodsInboundFormValues : defectiveGoodsOutboundFormValues
		form.reset()
	}, [action])

	useUpdateEffect(() => {
		if (scannedEpcs.length === 0) form.reset()
		else form.setValue('epcs', scannedEpcs)
	}, [scannedEpcs])

	const { mutateAsync, isPending, isError } = useMutation({
		mutationFn: async (payload: FormValues) =>
			action === RFIDDataType.INBOUND
				? DefectiveGoodsService.updateInboundStatus(
						payload as Exclude<FormValues, DefectiveGoodsOutboundFormValues>
					)
				: DefectiveGoodsService.updateOutboundStatus(
						payload as Exclude<FormValues, DefectiveGoodsInboundFormValues>
					)
	})

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
		<Div className='flex w-full flex-1 flex-row items-center justify-center gap-x-6 @5xl:justify-end'>
			<RadioGroup
				disabled={isPending}
				onValueChange={(value) => setAction(value as RFIDDataType)}
				defaultValue={action}
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
			<Separator orientation='vertical' className='h-6 w-0.5' />
			<FormProvider {...form}>
				<Form
					onSubmit={form.handleSubmit(handleFormSubmission)}
					style={{
						'--form-field-width': '250px'
					}}>
					{action === RFIDDataType.OUTBOUND ? (
						<OutboundPurposeFieldControl disabled={disabled} />
					) : (
						<StorageLocationFieldControl disabled={disabled} />
					)}
					<Separator orientation='vertical' className='h-6 w-0.5' />
					<Button type='submit' size='sm' disabled={disabled}>
						<Icon name='Check' />
						{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
					</Button>
				</Form>
			</FormProvider>
		</Div>
	)
}

const Form = tw.form`flex flex-row items-center gap-x-6`

export default InoutboundForm
