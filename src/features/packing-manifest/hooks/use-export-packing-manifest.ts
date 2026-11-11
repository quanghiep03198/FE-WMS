import env from '@common/utils/env'
import { AuthService } from '@features/auth/services/auth.service'
import { PackingService } from '@features/packing-manifest/services/packing.service'
import type { ManifestFilters } from '@features/packing-manifest/utils/manifest-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

function triggerDownload(jobId: string) {
	const link = document.createElement('a')
	link.href = PackingService.manifestExportDownloadUrl(jobId)
	link.click()
}

export function useExportPackingManifest(filters: ManifestFilters) {
	const storageKey = `packing-manifest-export:${env<string>('VITE_APP_TENANT')}:${AuthService.getCredentials()?.username ?? ''}`
	const downloadedKey = `${storageKey}:downloaded`
	const toastId = storageKey
	const { t } = useTranslation()
	const [jobId, setJobId] = useState(() => sessionStorage.getItem(storageKey))
	const [downloadedJobId, setDownloadedJobId] = useState(() => sessionStorage.getItem(downloadedKey))
	const [expired, setExpired] = useState(false)
	const checkingJob = useRef<string | null>(null)
	const create = useMutation({
		mutationFn: (currentFilters: ManifestFilters) => PackingService.createManifestExport(currentFilters),
		meta: { suppressNotifications: true }
	})
	const statusQuery = useQuery({
		queryKey: ['PACKING_MANIFEST_EXPORT', jobId],
		queryFn: () => {
			if (!jobId) throw new Error('Missing export job ID')
			return PackingService.getManifestExportStatus(jobId)
		},
		enabled: !!jobId,
		meta: { suppressErrorToast: true },
		retry: false,
		refetchInterval: (query) => {
			const status = query.state.data?.status
			const error = query.state.error
			if (status === 'done' || status === 'failed' || status === 'expired') return false
			if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 410))
				return false
			return 2000
		}
	})
	const status = statusQuery.data
	useEffect(() => {
		const error = statusQuery.error
		if (
			status?.status === 'expired' ||
			(axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 410))
		) {
			sessionStorage.removeItem(storageKey)
			setJobId(null)
			setExpired(true)
		}
	}, [status, statusQuery.error, storageKey])

	const start = async () => {
		toast.dismiss(toastId)
		setExpired(false)
		try {
			const result = await create.mutateAsync(filters)
			sessionStorage.setItem(storageKey, result.jobId)
			setExpired(false)
			setJobId(result.jobId)
		} catch (error) {
			const code = axios.isAxiosError(error) ? error.response?.status : undefined
			toast.error(
				t(code === 429 || code === 409 ? 'ns_packing:manifest.too_many' : 'ns_packing:manifest.create_error'),
				{ id: toastId }
			)
		}
	}
	const download = useCallback(async () => {
		if (!jobId) throw new Error('Missing export job ID')
		const result = await statusQuery.refetch()
		if (!result.error && result.data?.status === 'done') {
			triggerDownload(jobId)
			return true
		}
		return false
	}, [jobId, statusQuery.refetch])

	useEffect(() => {
		if (!jobId || status?.status !== 'done' || statusQuery.error || statusQuery.isFetching) return
		if (sessionStorage.getItem(downloadedKey) === jobId || checkingJob.current === jobId) return
		checkingJob.current = jobId
		void statusQuery.refetch().then((result) => {
			if (!result.error && result.data?.status === 'done') {
				if (sessionStorage.getItem(downloadedKey) !== jobId) {
					sessionStorage.setItem(downloadedKey, jobId)
					triggerDownload(jobId)
				}
				setDownloadedJobId(jobId)
			}
			checkingJob.current = null
		})
	}, [downloadedKey, jobId, status?.status, statusQuery.error, statusQuery.isFetching, statusQuery.refetch])

	useEffect(() => {
		if (create.isPending) {
			return
		} else if (create.error) {
			const code = axios.isAxiosError(create.error) ? create.error.response?.status : undefined
			toast.error(
				t(code === 429 || code === 409 ? 'ns_packing:manifest.too_many' : 'ns_packing:manifest.create_error'),
				{ id: toastId }
			)
		} else if (expired) {
			toast.error(t('ns_packing:manifest.expired'), { id: toastId })
		} else if (statusQuery.error) {
			toast.error(t('ns_packing:manifest.status_error'), {
				id: toastId,
				action: { label: t('ns_packing:manifest.retry'), onClick: () => void statusQuery.refetch() }
			})
		} else if (jobId && status?.status === 'failed') {
			toast.error(t('ns_packing:manifest.failed'), { id: toastId, description: status.error })
		} else if (jobId && status?.status === 'done' && downloadedJobId === jobId) {
			toast.success(t('ns_packing:manifest.ready'), {
				id: toastId,
				action: { label: t('ns_packing:manifest.retry_download'), onClick: () => void download() }
			})
		} else if (jobId && (status?.status === 'pending' || status?.status === 'processing')) {
			const percent =
				status?.status === 'processing' && status.totalRows > 0
					? `: ${Math.max(0, Math.min(100, Math.floor((status.processedRows / status.totalRows) * 100)))}%`
					: ''
			const message =
				status?.status === 'processing' ? 'ns_packing:manifest.processing' : 'ns_packing:manifest.pending'
			toast.loading(`${t(message)}${percent}`, { id: toastId })
		}
	}, [
		create.error,
		create.isPending,
		download,
		downloadedJobId,
		expired,
		jobId,
		status,
		statusQuery.error,
		statusQuery.refetch,
		t,
		toastId
	])

	const isRunning =
		create.isPending ||
		(!!jobId &&
			(!status ||
				status.status === 'pending' ||
				status.status === 'processing' ||
				(status.status === 'done' && downloadedJobId !== jobId && !statusQuery.error)))

	return {
		jobId,
		status,
		statusError: statusQuery.error,
		retryStatus: statusQuery.refetch,
		download,
		downloadUrl: jobId ? PackingService.manifestExportDownloadUrl(jobId) : undefined,
		expired,
		isRunning,
		start,
		createError: create.error
	}
}
