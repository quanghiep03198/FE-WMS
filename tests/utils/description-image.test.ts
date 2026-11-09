import { sanitizeDescription } from '@common/utils/sanitize-description'
import { resolveImageUrl } from '@common/utils/image-url'
import { uploadImage } from '@components/addons/tiptap/utils/image-upload'
import { extractClipboardImages } from '@components/addons/tiptap/utils/clipboard-images'
import { afterEach, describe, expect, it, vi } from 'vitest'

const post = vi.hoisted(() => vi.fn())
vi.mock('@configs/axios.config', () => ({ default: { post } }))
vi.mock('@configs/app.config', () => ({ AppConfigs: { BASE_API_URL: 'https://api.example.test/api' } }))

afterEach(() => {
	vi.restoreAllMocks()
	vi.unstubAllEnvs()
	post.mockReset()
})

describe('description images', () => {
	it('sanitizes HTML while retaining legacy images and adding lazy decoding', () => {
		const result = sanitizeDescription(
			'<script>alert(1)</script><img src="data:image/png;base64,abc" onerror="alert(1)"><img src="/files/123">'
		)
		const container = document.createElement('div')
		container.innerHTML = result
		const images = container.querySelectorAll('img')
		expect(container.querySelector('script')).toBeNull()
		expect(images).toHaveLength(2)
		expect(images[0].getAttribute('src')).toBe('data:image/png;base64,abc')
		expect(images[0].hasAttribute('onerror')).toBe(false)
		expect(images[1].getAttribute('src')).toBe('/files/123')
		for (const image of images) {
			expect(image.getAttribute('loading')).toBe('lazy')
			expect(image.getAttribute('decoding')).toBe('async')
		}
	})

	it('resolves file URLs against the API origin in production', () => {
		vi.stubEnv('DEV', false)
		expect(resolveImageUrl('/files/123')).toBe('https://api.example.test/files/123')
		expect(resolveImageUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
	})

	it('extracts pasted base64 images without leaving them in the pasted HTML', () => {
		const result = extractClipboardImages('<p>Text</p><img src="DATA:image/png;base64,eA==">')
		expect(result?.html).toBe('<p>Text</p>')
		expect(result?.files).toHaveLength(1)
		expect(result?.files[0].type).toBe('image/png')
		expect(result?.files[0].size).toBe(1)
		expect(extractClipboardImages('<p>No image</p>')).toBeNull()
		expect(() => extractClipboardImages('<img src="data:image/png,invalid">')).toThrow()
	})

	it('resizes to 1600px, uploads WebP and returns the server URL', async () => {
		const close = vi.fn()
		vi.spyOn(globalThis, 'createImageBitmap').mockResolvedValue({ width: 3200, height: 800, close } as ImageBitmap)
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D)
		vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (this: HTMLCanvasElement, callback, type, quality) {
			expect(this.width).toBe(1600)
			expect(this.height).toBe(400)
			expect(type).toBe('image/webp')
			expect(quality).toBe(0.8)
			callback(new Blob(['image'], { type: 'image/webp' }))
		})
		post.mockResolvedValue({ id: '123', url: '/files/123' })

		await expect(uploadImage(new File(['image'], 'photo.png', { type: 'image/png' }))).resolves.toBe('/files/123')
		const [path, form] = post.mock.calls[0]
		expect(path).toBe('/uploads/images')
		expect((form as FormData).get('file')).toBeInstanceOf(File)
		expect(((form as FormData).get('file') as File).type).toBe('image/webp')
		expect(close).toHaveBeenCalledOnce()
	})

	it('rejects unsupported files and oversized compressed output', async () => {
		await expect(uploadImage(new File(['x'], 'image.svg', { type: 'image/svg+xml' }))).rejects.toThrow('Unsupported')
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D)
		vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
			callback(new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], { type: 'image/webp' }))
		})
		await expect(uploadImage(new File(['x'], 'image.png', { type: 'image/png' }))).rejects.toThrow('5 MB')
		expect(post).not.toHaveBeenCalled()
	})

	it('accepts compressed output at exactly 5 MiB', async () => {
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D)
		vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
			callback(new Blob([new Uint8Array(5 * 1024 * 1024)], { type: 'image/webp' }))
		})
		post.mockResolvedValue({ id: '123', url: '/files/123' })
		await expect(uploadImage(new File(['x'], 'image.png', { type: 'image/png' }))).resolves.toBe('/files/123')
		const uploaded = (post.mock.calls[0][1] as FormData).get('file')
		expect(uploaded).toBeInstanceOf(File)
		if (!(uploaded instanceof File)) throw new Error('Expected uploaded file')
		expect(uploaded.size).toBe(5 * 1024 * 1024)
	})

	it('rejects an invalid upload response', async () => {
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D)
		vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
			callback(new Blob(['image'], { type: 'image/webp' }))
		})
		post.mockResolvedValue({ id: '123', url: 'https://invalid.example.test/image' })
		await expect(uploadImage(new File(['x'], 'image.png', { type: 'image/png' }))).rejects.toThrow('Invalid image upload response')
	})
})
