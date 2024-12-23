import { Button, Div, Icon, Label, Typography } from '@/components/ui'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useSyncDataMutation } from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'

const SyncRunner: React.FC = () => {
	const { t } = useTranslation()
	const { connection } = usePageContext('connection')
	const toastRef = useRef(null)

	const { mutateAsync, isPending } = useSyncDataMutation()

	const handleTriggerSyncData = async () => {
		toastRef.current = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(connection)
			toast.success(t('ns_common:notification.success'), { id: toastRef.current })
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastRef.current })
		}
	}

	return (
		<Div as='section' className='flex flex-1 flex-col gap-y-3'>
			<Typography variant='h6' className='text-lg sm:text-base md:text-base'>
				{t('ns_inoutbound:scanner_setting.data_synchronization')}
			</Typography>

			<Div className='grid flex-1 grid-cols-4 items-center gap-y-6 rounded-lg border p-4 @[320px]:gap-0'>
				<Div className='col-span-full space-y-1 @[320px]:col-span-3'>
					<Label htmlFor='webhook-trigger'>{t('ns_inoutbound:scanner_setting.synchronization_trigger')}</Label>
					<Typography variant='small' color='muted' className='max-w-[calc(100%-0.5rem)] text-pretty'>
						{t('ns_inoutbound:scanner_setting.synchronization_trigger_description')}
					</Typography>
				</Div>
				<Div className='col-span-full grid @[320px]:col-span-1 @[320px]:place-content-end'>
					<Button
						disabled={!connection || isPending}
						variant='outline'
						id='webhook-trigger'
						onClick={handleTriggerSyncData}>
						{isPending ? (
							<Icon name='RefreshCw' role='img' className='animate-[spin_2s_linear_infinite]' />
						) : (
							<Icon name='Webhook' role='img' />
						)}
						Trigger
					</Button>
				</Div>
			</Div>
		</Div>
	)
}

export default SyncRunner
