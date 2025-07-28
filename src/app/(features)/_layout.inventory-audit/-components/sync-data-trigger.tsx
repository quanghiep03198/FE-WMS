import { useSocketIo } from '@/common/hooks/use-socket-io'
import { Button, Icon } from '@/components/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { INVENTORY_AUDIT_PROVIDE_TAG } from '../../-hooks/use-report'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy'

type WsResponseMessage = WsResponseBody<{ status: 'progress' | 'completed' | 'failed' }>
type WsMessageData = { tenantId: string }

const SyncDataTrigger: React.FC = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const { data: currentTenant } = useGetTenantByFactory()
	const toastRef = useRef<string | number | null>(null)
	const { data, emit } = useSocketIo<WsResponseMessage, WsMessageData>({
		event: 'sync_inventory_audit_data'
	})

	useEffect(() => {
		switch (data?.metadata?.status) {
			case 'progress':
				toastRef.current = toast.loading(t('ns_common:notification.synchronizing_data'))
				break
			case 'completed':
				toast.success(t('ns_common:notification.success'), { id: toastRef.current })
				queryClient.invalidateQueries({
					predicate: ({ queryKey }) => {
						return queryKey.some((key) => key === INVENTORY_AUDIT_PROVIDE_TAG)
					}
				})
				break
			case 'failed':
				toast.error(t('ns_common:notification.error'), { id: toastRef.current })
				break
			default:
				break
		}
	}, [data])

	const isInSyncProgress = data?.metadata?.status === 'progress'

	return (
		<Button disabled={isInSyncProgress} onClick={() => emit({ tenantId: currentTenant?.id })}>
			<Icon
				name={isInSyncProgress ? 'LoaderCircle' : 'DatabaseBackup'}
				size={18}
				className={isInSyncProgress && 'animate-[spin_1s_linear_infinite]'}
			/>{' '}
			{t('ns_inoutbound:scanner_setting.synchronization')}
		</Button>
	)
}

export default SyncDataTrigger
