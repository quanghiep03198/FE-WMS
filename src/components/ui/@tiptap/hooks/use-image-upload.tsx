import { useWorkerFn } from '@/common/hooks/use-worker-fn'
import compressBase64 from '@/common/libs/compress-base64'
import { convertBase64 } from '@/common/utils/convert-base64'
import imageCompression from 'browser-image-compression'
import { filesize } from 'filesize'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseImageUploadProps {
	onUpload?: (url: string) => void
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
	const previewRef = useRef<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [fileName, setFileName] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const [compress, uploading] = useWorkerFn(compressBase64)

	const compressImage = async (file: File) => {
		try {
			const compressedFile = await imageCompression(file, {
				maxSizeMB: 5,
				maxWidthOrHeight: 1920,
				useWebWorker: true
			})
			return compressedFile // write your own logic
		} catch (error) {
			console.log(error)
		}
	}

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
				try {
					// const compressedImage = await compressImage(file)
					const base64Url = await convertBase64(file)
					const compressedBase64 = await compress(base64Url.toString(), { quality: 1 })
					console.debug(filesize(compressedBase64.length, { base: 10, round: 1 }))
					onUpload?.(compressedBase64)
				} catch (err) {
					URL.revokeObjectURL(localUrl)
					setPreviewUrl(null)
					setFileName(null)
					return console.error(err)
				}
			}
		},
		[onUpload]
	)

	const handleRemove = useCallback(() => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl)
		}
		setPreviewUrl(null)
		setFileName(null)
		previewRef.current = null
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
		setError(null)
	}, [previewUrl])

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
		uploading,
		error
	}
}
