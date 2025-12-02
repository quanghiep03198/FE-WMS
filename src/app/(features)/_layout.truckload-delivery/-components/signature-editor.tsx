import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	Icon,
	Label,
	RadioGroup,
	RadioGroupItem,
	Typography
} from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import Signature from '@uiw/react-signature'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { TruckloadDeliveryStatus } from '../-constants'
import { useUpdateDispatchOrderSignatureMutation } from '../-hooks/use-truckload-delivery-asm'

type SignatureDialogProps = {
	title: string
	description: string
	data: Pick<ITruckloadDelivery, 'dispatch_order' | 'approval_status'> & { signature: string }
	role: 'QC' | 'WAREHOUSE_OFFICER' | 'SECURITY_GUARD'
}

const SignatureEditor: React.FC<SignatureDialogProps> = ({ title, description, role, data }) => {
	const { t } = useTranslation()
	const $svg = useRef(null)
	const [open, setOpen] = useState<boolean>(false)
	const [imageURL, setImageURL] = useState<string>(data.signature)
	const { mutateAsync: setStatusAsync, isPending, isError } = useUpdateDispatchOrderSignatureMutation()
	const [statusToUpdate, setStatusToUpdate] = useState<
		TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
	>(null)

	const handleSignSignature = async () => {
		toast.loading(t('ns_common:notification.processing_request'), { id: 'update_signature' })
		try {
			const svgelm = $svg.current?.svg?.cloneNode(true) as SVGSVGElement
			const clientWidth = $svg.current?.svg?.clientWidth
			const clientHeight = $svg.current?.svg?.clientHeight
			svgelm.removeAttribute('style')
			svgelm.setAttribute('width', `${clientWidth}px`)
			svgelm.setAttribute('height', `${clientHeight}px`)
			svgelm.setAttribute('viewbox', `${clientWidth} ${clientHeight}`)
			svgelm.setAttribute('fill', '#737373')
			const xmlStringData = new XMLSerializer().serializeToString(svgelm)
			const base64Image = `data:image/svg+xml;base64,${btoa(decodeURIComponent(xmlStringData))}`
			setImageURL(base64Image)
			await setStatusAsync({
				role,
				dispatch_order: data.dispatch_order,
				signature: base64Image,
				...(role === 'SECURITY_GUARD' && { approval_status: statusToUpdate })
			})

			toast.success(t('ns_common:notification.success'), { id: 'update_signature' })
			setOpen(false)
		} catch {
			toast.error(t('ns_common:notification.error'), { id: 'update_signature' })
		}
	}

	return (
		<Div className='group/signature flex items-center gap-x-2'>
			{imageURL ? (
				<img className='object-container aspect-video max-w-20 object-center' src={imageURL} />
			) : (
				<Typography variant='small' color='muted' className='inline-flex items-center gap-x-2'>
					{'No signature yet'}
				</Typography>
			)}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger className='inline-flex items-center gap-x-2 opacity-0 transition-opacity duration-100 group-hover/signature:opacity-100'>
					<Icon name='PenLine' />
				</DialogTrigger>
				<DialogContent className='max-w-2xl'>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<Div className='flex flex-col gap-y-6'>
						{role === 'SECURITY_GUARD' && (
							<RadioGroup
								className='mt-6 grid grid-cols-2'
								value={statusToUpdate}
								defaultValue={TruckloadDeliveryStatus.CONFIRMED}
								onValueChange={(value) =>
									setStatusToUpdate(
										value as TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
									)
								}>
								<Div className='flex items-center gap-3'>
									<RadioGroupItem value={TruckloadDeliveryStatus.CONFIRMED} id='r1' />
									<Label htmlFor='r1'>{t('ns_common:actions.confirm')}</Label>
								</Div>
								<Div className='flex items-center gap-3'>
									<RadioGroupItem value={TruckloadDeliveryStatus.REQUEST_CHANGE} id='r2' />
									<Label htmlFor='r2'>{t('ns_common:actions.request_change')}</Label>
								</Div>
							</RadioGroup>
						)}
						<Div className='relative aspect-video overflow-clip rounded-md border border-dashed'>
							<Signature
								ref={$svg}
								fill='hsl(var(--foreground))'
								style={{ '--w-signature-background': 'hsl(var(--background))' } as React.CSSProperties}
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
					</Div>
					<DialogFooter>
						<Button
							variant='secondary'
							onClick={() => {
								$svg.current?.clear()
							}}>
							{t('ns_common:actions.reset')}
						</Button>
						<Button disabled={isPending} onClick={() => handleSignSignature()}>
							{isPending && <Icon name='LoaderCircle' className='animate-spin' />}
							{isError ? t('ns_common:actions.retry') : t('ns_common:actions.confirm')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Div>
	)
}

// const OptimizingLoader: React.FC = () => {
// 	return (
// 		<div className='absolute inset-0 z-10 place-content-center place-items-center bg-neutral-950/50 backdrop-blur-[2px] duration-200 animate-in fade-in-0'>
// 			<style>{
// 				/* CSS */ `
//                .loader {
//                   --c:no-repeat linear-gradient(#fafafa 0 0);
//                   background:
//                      var(--c),var(--c),var(--c),
//                      var(--c),var(--c),var(--c),
//                      var(--c),var(--c),var(--c);
//                   background-size: 16px 16px;
//                   border-radius: 2px;
//                   animation:
//                      l32-1 1s infinite,
//                      l32-2 1s infinite;
//                   }
//                   @keyframes l32-1 {
//                   0%,100% {width:45px;height: 45px}
//                   35%,65% {width:65px;height: 65px}
//                   }
//                   @keyframes l32-2 {
//                   0%,40%  {background-position: 0 0,0 50%, 0 100%,50% 100%,100% 100%,100% 50%,100% 0,50% 0,  50% 50% }
//                   60%,100%{background-position: 0 50%, 0 100%,50% 100%,100% 100%,100% 50%,100% 0,50% 0,0 0,  50% 50% }
//                   }
//             `
// 			}</style>
// 			<div className='loader' />
// 		</div>
// 	)
// }

export default SignatureEditor
/* HTML: <div class="loader"></div> */
