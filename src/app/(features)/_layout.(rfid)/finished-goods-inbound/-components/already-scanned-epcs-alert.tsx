import type { DeleteScannedEpcsFormValues } from '@/app/(features)/-schemas/delete-epc.schema'
import { Json } from '@/common/utils/json'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	DataTable,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Icon
} from '@/components/ui'
import { ROW_ACTIONS_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { useEffectOnce } from '@/hooks/use-effect-once'
import { useSocketContext } from '@/stores/socket.store'
import { createColumnHelper } from '@tanstack/react-table'
import { useMemoizedFn, useUpdateEffect } from 'ahooks'
import { format } from 'date-fns'
import { uniqBy } from 'lodash-es'
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../-contexts/page-context'
import { useDeleteEpcMutation } from '../-hooks/use-rfid-inbound-asm'
import { GhostButton } from '../../-components/shared/styled'

type AlreadyScannedEpc = {
	epc: string
	mo_no: string
	factory_shoes_style: string
	color_sn: string
	size_numcode: string
	record_time: Date
}

const AlreadyScannedEpcsAlert: React.FC = () => {
	const { io } = useSocketContext('io')
	const [duplicatedEpcs, setDuplicatedEpcs] = useState<AlreadyScannedEpc[]>([])
	const { t, i18n } = useTranslation()
	const { scanningStatus } = usePageContext('scanningStatus')
	const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false)
	const [shouldShowAlert, setShouldShowAlert] = useState<boolean>(false)
	const { mutateAsync: deleteAsync, isPending } = useDeleteEpcMutation()
	const dismissRef = useRef<boolean>(false)

	const handleDataChange = useCallback((data: string) => {
		setDuplicatedEpcs((prev) => {
			const incommingData = Json.parse<AlreadyScannedEpc[]>(data)
			if (!Array.isArray(incommingData) || incommingData.length === 0) return prev
			return uniqBy([...prev, ...incommingData], (item: AlreadyScannedEpc) => item.epc)
		})
	}, [])

	useEffectOnce(() => {
		io.on('rfid.inbound.check', handleDataChange)

		return () => {
			io.off('rfid.inbound.check', handleDataChange)
		}
	})

	const handleDeleteEpcs = useMemoizedFn(async (data: string | string[]) => {
		const id = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await deleteAsync({
				epcs: typeof data === 'string' ? [data] : data,
				rescannable: false
			} satisfies DeleteScannedEpcsFormValues)
			setDuplicatedEpcs((prev) =>
				prev?.filter((item) =>
					typeof data === 'string' ? item.epc !== data : !data.some((epc) => epc === item.epc)
				)
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch (e) {
			toast.error(e.message, { id })
		}
	})

	const columnHelper = createColumnHelper<AlreadyScannedEpc>()

	const columns = useMemo(() => {
		return [
			columnHelper.accessor('epc', {
				header: 'EPC'
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableSorting: true
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableSorting: true
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableSorting: true
			}),
			columnHelper.accessor('size_numcode', {
				header: 'Size',
				enableSorting: true
			}),
			columnHelper.accessor('record_time', {
				header: t('ns_erp:fields.inbound_date'),
				enableSorting: true,
				cell: (info) => format(new Date(info.getValue()), 'yyyy-MM-dd HH:mm:ss')
			}),
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				header: '-',
				size: 60,
				maxSize: 60,
				meta: { align: 'center' },
				cell: ({ row }) => (
					<GhostButton
						className='w-full hover:text-destructive'
						data-pending={isPending}
						onClick={() => handleDeleteEpcs(row.original.epc)}>
						<Icon name='Trash2' />
					</GhostButton>
				)
			})
		]
	}, [i18n.language, isPending])

	useUpdateEffect(() => {
		const shouldShowAlert =
			!dismissRef.current &&
			Array.isArray(duplicatedEpcs) &&
			duplicatedEpcs.length > 0 &&
			!detailDialogOpen &&
			scanningStatus === 'connected'
		setShouldShowAlert(shouldShowAlert)
	}, [duplicatedEpcs, scanningStatus])

	return (
		<Fragment>
			<AlertDialog open={shouldShowAlert}>
				<AlertDialogContent>
					<AlertDialogHeader className='text-left'>
						<AlertDialogTitle>{t('ns_common:titles.caution')}</AlertDialogTitle>
						<AlertDialogDescription>
							{t('ns_inoutbound:notification.already_inbound_epcs')}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => {
								dismissRef.current = true
								setShouldShowAlert(false)
							}}>
							{t('ns_common:actions.dismiss')}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								setDetailDialogOpen(true)
								setShouldShowAlert(false)
							}}>
							{t('ns_common:actions.detail')}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
				<DialogContent className='max-w-[80vw] [&>button:first-of-type]:hidden'>
					<DialogHeader className='flex-row justify-between'>
						<div className='space-y-1'>
							<DialogTitle>{t('ns_inoutbound:titles.inbound_history')}</DialogTitle>
							<DialogDescription>
								{t('ns_inoutbound:description.list_of_already_scanned_epcs')}
							</DialogDescription>
						</div>
						<Button
							variant='destructive'
							onClick={() => handleDeleteEpcs(duplicatedEpcs.map((item) => item.epc))}>
							<Icon name='Trash2' />
							{t('ns_common:actions.delete_all')}
						</Button>
					</DialogHeader>
					<DataTable
						border='bottom-only'
						columns={columns}
						data={duplicatedEpcs ?? []}
						containerProps={{
							className: 'h-96 [&_tr:has(button[data-pending=true])_td]:animate-pulse'
						}}
						toolbarProps={{
							override: true,
							render: () => null
						}}
					/>
				</DialogContent>
			</Dialog>
		</Fragment>
	)
}

export default AlreadyScannedEpcsAlert
