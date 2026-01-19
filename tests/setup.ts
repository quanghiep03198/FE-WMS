import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

if (!window.matchMedia) {
	window.matchMedia = (query: string) => {
		return {
			matches: false,
			media: query,
			onchange: null,
			addListener: () => undefined,
			removeListener: () => undefined,
			addEventListener: () => undefined,
			removeEventListener: () => undefined,
			dispatchEvent: () => false
		}
	}
}

// Mock browser APIs for image compression tests
if (!globalThis.createImageBitmap) {
	globalThis.createImageBitmap = async (blob: Blob): Promise<ImageBitmap> => {
		return {
			width: 800,
			height: 600,
			close: () => undefined
		} as ImageBitmap
	}
}

if (!globalThis.OffscreenCanvas) {
	globalThis.OffscreenCanvas = class OffscreenCanvas {
		width: number
		height: number
		_type: string = 'image/webp' // Track desired type

		constructor(width: number, height: number) {
			this.width = width
			this.height = height
		}

		getContext() {
			return {
				drawImage: () => undefined,
				clearRect: () => undefined,
				fillRect: () => undefined
			}
		}

		convertToBlob(options?: { type?: string; quality?: number }): Promise<Blob> {
			this._type = options?.type || 'image/webp'

			// Generate different mock data based on type
			let mockData: string
			if (this._type === 'image/png') {
				mockData =
					'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
			} else if (this._type === 'image/jpeg') {
				mockData = '/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ=='
			} else {
				// WebP
				mockData = 'UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
			}

			const binaryString = atob(mockData)
			const bytes = new Uint8Array(binaryString.length)
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i)
			}
			return Promise.resolve(new Blob([bytes], { type: this._type }))
		}
	} as any
}

// Mock URL.createObjectURL and revokeObjectURL
if (!globalThis.URL.createObjectURL) {
	globalThis.URL.createObjectURL = (blob: Blob): string => {
		return 'blob:mock-url'
	}
}

if (!globalThis.URL.revokeObjectURL) {
	globalThis.URL.revokeObjectURL = (url: string): void => {
		// Mock implementation
	}
}

// Mock HTMLImageElement for canvas tests
class MockImage {
	src = ''
	width = 800
	height = 600
	onload: (() => void) | null = null
	onerror: (() => void) | null = null

	constructor() {
		// Auto-trigger onload after microtask
		Promise.resolve().then(() => {
			if (this.onload) {
				this.onload()
			}
		})
	}
}

if (typeof globalThis.Image === 'undefined') {
	globalThis.Image = MockImage as any
}

afterEach(() => {
	cleanup()
})
