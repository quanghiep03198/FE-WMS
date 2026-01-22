import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import { useWorkerFn } from '@/common/hooks/use-worker-fn'
import compressBase64 from '@/common/libs/compress-base64'
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Div,
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
	Icon,
	Label,
	RadioGroup,
	RadioGroupItem,
	Typography
} from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { useResetState, useThrottleFn } from 'ahooks'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SignatureCanvas from 'react-signature-canvas'
import { toast } from 'sonner'
import { TruckloadDeliveryStatus } from '../-constants'
import { SignatureType, usePageContext } from '../-contexts/page-context'
import { useUpdateDispatchOrderSignatureMutation } from '../-hooks/use-truckload-delivery-asm'

const SignatureEditorDialog: React.FC = () => {
	const { t } = useTranslation()
	const [open, setOpen] = useResetState<boolean>(false)
	const { mutateAsync: setStatusAsync, isPending, isError } = useUpdateDispatchOrderSignatureMutation()
	const [statusToUpdate, setStatusToUpdate] = useState<
		TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
	>(TruckloadDeliveryStatus.CONFIRMED)
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
	const { event$ } = usePageContext()
	const dialogData = useReactiveRef<
		Pick<ITruckloadDelivery, 'dispatch_order' | 'approval_status' | 'license_plate'> & {
			signature_type: SignatureType
			title: string | null
		}
	>({
		title: null,
		dispatch_order: null,
		approval_status: null,
		license_plate: null,
		signature_type: null
	})
	const canvasRef = useRef<SignatureCanvas>(null)
	const isEmpty = useReactiveRef<boolean>(canvasRef.current?.isEmpty() ?? true)

	const { run: handleCanvasEnd } = useThrottleFn(
		() => {
			if (canvasRef.current) {
				requestAnimationFrame(() => {
					isEmpty.current = canvasRef.current?.isEmpty() ?? true
				})
			}
		},
		{ wait: 200 }
	)

	event$.useSubscription(({ action, payload }) => {
		if (action === 'UPDATE_DISPATCH_ORDER_SIGNATURE') {
			setOpen(true)
			const title = {
				ie_signature: t('ns_erp:fields.ie_signature'),
				warehouse_officer_signature: t('ns_erp:fields.warehouse_officer_signature'),
				security_1_signature: t('ns_erp:fields.security_guard_signature', { number: 1, defaultValue: null }),
				security_2_signature: t('ns_erp:fields.security_guard_signature', { number: 2, defaultValue: null })
			}
			dialogData.current = { ...payload, title: title[payload.signature_type] }
		}
	})

	const { execute: compress, isPending: isCompressing } = useWorkerFn(compressBase64)

	const isMissingSignature = isEmpty.current && isSubmitted

	const handleSignSignature = async () => {
		setIsSubmitted(true)
		if (isEmpty.current) return
		toast.loading(t('ns_common:notification.processing_request'), { id: 'update_signature' })
		try {
			const base64Image = canvasRef.current?.toDataURL('image/webp', 0.8)
			const compressedBase64 = await compress(base64Image, {
				type: 'image/webp',
				width: 300,
				height: 200,
				max: 5, // Max 10KB
				quality: 1
			})
			const originalSizeInKB = (base64Image.length * 3) / 4 / 1024
			const sizeInKB = (compressedBase64.length * 3) / 4 / 1024
			console.info(`Signature image compressed from ${originalSizeInKB.toFixed(2)} KB to ${sizeInKB.toFixed(2)} KB`)
			await setStatusAsync({
				signature_type: dialogData.current.signature_type,
				dispatch_order: dialogData.current.dispatch_order,
				signature: compressedBase64,
				...((dialogData.current.signature_type === 'security_1_signature' ||
					dialogData.current.signature_type === 'security_2_signature') && { approval_status: statusToUpdate })
			})
			toast.success(t('ns_common:notification.success'), { id: 'update_signature' })
			setIsSubmitted(false)
			setOpen(false)
		} catch (error) {
			console.warn('Signature error:', error)
			toast.error(t('ns_common:notification.error'), { id: 'update_signature' })
		}
	}

	const handleClearSignature = useCallback(() => {
		canvasRef.current?.clear()
		isEmpty.current = true
	}, [isEmpty])

	useEffect(() => {
		function resizeCanvas() {
			if (!canvasRef.current) return
			const ratio = Math.max(window.devicePixelRatio || 1, 1)
			const canvas = canvasRef.current?.getCanvas()
			const signaturePad = canvasRef.current.getSignaturePad()
			canvas.width = canvas.offsetWidth * ratio
			canvas.height = canvas.offsetHeight * ratio
			canvas.getContext('2d').scale(ratio, ratio)
			signaturePad.clear() // otherwise isEmpty() might return incorrect value
		}

		window.addEventListener('resize', resizeCanvas)
		resizeCanvas()

		return () => {
			window.removeEventListener('resize', resizeCanvas)
		}
	}, [])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-xl grid-rows-[auto_1fr_auto] xl:max-w-xl'>
				<DialogHeader className='mb-6'>
					<DialogTitle>{dialogData.current.title}</DialogTitle>
					<DialogDescription>
						{t('ns_inoutbound:description.update_dispatch_order_signature_info')}
					</DialogDescription>
				</DialogHeader>
				<Div className='flex h-full flex-1 basis-full flex-col gap-y-6'>
					{['security_1_signature', 'security_2_signature'].includes(dialogData.current.signature_type) && (
						<Div className='flex flex-col gap-y-3'>
							<Label htmlFor='confirmation'>{t('ns_inoutbound:labels.security_confirmation')}</Label>
							<RadioGroup
								id='confirmation'
								orientation='horizontal'
								className='grid grid-cols-2 md:grid-cols-1'
								value={statusToUpdate}
								defaultValue={TruckloadDeliveryStatus.CONFIRMED}
								onValueChange={(value) => {
									setStatusToUpdate(
										value as TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
									)
									if (value === TruckloadDeliveryStatus.REQUEST_CHANGE) handleClearSignature()
								}}>
								<FieldLabel htmlFor='confirm-radio' className='p-4 duration-200 hover:border-primary'>
									<Field orientation='horizontal'>
										<FieldContent>
											<FieldTitle>{t('ns_common:actions.confirm')}</FieldTitle>
											<FieldDescription>
												{t('ns_inoutbound:description.confirm_dispatch_order_info')}
											</FieldDescription>
										</FieldContent>
										<RadioGroupItem value={TruckloadDeliveryStatus.CONFIRMED} id='confirm-radio' />
									</Field>
								</FieldLabel>
								<FieldLabel htmlFor='request-change-radio' className='p-4 duration-200 hover:border-primary'>
									<Field orientation='horizontal'>
										<FieldContent>
											<FieldTitle>{t('ns_common:actions.request_change')}</FieldTitle>
											<FieldDescription>
												{t('ns_inoutbound:description.request_change_dispatch_order_info')}
											</FieldDescription>
										</FieldContent>
										<RadioGroupItem
											value={TruckloadDeliveryStatus.REQUEST_CHANGE}
											id='request-change-radio'
										/>
									</Field>
								</FieldLabel>
							</RadioGroup>
						</Div>
					)}
					<Div className='flex flex-1 flex-col gap-y-3'>
						<Label
							htmlFor='signature'
							aria-invalid={isMissingSignature}
							className='aria-[invalid=true]:text-destructive'>
							{t('ns_inoutbound:labels.signature')}
						</Label>
						<Div
							id='signature'
							aria-invalid={isMissingSignature}
							className='relative grid basis-full place-items-center self-center overflow-clip rounded-md border bg-white shadow-sm aria-[invalid=true]:border-2 aria-[invalid=true]:border-destructive'
							style={{
								willChange: 'transform',
								transform: 'translateZ(0)',
								WebkitTransform: 'translateZ(0)'
							}}>
							{isCompressing && <OptimizingLoader />}
							<SignatureCanvas
								ref={canvasRef}
								minWidth={2}
								maxWidth={4}
								velocityFilterWeight={0.8}
								dotSize={2}
								clearOnResize={false}
								canvasProps={{
									className: 'touch-none',
									width: 500,
									height: 400,
									style: {
										msTouchAction: 'none',
										touchAction: 'none',
										WebkitTapHighlightColor: 'transparent'
									}
								}}
								onEnd={handleCanvasEnd}
							/>
						</Div>
						{isMissingSignature && (
							<Typography variant='small' color='destructive' className='font-medium'>
								{t('ns_validation:missing_signature')}
							</Typography>
						)}
					</Div>
				</Div>
				<DialogFooter>
					<Button variant='secondary' onClick={() => handleClearSignature()}>
						{t('ns_common:actions.reset')}
					</Button>
					<Button disabled={isPending} onClick={() => handleSignSignature()}>
						{isPending && <Icon name='LoaderCircle' className='animate-spin' />}
						{isError ? t('ns_common:actions.retry') : t('ns_common:actions.confirm')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const OptimizingLoader: React.FC = () => {
	return (
		<div className='absolute inset-0 z-10 grid flex-col place-items-center gap-x-2 bg-muted/50 backdrop-blur duration-200 animate-in fade-in-0'>
			<Icon name='LoaderCircle' className='animate-spin' />
		</div>
	)
}

export default SignatureEditorDialog
/* HTML: <div class="loader"></div> */
