import { useSocketIo } from '@/common/hooks/use-socket-io'
import { Button, Icon } from '@/components/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { InventoryAuditQueryKeys } from '../-hooks/use-inventory-audit-asm'

type WsResponseMessage = WsResponseBody<{ status: 'progress' | 'completed' | 'failed' }>

const SyncDataTrigger: React.FC = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const { data, emit } = useSocketIo<WsResponseMessage, void>({
		event: 'sync_inventory_audit_data'
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
			disabled={isInSyncProgress}
			onClick={() => emit()}
			className='group aria-busy:after:content-["..."]'>
			<Icon
				name={isInSyncProgress ? 'LoaderCircle' : 'DatabaseBackup'}
				size={18}
				className='group-aria-busy:animate-[spin_1s_linear_infinite]'
			/>{' '}
			{t('ns_inoutbound:scanner_setting.synchronization')}
		</Button>
	)
}

export default SyncDataTrigger
