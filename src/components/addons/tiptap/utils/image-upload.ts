import axiosInstance from '@configs/axios.config'
import { AppConfigs } from '@configs/app.config'

const imageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const maxImageSize = 5 * 1024 * 1024

export async function uploadImage(file: File): Promise<string> {
	if (!imageTypes.includes(file.type)) throw new Error('Unsupported image type')

	const bitmap = await createImageBitmap(file)
	let blob: Blob
	try {
		const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
		const canvas = document.createElement('canvas')
		canvas.width = Math.max(1, Math.round(bitmap.width * scale))
		canvas.height = Math.max(1, Math.round(bitmap.height * scale))
		const context = canvas.getContext('2d')
		if (!context) throw new Error('Canvas is unavailable')
		context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
		blob = await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob((result) => {
				if (result && result.type === 'image/webp') resolve(result)
				else reject(new Error('WebP encoding failed'))
			}, 'image/webp', 0.8)
		})
	} finally {
		bitmap.close()
	}

	if (blob.size > maxImageSize) throw new Error('Image exceeds 5 MB after compression')
	const form = new FormData()
	form.append('file', blob, `${file.name.replace(/\.[^.]+$/, '')}.webp`)
	const baseURL = import.meta.env.DEV ? window.location.origin : new URL(AppConfigs.BASE_API_URL, window.location.origin).origin
	const response = await axiosInstance.post<unknown, { id: string; url: string }>('/uploads/images', form, {
		baseURL,
		headers: { 'Content-Type': 'multipart/form-data' }
	})
	if (!response || typeof response.id !== 'string' || typeof response.url !== 'string' || !/^\/files\/[^/?#]+$/.test(response.url)) {
		throw new Error('Invalid image upload response')
	}
	return response.url
}
