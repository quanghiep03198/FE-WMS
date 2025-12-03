import { useReactiveRef } from '@/common/hooks/use-reactive-ref'
import { useWorkerFn } from '@/common/hooks/use-worker-fn'
import compressBase64 from '@/common/libs/compress-base64'
import { convertSvgToPng } from '@/common/libs/convert-png'
import { svgToOptimizedBase64 } from '@/common/libs/optimize-svg'
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
import Signature from '@uiw/react-signature'
import { useResetState } from 'ahooks'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { TruckloadDeliveryStatus } from '../-constants'
import { usePageContext } from '../-contexts/page-context'
import { useUpdateDispatchOrderSignatureMutation } from '../-hooks/use-truckload-delivery-asm'

const SignatureEditorDialog: React.FC = () => {
	const { t } = useTranslation()
	const $svg = useRef(null)
	const [open, setOpen] = useResetState<boolean>(false)
	const [points, setPoints, resetPoints] = useResetState([])
	// const [imageURL, setImageURL, resetImageURL] = useResetState<string>(data.signature)
	const [base64ImageFormat, setBase64ImageFormat] = useResetState<'svg' | 'png' | null>('svg')
	const { mutateAsync: setStatusAsync, isPending, isError } = useUpdateDispatchOrderSignatureMutation()
	const [statusToUpdate, setStatusToUpdate] = useState<
		TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
	>(TruckloadDeliveryStatus.CONFIRMED)
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
	const { event$ } = usePageContext()
	const dialogData = useReactiveRef<
		Pick<ITruckloadDelivery, 'dispatch_order' | 'approval_status' | 'license_plate'> & {
			signature_type: 'qc_signature' | 'warehouse_officer_signature' | 'security_guard_signature'
			title: string | null
		}
	>({
		title: null,
		dispatch_order: null,
		approval_status: null,
		license_plate: null,
		signature_type: null
	})

	event$.useSubscription(({ action, payload }) => {
		if (action === 'UPDATE_DISPATCH_ORDER_SIGNATURE') {
			setOpen(true)
			const title = {
				qc_signature: t('ns_erp:fields.qc_signature'),
				warehouse_officer_signature: t('ns_erp:fields.warehouse_officer_signature'),
				security_guard_signature: t('ns_erp:fields.security_guard_signature')
			}
			dialogData.current = { ...payload, title: title[payload.signature_type] }
		}
	})

	const { execute: compress, isPending: isCompressing } = useWorkerFn(compressBase64)

	const handlePoints = (data) => {
		if (data.length > 0) {
			setPoints([...points, JSON.stringify(data)])
		}
	}

	const handleBase64SvgImage = async () => {
		if (!points.length || !$svg.current?.svg) return

		const svgElement = $svg.current.svg

		// Setup SVG attributes
		const svgClone = svgElement.cloneNode(true) as SVGSVGElement
		const clientWidth = svgElement.clientWidth || 300
		const clientHeight = svgElement.clientHeight || 200

		svgClone.removeAttribute('style')
		svgClone.setAttribute('width', `${clientWidth}px`)
		svgClone.setAttribute('height', `${clientHeight}px`)
		svgClone.setAttribute('viewBox', `0 0 ${clientWidth} ${clientHeight}`)
		svgClone.setAttribute('fill', '#737373')

		const optimizedBase64 = svgToOptimizedBase64(svgClone, {
			removeUnusedAttrs: true,
			removeComments: true,
			minifyPathData: true,
			decimalPrecision: 2
		})

		// setImageURL(optimizedBase64)

		return optimizedBase64
	}

	const handleBase64PngImage = async () => {
		if (!points.length) return

		const pngBase64 = await convertSvgToPng($svg.current?.svg, {
			backgroundColor: 'transparent',
			fillColor: '#737373',
			quality: 1.0
		})

		const compressedBase64 = await compress(pngBase64, {
			type: 'image/png',
			width: 300,
			height: 200,
			max: 20, // Max 50KB
			quality: 1
		})

		// setImageURL(compressedBase64)

		return compressedBase64
	}

	const handleSignSignature = async () => {
		setIsSubmitted(true)
		try {
			const optimizedBase64 =
				base64ImageFormat === 'svg' ? await handleBase64SvgImage() : await handleBase64PngImage()
			if (!optimizedBase64) return

			toast.loading(t('ns_common:notification.processing_request'), { id: 'update_signature' })

			// setImageURL(optimizedBase64)
			await setStatusAsync({
				signature_type: dialogData.current.signature_type,
				dispatch_order: dialogData.current.dispatch_order,
				signature: optimizedBase64 ?? '',
				...(dialogData.current.signature_type === 'security_guard_signature' && { approval_status: statusToUpdate })
			})
			toast.success(t('ns_common:notification.success'), { id: 'update_signature' })
			setIsSubmitted(false)
			setOpen(false)
		} catch (error) {
			console.warn('Signature error:', error)
			toast.error(t('ns_common:notification.error'), { id: 'update_signature' })
		}
	}

	const handleClearSignature = () => {
		$svg.current?.clear()
		resetPoints()
	}

	const isMissingSignature = !points.length && isSubmitted

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open)
				if (!open) resetPoints()
			}}>
			<DialogContent className='max-w-2xl xl:max-w-3xl'>
				<DialogHeader className='mb-6'>
					<DialogTitle>{dialogData.current.title}</DialogTitle>
					<DialogDescription>
						{t('ns_inoutbound:description.update_dispatch_order_signature_info')}
					</DialogDescription>
				</DialogHeader>
				<Div className='flex flex-col gap-y-6'>
					{dialogData.current.signature_type === 'security_guard_signature' && (
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
									if (value === TruckloadDeliveryStatus.REQUEST_CHANGE) {
										handleClearSignature()
									}
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
					<Div className='flex flex-col gap-y-3'>
						<Label
							htmlFor='signature'
							aria-invalid={isMissingSignature}
							className='aria-[invalid=true]:text-destructive'>
							{t('ns_inoutbound:labels.signature')}
						</Label>
						<Div
							id='signature'
							aria-invalid={isMissingSignature}
							className='relative aspect-video overflow-clip rounded-md border duration-200 aria-[readonly=true]:!border aria-[invalid=true]:border-destructive hover:border-primary aria-[invalid=true]:hover:border-destructive aria-[readonly=true]:hover:border-border'>
							{isCompressing && <OptimizingLoader />}
							<Signature
								ref={$svg}
								readonly={!dialogData.current.license_plate}
								aria-readonly={!dialogData.current.license_plate}
								fill='hsl(var(--foreground))'
								className='aria-readonly:cursor-not-allowed'
								style={{ '--w-signature-background': 'hsl(var(--background))' } as React.CSSProperties}
								onPointer={handlePoints}
								options={{
									size: 5,
									smoothing: 0.5,
									thinning: 0.5,
									streamline: 0.99,
									start: {
										taper: 0,
										cap: true
									},
									end: {
										taper: 0,
										cap: true
									}
								}}
							/>
						</Div>
						{isMissingSignature && (
							<Typography variant='small' color='destructive' className='font-medium'>
								Please give a signature
							</Typography>
						)}
					</Div>
				</Div>
				<DialogFooter className='flex-row items-center justify-between'>
					<Div className='flex items-center gap-x-2'>
						<RadioGroup
							className='flex items-center gap-x-6'
							value={base64ImageFormat}
							defaultValue={'svg'}
							onValueChange={(value) => setBase64ImageFormat(value as 'svg' | 'png')}>
							<Div className='flex items-center gap-3'>
								<RadioGroupItem value={'svg'} id='svg' />
								<Label htmlFor='svg' className='inline-flex items-center gap-x-2'>
									SVG (Optimized)
								</Label>
							</Div>
							<Div className='flex items-center gap-3'>
								<RadioGroupItem value={'png'} id='png' />
								<Label htmlFor='png' className='inline-flex items-center gap-x-2'>
									PNG (Compressed)
								</Label>
							</Div>
						</RadioGroup>
					</Div>
					<Div className='flex items-center gap-x-2'>
						<Button variant='secondary' onClick={() => handleClearSignature()}>
							{t('ns_common:actions.reset')}
						</Button>
						<Button
							disabled={isPending}
							onClick={() => {
								handleSignSignature()
							}}>
							{isPending && <Icon name='LoaderCircle' className='animate-spin' />}
							{isError ? t('ns_common:actions.retry') : t('ns_common:actions.confirm')}
						</Button>
					</Div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

const OptimizingLoader: React.FC = () => {
	return (
		<div className='absolute inset-0 z-10 flex flex-col place-content-center place-items-center items-center justify-center gap-x-2 bg-muted/50 backdrop-blur duration-200 animate-in fade-in-0'>
			<style>{
				/* CSS */ `
               .loader {
                  --c:no-repeat linear-gradient(#fafafa 0 0);
                  background:
                     var(--c),var(--c),var(--c),
                     var(--c),var(--c),var(--c),
                     var(--c),var(--c),var(--c);
                  background-size: 8px 8px;
                  border-radius: 2px;
                  animation:
                     l32-1 1s infinite,
                     l32-2 1s infinite;
                  }
                  @keyframes l32-1 {
                  0%,100% {width:24px;height: 24px}
                  35%,65% {width:32px;height: 32px}
                  }
                  @keyframes l32-2 {
                  0%,40%  {background-position: 0 0,0 50%, 0 100%,50% 100%,100% 100%,100% 50%,100% 0,50% 0,  50% 50% }
                  60%,100%{background-position: 0 50%, 0 100%,50% 100%,100% 100%,100% 50%,100% 0,50% 0,0 0,  50% 50% }
                  }
            `
			}</style>
			<div className='loader' />
		</div>
	)
}

export default SignatureEditorDialog
/* HTML: <div class="loader"></div> */
