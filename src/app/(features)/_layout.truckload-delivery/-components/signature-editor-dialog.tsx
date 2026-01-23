import { useEffectOnce } from '@/common/hooks/use-effect-once'
import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import { useWorkerFn } from '@/common/hooks/use-worker-fn'
import compressBase64 from '@/common/libs/compress-base64'
import { cn } from '@/common/utils/cn'
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
import { useResetState } from 'ahooks'
import React, { useRef, useState } from 'react'
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
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
	const [isEmpty, setIsEmpty] = useState<boolean>(false)
	const [statusToUpdate, setStatusToUpdate] = useState<
		TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
	>(TruckloadDeliveryStatus.CONFIRMED)
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

	const handleSignSignature = async () => {
		setIsSubmitted(true)
		if (!canvasRef.current || !canvasRef.current.toData().length) return

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
			setOpen(false)
			setIsSubmitted(false)
		} catch (error) {
			console.warn('Signature error:', error)
			toast.error(t('ns_common:notification.error'), { id: 'update_signature' })
		}
	}

	const handleClearSignature = () => {
		canvasRef.current.clear()
		setIsSubmitted(false)
	}

	// useEffect(() => {
	// setIsEmpty(canvasRef.current?.isEmpty() ?? true)
	// }, [canvasRef.current?.isEmpty()])

	useEffectOnce(() => {
		if (!canvasRef.current) return

		const canvas = canvasRef.current.getCanvas()
		const signaturePad = canvasRef.current.getSignaturePad()

		function resizeCanvas() {
			if (!canvas) return
			const ratio = Math.max(window.devicePixelRatio || 1, 1)
			canvas.width = canvas.offsetWidth * ratio
			canvas.height = canvas.offsetHeight * ratio
			const ctx = canvas.getContext('2d')
			ctx.scale(ratio, ratio)
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			signaturePad.clear() // otherwise isEmpty() might return incorrect value
		}

		function handleTouchMove(e: TouchEvent) {
			console.log('ahihihi')
			e.preventDefault()
		}

		resizeCanvas()

		window.addEventListener('resize', resizeCanvas)
		canvas.addEventListener('pointermove', handleTouchMove, { passive: false })

		return () => {
			window.removeEventListener('resize', resizeCanvas)
			canvas.removeEventListener('pointermove', handleTouchMove)
		}
	})

	const isMissingSignature = isEmpty && isSubmitted

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className={cn(
					'md:max-w-screen max-w-2xl grid-rows-[auto_1fr_auto] md:max-h-screen md:rounded-none xl:max-w-4xl',
					'md:*:!transiton-none md:*:before:!transtion-none md:!animate-none md:!transition-none md:*:!animate-none md:*:after:!animate-none'
				)}>
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
							className='relative overflow-clip rounded-md border bg-white shadow-sm duration-200 aria-[invalid=true]:border-destructive'>
							{isCompressing && <OptimizingLoader />}
							<SignatureCanvas
								ref={canvasRef}
								backgroundColor='transparent'
								canvasProps={{
									onPointerMove: (e) => {
										e.preventDefault()
									},
									onTouchMove: (e) => {
										e.preventDefault()
									},
									style: {
										overscrollBehavior: 'none',
										touchAction: 'none',
										width: '100%',
										height: 500,
										willChange: 'contents'
									}
								}}
								throttle={0}
								minWidth={1.5}
								maxWidth={2.5}
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
