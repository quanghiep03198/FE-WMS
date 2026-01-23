import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import { useWorkerFn } from '@/common/hooks/use-worker-fn'
import compressBase64 from '@/common/libs/compress-base64'
import { cn } from '@/common/utils/cn'
import env from '@/common/utils/env'
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
import { SignatureCanvas, type SignatureCanvasInstance } from '@/components/ui/@custom/signature'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { TruckloadDeliveryStatus } from '../-constants'
import { SignatureType, usePageContext } from '../-contexts/page-context'
import { useUpdateDispatchOrderSignatureMutation } from '../-hooks/use-truckload-delivery-asm'

const SignatureEditorDialog: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false)
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
	const [isEmpty, setIsEmpty] = useState<boolean>(false)
	const [statusToUpdate, setStatusToUpdate] = useState<
		TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
	>(TruckloadDeliveryStatus.CONFIRMED)
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const { mutateAsync: setStatusAsync, isPending, isError } = useUpdateDispatchOrderSignatureMutation()
	const isDesktop = useMediaQuery(PresetBreakPoints.EXTRA_LARGE)
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
	const canvasRef = useRef<SignatureCanvasInstance>(null)

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
			// * compress image
			const base64Image = canvasRef.current.toDataURL({ trim: true })
			const compressedBase64 = await compress(base64Image, {
				type: 'image/webp',
				width: 192,
				height: 128,
				max: 10, // Max 10KB
				quality: 0.8,
				debug: env<RuntimeEnvironment>('VITE_NODE_ENV') === 'development'
			})

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
			console.error('Signature error :>>>', error)
			toast.error(t('ns_common:notification.error'), { id: 'update_signature' })
		}
	}

	const handleReset = () => {
		canvasRef.current.clear()
		setIsEmpty(true)
		setIsSubmitted(false)
	}

	const isMissingSignature = isEmpty && isSubmitted

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className={cn(
					'flex max-w-xl flex-col gap-6 overflow-auto md:max-h-screen lg:max-w-3xl xl:max-w-4xl',
					'md:*:!transiton-none md:*:before:!transtion-none md:!animate-none md:!transition-none md:*:!animate-none md:*:after:!animate-none'
				)}>
				<DialogHeader>
					<DialogTitle>{dialogData.current.title}</DialogTitle>
					<DialogDescription>
						{t('ns_inoutbound:description.update_dispatch_order_signature_info')}
					</DialogDescription>
				</DialogHeader>
				<DialogBody>
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
									if (value === TruckloadDeliveryStatus.REQUEST_CHANGE) handleReset()
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
					<Div className='group/signature flex h-full flex-col gap-y-3' aria-invalid={isMissingSignature}>
						<Label htmlFor='signature' className='group-aria-[invalid=true]/signature:text-destructive'>
							{t('ns_inoutbound:labels.signature')}
						</Label>
						<Div
							id='signature'
							className='relative cursor-crosshair overflow-clip rounded-lg border bg-white duration-200 @container group-aria-[invalid=true]/signature:border-2 group-aria-[invalid=true]/signature:border-destructive'>
							{isCompressing && <OptimizingLoader />}
							<SignatureCanvas
								ref={canvasRef}
								style={{
									overscrollBehavior: 'none',
									touchAction: 'none',
									width: '100cqw',
									height: isDesktop ? '50vh' : '45vh'
								}}
								padOptions={{
									minWidth: 2,
									maxWidth: 2
								}}
								onEnd={() => setIsEmpty(canvasRef.current?.isEmpty())}
							/>
						</Div>
						{isMissingSignature && (
							<Typography
								variant='small'
								color='destructive'
								className='inline-flex items-center gap-x-2 font-medium'>
								<Icon name='TriangleAlert' />
								{t('ns_validation:missing_signature')}
							</Typography>
						)}
					</Div>
				</DialogBody>
				<DialogFooter>
					<Button variant='secondary' onClick={() => handleReset()}>
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

const DialogBody = tw.div`flex-1 space-y-6`

const OptimizingLoader: React.FC = () => {
	return (
		<div className='absolute inset-0 z-10 grid flex-col place-items-center gap-x-2 bg-muted/50 backdrop-blur duration-200 animate-in fade-in-0'>
			<Icon name='LoaderCircle' className='animate-spin' />
		</div>
	)
}

export default SignatureEditorDialog
