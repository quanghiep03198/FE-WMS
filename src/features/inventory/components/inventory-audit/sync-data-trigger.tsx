import { useSocketContext } from '@/stores/socket.store'
import { Json } from '@common/utils/json'
import { Button, Icon } from '@components/ui'
import useAuth from '@hooks/use-auth'
import { useEffectOnce } from '@hooks/use-effect-once'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { InventoryAuditQueryKeys } from '../../hooks/use-inventory-audit-request'

type WsResponseMessage = WsResponseBody<{ status: 'progress' | 'completed' | 'failed' }>

const SyncDataTrigger: React.FC = () => {
	const { user } = useAuth()
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const { io, isConnected } = useSocketContext('io', 'isConnected')
	const [data, setData] = useState<WsResponseMessage>(null)

	const handleDataChange = (data: string) => setData(Json.parse<WsResponseMessage>(data))

	useEffectOnce(() => {
		io.on('sync_inventory_audit_data', handleDataChange)

		return () => {
			io.off('sync_inventory_audit_data', handleDataChange)
		}
	})

	useEffect(() => {
		switch (data?.metadata?.status) {
			case 'completed':
				toast.success(t('ns_common:notification.success'))
				queryClient.invalidateQueries({
					predicate: ({ queryKey }) => {
						return queryKey.some((key) => key === InventoryAuditQueryKeys.INVENTORY_AUDIT)
					}
				})
				break
			case 'failed':
				toast.error(t('ns_common:notification.error'))
				break
			default:
				break
		}
	}, [data])

	const isInSyncProgress = data?.metadata?.status === 'progress'

	return (
		<Button
			aria-busy={isInSyncProgress}
			disabled={isInSyncProgress || !isConnected}
			onClick={() => io.emit('sync_inventory_audit_data', { factoryCode: user.current_factory_code })}
			className='group aria-busy:after:content-["..."]'>
			<Icon
				name={isInSyncProgress ? 'LoaderCircle' : 'DatabaseBackup'}
				size={18}
				className='group-aria-busy:animate-spin'
			/>
			{t('ns_inoutbound:scanner_setting.synchronization')}
		</Button>
	)
}

export default SyncDataTrigger
