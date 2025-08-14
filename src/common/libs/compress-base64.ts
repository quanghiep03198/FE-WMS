type CompressBase64Options = {
	type?: string
	width?: number
	height?: number
	min?: number // KB
	max?: number // KB
	quality?: number // quality ưa thích ban đầu
	// ...có thể mở rộng thêm các option khác nếu cần...
}

export default async function compressBase64(base64: string, options?: CompressBase64Options) {
	const { type = 'image/jpeg', width, height, min = 0, max = 200, quality = 1 } = options ?? {}

	function blobToBase64(blob: Blob): Promise<string> {
		return new Promise((resolve) => {
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result as string)
			reader.readAsDataURL(blob)
		})
	}

	try {
		const srcBlob = await fetch(base64).then((res) => res.blob())
		const imgBitmap = await createImageBitmap(srcBlob)

		const originalWidth = imgBitmap.width
		const originalHeight = imgBitmap.height
		let targetWidth = originalWidth
		let targetHeight = originalHeight

		// Tính kích thước đích theo tỉ lệ (không méo)
		if (width && height) {
			const widthRatio = width / originalWidth
			const heightRatio = height / originalHeight
			const ratio = Math.min(widthRatio, heightRatio)
			targetWidth = Math.max(1, Math.round(originalWidth * ratio))
			targetHeight = Math.max(1, Math.round(originalHeight * ratio))
		} else if (width) {
			targetWidth = Math.max(1, width)
			targetHeight = Math.max(1, Math.round((width / originalWidth) * originalHeight))
		} else if (height) {
			targetHeight = Math.max(1, height)
			targetWidth = Math.max(1, Math.round((height / originalHeight) * originalWidth))
		}

		// Helper: vẽ ra blob với chất lượng smoothing cao
		async function renderToBlob(w: number, h: number, q: number): Promise<Blob> {
			const canvas = new OffscreenCanvas(w, h)
			const ctx = canvas.getContext('2d')
			if (!ctx) throw new Error('2D context is not available')
			;(ctx as any).imageSmoothingEnabled = true
			;(ctx as any).imageSmoothingQuality = 'high'

			ctx.clearRect(0, 0, w, h)
			ctx.drawImage(imgBitmap, 0, 0, w, h)

			const qSafe = Math.max(0, Math.min(1, q))
			return await canvas.convertToBlob({ type, quality: qSafe })
		}

		// Binary search quality cao nhất nhưng vẫn <= max (KB)
		async function fitUnderMax(w: number, h: number) {
			if (max <= 0) {
				// Không giới hạn max -> render với quality yêu thích
				const b = await renderToBlob(w, h, quality)
				return { q: quality, blob: b }
			}

			let low = 0.3 // ngưỡng chất lượng thấp nhất để vẫn giữ độ nét tương đối
			let high = 1
			let best: { q: number; blob: Blob } | null = null

			// Thử trước với quality ưa thích
			const firstBlob = await renderToBlob(w, h, quality)
			if (firstBlob.size / 1024 <= max) {
				best = { q: quality, blob: firstBlob }
				low = Math.max(low, quality)
			} else {
				high = Math.min(high, quality)
			}

			// Binary search ~10 vòng
			for (let i = 0; i < 10; i++) {
				const mid = (low + high) / 2
				const b = await renderToBlob(w, h, mid)
				const kb = b.size / 1024
				if (kb <= max) {
					best = { q: mid, blob: b }
					low = mid // thử tăng chất lượng thêm
				} else {
					high = mid // giảm chất lượng
				}
			}

			// Nếu vẫn chưa đạt, thử ở low (cận dưới)
			if (!best) {
				const b = await renderToBlob(w, h, low)
				if (b.size / 1024 <= max) best = { q: low, blob: b }
			}

			return best
		}

		// Chiến lược: ưu tiên giữ kích thước (theo width/height đã chọn) và tối ưu quality.
		// Nếu vẫn vượt max, giảm kích thước theo tỉ lệ rồi thử lại.
		let w = targetWidth
		let h = targetHeight

		let fitted = await fitUnderMax(w, h)

		// Nếu không fit nổi theo max, downscale dần (giảm theo tỉ lệ) và thử lại
		if (!fitted && max > 0) {
			for (let i = 0; i < 7; i++) {
				// giảm kích thước ~15% mỗi vòng, ưu tiên giảm kích thước thay vì hạ quality quá mạnh
				w = Math.max(1, Math.round(w * 0.85))
				h = Math.max(1, Math.round(h * 0.85))
				fitted = await fitUnderMax(w, h)
				if (fitted) break
			}
		}

		let finalBlob: Blob
		let finalQ = quality

		if (fitted) {
			finalBlob = fitted.blob
			finalQ = fitted.q

			// Nếu có min (KB), cố gắng tăng quality tối đa nhưng không vượt max
			if (min > 0) {
				const kb = finalBlob.size / 1024
				if (kb < min) {
					let low = finalQ
					let high = 1
					let best = { q: finalQ, blob: finalBlob }
					for (let i = 0; i < 8; i++) {
						const mid = (low + high) / 2
						const b = await renderToBlob(w, h, mid)
						const sizeKB = b.size / 1024
						if (sizeKB <= max && sizeKB >= min) {
							best = { q: mid, blob: b }
							low = mid
						} else if (sizeKB < min) {
							low = mid
							best = { q: mid, blob: b }
						} else {
							high = mid
						}
					}
					finalQ = best.q
					finalBlob = best.blob
				}
			}
		} else {
			// fallback: không có ràng buộc hoặc không thể đạt max, render theo quality ưa thích
			finalBlob = await renderToBlob(w, h, quality)
		}

		// Chỉ convert sang base64 một lần ở cuối
		const base64Result = await blobToBase64(finalBlob)

		// Giải phóng bitmap
		if ('close' in imgBitmap) (imgBitmap as any).close?.()

		return base64Result
	} catch (error) {
		const message = (error as Error)?.message ?? String(error)
		throw new Error(`Compression failed: ${message}`)
	}
}
