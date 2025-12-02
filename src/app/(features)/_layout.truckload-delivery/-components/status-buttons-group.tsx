import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Div, Icon } from '@/components/ui'
import { ITruckloadDelivery, QrCodeScannedResult } from '@/services/truckload-delivery.service'
import tw from 'tailwind-styled-components'

import { Json } from '@/common/utils/json'
import { useResetState } from 'ahooks'
import React, { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { TruckloadDeliveryStatus } from '../-constants'
import { useUpdateDispatchOrderSignatureMutation } from '../-hooks/use-truckload-delivery-asm'
import { QRScanner } from '../../-components/-shared/qr-scanner'

const StatusChangeButtonsGroup: React.FC<
	Record<'data', Pick<ITruckloadDelivery, 'dispatch_order' | 'approval_status'>>
> = ({ data }) => {
	const { t } = useTranslation()
	const { mutateAsync: setStatusAsync, isPending } = useUpdateDispatchOrderSignatureMutation()
	const [statusToUpdate, setStatusToUpdate, resetStatusToUpdate] = useResetState<
		TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE
	>(null)
	const [open, setOpen] = useState<boolean>(false)

	const handleSubmit = (scannedResult: { employee_code: string }) => {
		return toast.promise(
			setStatusAsync({
				dispatch_order: data.dispatch_order,
				approval_status: statusToUpdate,
				security_code_reviewed: scannedResult.employee_code
			}),
			{
				loading: t('ns_common:notification.processing_request'),
				success: () => {
					resetStatusToUpdate()
					setOpen(false)
					return t('ns_common:notification.success')
				},
				error: t('ns_common:notification.error')
			}
		)
	}

	return (
		<Fragment>
			{data.approval_status !== TruckloadDeliveryStatus.CONFIRMED && (
				<Button
					variant='ghost'
					size='sm'
					onClick={() => {
						setOpen(true)
						setStatusToUpdate(TruckloadDeliveryStatus.CONFIRMED)
					}}>
					<Icon name='Check' />
					{data.approval_status === TruckloadDeliveryStatus.REQUEST_CHANGE
						? t('ns_common:actions.reconfirm')
						: t('ns_common:actions.confirm')}
				</Button>
			)}
			{data.approval_status !== TruckloadDeliveryStatus.REQUEST_CHANGE && (
				<Button
					variant='ghost'
					className='text-destructive hover:text-destructive'
					size='sm'
					onClick={() => {
						setOpen(true)
						setStatusToUpdate(TruckloadDeliveryStatus.REQUEST_CHANGE)
					}}>
					<Icon name='TriangleAlert' />
					{t('ns_common:actions.report')}
				</Button>
			)}
			<Dialog
				open={open}
				onOpenChange={(open) => {
					if (!open) resetStatusToUpdate()
					setOpen(open)
				}}>
				<DialogContent>
					<DialogHeader className='items-center'>
						<DialogMedia>
							<Icon name='ShieldUser' size={40} strokeWidth={1} />
						</DialogMedia>
						<DialogTitle className='text-center'> {t('ns_auth:texts.qr_code_verification')}</DialogTitle>
						<DialogDescription className='text-center'>
							{t('ns_auth:texts.qr_code_verification_description')}
						</DialogDescription>
					</DialogHeader>
					<Div className='relative overflow-clip rounded-md'>
						{isPending && (
							<Div className='absolute inset-0 z-10 place-content-center place-items-center bg-accent duration-200 animate-in fade-in-0'>
								<Icon name='LoaderCircle' className='animate-spin' />
							</Div>
						)}
						<QRScanner
							onScan={(data) => handleSubmit(Json.parseRawText<QrCodeScannedResult>(data.at(0).rawValue))}
						/>
					</Div>
				</DialogContent>
			</Dialog>
		</Fragment>
	)
}

const DialogMedia = tw.div`mb-2 size-20 aspect-square place-content-center place-items-center bg-accent rounded-full text-accent-foreground`

export default StatusChangeButtonsGroup
