import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditorContext } from '../context/editor-context'

type UseImageUploadOptions = {
	onUpload?: (url: string) => void
	onError?: () => void
}

export function useImageUpload({ onUpload, onError }: UseImageUploadOptions = {}) {
	const { uploadImage } = useEditorContext()
	const previewRef = useRef<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [fileName, setFileName] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const [isPending, setIsPending] = useState(false)

	const handleThumbnailClick = useCallback(() => {
		fileInputRef.current?.click()
	}, [])

	const handleFileChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0]
			if (file) {
				setFileName(file.name)
				const localUrl = URL.createObjectURL(file)
				setPreviewUrl(localUrl)
				previewRef.current = localUrl
				setIsPending(true)
				try {
					const url = await uploadImage(file)
					onUpload?.(url)
				} catch (err) {
					URL.revokeObjectURL(localUrl)
					setPreviewUrl(null)
					setFileName(null)
					setError(err instanceof Error ? err.message : 'Image upload failed')
					onError?.()
				} finally {
					setIsPending(false)
				}
			}
		},
		[onUpload, onError, uploadImage]
	)

	const handleRemove = useCallback(() => {
		if (previewRef.current) {
			URL.revokeObjectURL(previewRef.current)
		}
		setPreviewUrl(null)
		setFileName(null)
		previewRef.current = null
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
		setError(null)
	}, [])

	useEffect(() => {
		return () => {
			if (previewRef.current) {
				URL.revokeObjectURL(previewRef.current)
			}
		}
	}, [])

	return {
		previewUrl,
		fileName,
		fileInputRef,
		handleThumbnailClick,
		handleFileChange,
		handleRemove,
		isPending,
		error
	}
}
