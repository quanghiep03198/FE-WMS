import { CommonActions } from '@/common/constants/enums'
import {
	Badge,
	Button,
	buttonVariants,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Icon,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot
} from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { zodResolver } from '@hookform/resolvers/zod'

import { useCountDown } from 'ahooks'
import { padStart, pick } from 'lodash'
import React, { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import z from 'zod'
import { TruckloadDeliveryStatus } from '../-constants'
import { usePageContext } from '../-contexts/page-context'
import { useSetTruckloadDeliveryStatusMutation } from '../-hooks/use-truckload-delivery-asm'

type RowActionsDropdownProps = Record<
	'data',
	Pick<ITruckloadDelivery, 'dispatch_order' | 'license_plate' | 'container_number' | 'status'>
>

const RowActions: React.FC<RowActionsDropdownProps> = ({ data }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()

	return (
		<Div className='flex w-full items-center justify-end [&_svg]:hidden lg:[&_svg]:inline-block xl:[&_svg]:inline-block'>
			<StatusChangeButtonsGroup data={data} />
			{data.status !== TruckloadDeliveryStatus.CONFIRMED && (
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger
						className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'aspect-square' })}>
						<Icon name='Ellipsis' className='!inline-block' />
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end' className='w-40'>
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => {
									event$.emit({
										action: CommonActions.UPDATE_MANY,
										payload: pick(data, ['dispatch_order', 'license_plate', 'container_number'])
									})
								}}>
								<Icon name='PencilLine' className='hidden lg:inline-block xl:inline-block' />
								{t('ns_common:actions.update')}
							</DropdownMenuItem>
							<DropdownMenuItem
								className='text-destructive hover:!text-destructive'
								onClick={() =>
									event$.emit({ action: CommonActions.DELETE_MANY, payload: data.dispatch_order })
								}>
								<Icon name='Trash2' className='hidden lg:inline-block xl:inline-block' />
								{t('ns_common:actions.delete')}
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</Div>
	)
}

const FormSchema = z.object({
	pin: z.string().min(6, {
		message: 'Your one-time password must be 6 characters.'
	})
})

const StatusChangeButtonsGroup: React.FC<Record<'data', Pick<ITruckloadDelivery, 'dispatch_order' | 'status'>>> = ({
	data
}) => {
	const { t } = useTranslation()
	const { mutateAsync: setStatusAsync } = useSetTruckloadDeliveryStatusMutation()
	const [targetDate, setTargetDate] = useState<number>(30_000)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pin: ''
		}
	})

	const [countdown, formattedRes] = useCountDown({ targetDate: targetDate })

	const handleSetStatus = (status: TruckloadDeliveryStatus.CONFIRMED | TruckloadDeliveryStatus.REQUEST_CHANGE) => {
		return toast.promise(setStatusAsync({ dispatchOrder: data.dispatch_order, status }), {
			loading: t('ns_common:notification.processing_request'),
			success: t('ns_common:notification.success'),
			error: t('ns_common:notification.error')
		})
	}

	function onSubmit(data: z.infer<typeof FormSchema>) {
		toast('You submitted the following values', {
			description: (
				<pre className='mt-2 w-[320px] rounded-md bg-neutral-950 p-4'>
					<code className='text-white'>{JSON.stringify(data, null, 2)}</code>
				</pre>
			)
		})
	}

	return (
		<Fragment>
			{data.status !== TruckloadDeliveryStatus.CONFIRMED && (
				<Button
					variant='ghost'
					size='sm'
					onClick={() => setTargetDate(Date.now() + 60_000 * 5)}
					// onClick={() => handleSetStatus(TruckloadDeliveryStatus.CONFIRMED)}
				>
					<Icon name='Check' />
					{data.status === TruckloadDeliveryStatus.REQUEST_CHANGE
						? t('ns_common:actions.reconfirm')
						: t('ns_common:actions.confirm')}
				</Button>
			)}
			{data.status !== TruckloadDeliveryStatus.REQUEST_CHANGE && (
				<Button
					variant='ghost'
					className='text-destructive hover:text-destructive'
					size='sm'
					onClick={() => setTargetDate(Date.now() + 30_000)}
					// onClick={() => handleSetStatus(TruckloadDeliveryStatus.REQUEST_CHANGE)}
				>
					<Icon name='TriangleAlert' />
					{t('ns_common:actions.report')}
				</Button>
			)}
			<Dialog open={countdown > 0}>
				<DialogContent>
					<DialogHeader className='items-center'>
						<DialogMedia>
							<Icon name='ShieldUser' size={40} strokeWidth={1} />
						</DialogMedia>
						<DialogTitle className='text-center'>2FA Security</DialogTitle>
						<DialogDescription className='text-center'>
							Please enter the PIN Code to verify that is you.
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-stretch space-y-6'>
							<FormField
								control={form.control}
								name='pin'
								render={({ field }) => (
									<FormItem className='flex flex-col items-center rounded-md border border-dashed p-6 *:text-center'>
										<FormLabel>PIN Code</FormLabel>
										<FormControl>
											<InputOTP maxLength={6} {...field} type='password'>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<Badge variant='secondary'>
											Session end after {padStart(String(formattedRes.minutes), 2, '0')}:
											{padStart(String(formattedRes.seconds), 2, '0')}
										</Badge>
										<FormDescription className='inline-flex items-center gap-x-1 text-warning'>
											<Icon name='ShieldAlert' />
											Your account will be blocked if you enter wrong pin code 5 times
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit'>
								<Icon name='Check' size={18} />
								Verify
							</Button>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</Fragment>
	)
}

const DialogMedia = tw.div`mb-2 size-20 aspect-square place-content-center place-items-center bg-accent rounded-full text-accent-foreground`

export default RowActions
