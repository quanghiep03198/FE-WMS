type CompressBase64Options = {
	type?: string
	width?: number
	height?: number
	min?: number
	max?: number
	quality?: number
}

export default async function compressBase64(base64: string, options?: CompressBase64Options) {
	const step = 0.001

	const { type = 'image/jpeg', width, height, min = 0, max = 200, quality = 0.8 } = options

	function blobToBase64(blob): Promise<string> {
		return new Promise((resolve) => {
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result as string)
			reader.readAsDataURL(blob)
		})
	}

	try {
		// 1. Chuyển base64 thành Blob
		const blob = await fetch(base64).then((res) => res.blob())

		// 2. Tạo ImageBitmap từ Blob (không cần DOM)
		const imgBitmap = await createImageBitmap(blob)

		// 3. Tính toán kích thước mới (giữ tỉ lệ)
		let targetWidth = width
		let targetHeight = height

		if (isNaN(targetWidth) && isNaN(targetHeight)) {
			targetWidth = imgBitmap.width
			targetHeight = imgBitmap.height
		} else {
			if (!isNaN(targetWidth) && isNaN(targetHeight)) {
				targetHeight = (targetWidth * imgBitmap.height) / imgBitmap.width
			} else if (isNaN(targetWidth) && !isNaN(targetHeight)) {
				targetWidth = (targetHeight * imgBitmap.width) / imgBitmap.height
			}
		}

		// 4. Tạo OffscreenCanvas để vẽ và nén
		const canvas = new OffscreenCanvas(targetWidth, targetHeight)
		const ctx = canvas.getContext('2d')
		ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight)

		// 5. Nén ảnh với chất lượng động
		let tq = quality
		let compressedBlob = await canvas.convertToBlob({ type, quality: tq })
		let base64Result = await blobToBase64(compressedBlob)

		// Giảm chất lượng nếu vượt quá max (KB)
		while (base64Result.length / 1024 > max) {
			if (tq <= step) break
			tq -= step
			compressedBlob = await canvas.convertToBlob({ type, quality: tq })
			base64Result = await blobToBase64(compressedBlob)
		}

		// Tăng chất lượng nếu nhỏ hơn min (KB) - nếu cần
		while (min > 0 && base64Result.length / 1024 < min) {
			tq += step
			compressedBlob = await canvas.convertToBlob({ type, quality: tq })
			base64Result = await blobToBase64(compressedBlob)
		}

		return base64Result
	} catch (error) {
		throw new Error(`Compression failed: ${error.message}`)
	}
}

// Hỗ trợ chuyển Blob sang base64
