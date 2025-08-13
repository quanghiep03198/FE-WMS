import { useWorkerFn } from '@/common/hooks/use-worker-fn'
import compressBase64 from '@/common/utils/compress-base64'
import { convertBase64 } from '@/common/utils/convert-base64'
// import { useWorker } from '@koale/useworker'
import imageCompression from 'browser-image-compression'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseImageUploadProps {
	onUpload?: (url: string) => void
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
	const previewRef = useRef<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [fileName, setFileName] = useState<string | null>(null)
	// const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [compress, uploading] = useWorkerFn(compressBase64)

	const compressImage = async (file) => {
		console.log('originalFile instanceof Blob', file instanceof Blob) // true
		console.log(`originalFile size ${file.size / 1024 / 1024} MB`)

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
					const compressedImage = await compressImage(file)
					const base64Url = await convertBase64(compressedImage)
					const compressedBase64 = await compress(base64Url.toString(), { width: 500, height: 300, quality: 1 })
					console.log('compressedBase64 :>> ', compressedBase64)
					onUpload?.(compressedBase64)
					// setUploadedBase64(base64Url)
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
