import useQueryParams from '@/common/hooks/use-query-params'
import { Button, Icon } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PMInboundSearch } from '../..'
import { useUpdateStockMutation } from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'

const DataListAction: React.FC = () => {
	const { t } = useTranslation()
	const { scannedEpc, selectedOrder } = usePageContext('scannedEpc', 'selectedOrder')
	const { searchParams } = useQueryParams<PMInboundSearch>()

	const { mutateAsync, isPending } = useUpdateStockMutation()

	const handleUpdateStock = () => {
		toast.promise(mutateAsync({ ...searchParams, selectedOrder }), {
			loading: t('ns_common:notification.processing_request'),
			success: t('ns_common:notification.success'),
			error: t('ns_common:notification.error')
		})
	}

	console.log(selectedOrder)

	return (
		<Button
			disabled={isPending || scannedEpc?.totalDocs === 0 || selectedOrder === 'all'}
			size='lg'
			onClick={handleUpdateStock}>
			{isPending ? (
				<Icon name='LoaderCircle' className='animate-spin' size={20} role='img' />
			) : (
				<Icon name='BaggageClaim' role='img' size={20} />
			)}
			{t('ns_common:actions.save')}
		</Button>
	)
}

export default DataListAction
