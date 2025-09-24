import { CommonActions } from '@/common/constants/enums'
import { IRFIDReaderDevice } from '@/common/types/entities'
import {
	Dialog,
	DialogContent,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	Label,
	RadioGroup,
	RadioGroupItem
} from '@/components/ui'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

type RFIDDeviceFormDialogProps = {
	event$: EventEmitter<
		| { action: CommonActions.CREATE; defaultValues: null }
		| { action: CommonActions.UPDATE; defaultValues: Partial<IRFIDReaderDevice> }
	>
}

const RFIDDeviceFormDialog: React.FC<RFIDDeviceFormDialogProps> = ({ event$ }) => {
	const [open, setOpen] = useState<boolean>(false)
	const [action, setAction] = useState<CommonActions.CREATE | CommonActions.UPDATE>(null)
	const { t } = useTranslation()
	const form = useForm<any>()

	event$.useSubscription(({ action, defaultValues }) => {
		setOpen((prev) => !prev)
		setAction(action)
		if (action === CommonActions.UPDATE && defaultValues) {
			form.reset(defaultValues)
		}
	})

	return (
		<Dialog defaultOpen={false} open={open} onOpenChange={setOpen}>
			<DialogContent>
				<FormProvider {...form}>
					<Form>
						<InputFieldControl
							name='device_sn'
							label={t('ns_rfid:fields.device_sn')}
							disabled={action === CommonActions.UPDATE}
							placeholder='xxxxxxxxx'
							description='The serial number is usually found on a sticker on the back of the device.'
						/>
						<InputFieldControl name='device_name' label={t('ns_rfid:fields.station_no')} placeholder='WH101' />
						<InputFieldControl name='ip_address' label='TCP/IP' placeholder='192.xxx.xxx.xxx' />
						<InputFieldControl name='ip_port' label='TCP/IP port' placeholder='8160' />
						<RadioGroup defaultValue='atenna'>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='atenna' id='atenna' />
								<Label htmlFor='atenna' className='inline-flex items-center gap-x-2'>
									Atenna <Icon name='Router' />
								</Label>
							</div>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='handhold' id='handhold' />
								<Label htmlFor='handhold' className='inline-flex items-center gap-x-2'>
									Handhold <Icon name='SmartphoneNfc' />
								</Label>
							</div>
						</RadioGroup>
					</Form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

const Form = tw.form<React.ComponentProps<'form'>>`flex flex-col items-stretch gap-y-6`

export default RFIDDeviceFormDialog
