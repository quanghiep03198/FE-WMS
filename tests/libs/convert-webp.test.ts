import { beforeEach, describe, expect, it, vi } from 'vitest'
import { convertSvgStringToWebp, convertSvgToWebp, downloadWebpFromSvg } from '../../src/common/libs/convert-webp'

// SKIP: These tests require real browser environment (Image loading, SVG serialization)
// TODO: Move to E2E tests with Playwright or Puppeteer
describe.skip('convert-webp', () => {
	let mockSvgElement: SVGSVGElement

	beforeEach(() => {
		// Create mock SVG element
		mockSvgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
		mockSvgElement.setAttribute('width', '200')
		mockSvgElement.setAttribute('height', '200')
		mockSvgElement.setAttribute('viewBox', '0 0 200 200')

		// Add a circle to SVG
		const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
		circle.setAttribute('cx', '100')
		circle.setAttribute('cy', '100')
		circle.setAttribute('r', '50')
		circle.setAttribute('fill', 'red')
		mockSvgElement.appendChild(circle)

		// Mock canvas and context - CREATE MOCK OBJECT DIRECTLY (no circular reference)
		const mockContext = {
			fillStyle: '',
			fillRect: vi.fn(),
			drawImage: vi.fn()
		}

		const mockCanvas = {
			width: 200,
			height: 200,
			getContext: vi.fn().mockReturnValue(mockContext),
			toDataURL: vi.fn().mockReturnValue('data:image/webp;base64,mockWebpData')
		}

		const originalCreateElement = document.createElement.bind(document)
		vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
			if (tagName === 'canvas') {
				return mockCanvas as any
			}
			return originalCreateElement(tagName)
		})

		// Mock URL.createObjectURL and revokeObjectURL
		global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
		global.URL.revokeObjectURL = vi.fn()
	})

	describe('convertSvgToWebp', () => {
		it('should convert SVG element to WebP base64', async () => {
			const result = await convertSvgToWebp(mockSvgElement)

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
			expect(result).toContain('base64')
		})

		it('should throw error for null element', async () => {
			await expect(convertSvgToWebp(null)).rejects.toThrow('SVG element is null or undefined')
		})

		it('should throw error for undefined element', async () => {
			await expect(convertSvgToWebp(undefined)).rejects.toThrow('SVG element is null or undefined')
		})

		it('should handle HTMLElement containing SVG', async () => {
			const wrapper = document.createElement('div')
			wrapper.appendChild(mockSvgElement)

			const result = await convertSvgToWebp(wrapper)

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should throw error for HTMLElement without SVG', async () => {
			const wrapper = document.createElement('div')

			await expect(convertSvgToWebp(wrapper)).rejects.toThrow('No SVG element found in the provided element')
		})

		it('should use custom width', async () => {
			const result = await convertSvgToWebp(mockSvgElement, { width: 400 })

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should use custom height', async () => {
			const result = await convertSvgToWebp(mockSvgElement, { height: 300 })

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should use custom width and height', async () => {
			const result = await convertSvgToWebp(mockSvgElement, {
				width: 400,
				height: 300
			})

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should apply background color', async () => {
			const result = await convertSvgToWebp(mockSvgElement, {
				backgroundColor: '#ffffff'
			})

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should handle transparent background', async () => {
			const result = await convertSvgToWebp(mockSvgElement, {
				backgroundColor: 'transparent'
			})

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should use custom quality', async () => {
			const result = await convertSvgToWebp(mockSvgElement, {
				quality: 0.8
			})

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should apply fill color', async () => {
			const result = await convertSvgToWebp(mockSvgElement, {
				fillColor: '#000000'
			})

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should use default dimensions when element has no size', async () => {
			const svgWithoutSize = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

			const result = await convertSvgToWebp(svgWithoutSize)

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should handle all options together', async () => {
			const result = await convertSvgToWebp(mockSvgElement, {
				width: 800,
				height: 600,
				backgroundColor: 'white',
				quality: 0.9,
				fillColor: '#ff0000'
			})

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should throw error when canvas context is not available', async () => {
			const mockCanvas = {
				width: 200,
				height: 200,
				getContext: vi.fn().mockReturnValue(null)
			}

			const originalCreateElement = document.createElement.bind(document)
			vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
				if (tagName === 'canvas') {
					return mockCanvas as any
				}
				return originalCreateElement(tagName)
			})

			await expect(convertSvgToWebp(mockSvgElement)).rejects.toThrow('Canvas 2D context not available')
		})
	})

	describe('convertSvgStringToWebp', () => {
		const validSvgString = `
			<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
				<circle cx="50" cy="50" r="40" fill="blue"/>
			</svg>
		`

		it('should convert SVG string to WebP base64', async () => {
			const result = await convertSvgStringToWebp(validSvgString)

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should throw error for invalid SVG string', async () => {
			const invalidSvg = '<div>Not an SVG</div>'

			await expect(convertSvgStringToWebp(invalidSvg)).rejects.toThrow('Invalid SVG string: No SVG element found')
		})

		it('should throw error for empty string', async () => {
			await expect(convertSvgStringToWebp('')).rejects.toThrow('Invalid SVG string')
		})

		it('should apply options to SVG string conversion', async () => {
			const result = await convertSvgStringToWebp(validSvgString, {
				width: 200,
				height: 200,
				backgroundColor: 'white',
				quality: 0.8
			})

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should handle SVG with complex elements', async () => {
			const complexSvg = `
				<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
					<rect x="10" y="10" width="50" height="50" fill="red"/>
					<circle cx="100" cy="100" r="30" fill="blue"/>
					<path d="M 150 10 L 200 50 L 150 90 Z" fill="green"/>
					<text x="100" y="180" font-size="20" fill="black">Test</text>
				</svg>
			`

			const result = await convertSvgStringToWebp(complexSvg)

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})
	})

	describe('downloadWebpFromSvg', () => {
		let mockLink: HTMLAnchorElement

		beforeEach(() => {
			mockLink = {
				href: '',
				download: '',
				click: vi.fn()
			} as any

			vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
				if (tagName === 'a') {
					return mockLink
				}
				if (tagName === 'canvas') {
					const canvas = document.createElement('canvas')
					canvas.getContext = vi.fn().mockReturnValue({
						fillStyle: '',
						fillRect: vi.fn(),
						drawImage: vi.fn()
					})
					canvas.toDataURL = vi.fn().mockReturnValue('data:image/webp;base64,mockData')
					return canvas as any
				}
				return document.createElement(tagName)
			})
		})

		it('should download WebP with default filename', async () => {
			await downloadWebpFromSvg(mockSvgElement)

			expect(mockLink.download).toBe('image.webp')
			expect(mockLink.href).toContain('data:image/webp')
			expect(mockLink.click).toHaveBeenCalled()
		})

		it('should download WebP with custom filename', async () => {
			await downloadWebpFromSvg(mockSvgElement, 'my-chart.webp')

			expect(mockLink.download).toBe('my-chart.webp')
			expect(mockLink.click).toHaveBeenCalled()
		})

		it('should download WebP with options', async () => {
			await downloadWebpFromSvg(mockSvgElement, 'test.webp', {
				width: 800,
				height: 600,
				backgroundColor: 'white',
				quality: 0.9
			})

			expect(mockLink.download).toBe('test.webp')
			expect(mockLink.href).toContain('data:image/webp')
			expect(mockLink.click).toHaveBeenCalled()
		})

		it('should throw error for invalid element', async () => {
			await expect(downloadWebpFromSvg(null)).rejects.toThrow('Failed to download WEBP')
		})

		it('should throw error when conversion fails', async () => {
			vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
				if (tagName === 'canvas') {
					const canvas = document.createElement('canvas')
					canvas.getContext = vi.fn().mockReturnValue(null)
					return canvas as any
				}
				return document.createElement(tagName)
			})

			await expect(downloadWebpFromSvg(mockSvgElement)).rejects.toThrow('Failed to download WEBP')
		})
	})

	describe('Integration tests', () => {
		it('should handle complete workflow: SVG → WebP → Download', async () => {
			// Create SVG
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			svg.setAttribute('width', '300')
			svg.setAttribute('height', '300')

			const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
			rect.setAttribute('x', '50')
			rect.setAttribute('y', '50')
			rect.setAttribute('width', '200')
			rect.setAttribute('height', '200')
			rect.setAttribute('fill', 'purple')
			svg.appendChild(rect)

			// Convert to WebP
			const webpBase64 = await convertSvgToWebp(svg, {
				width: 600,
				height: 600,
				backgroundColor: 'white',
				quality: 0.9
			})

			expect(webpBase64).toContain('data:image/webp')

			// Download
			const mockLink = {
				href: '',
				download: '',
				click: vi.fn()
			} as any

			vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
				if (tagName === 'a') return mockLink
				return document.createElement(tagName)
			})

			await downloadWebpFromSvg(svg, 'test-integration.webp', {
				width: 600,
				height: 600,
				backgroundColor: 'white',
				quality: 0.9
			})

			expect(mockLink.click).toHaveBeenCalled()
		})

		it('should preserve SVG content during conversion', async () => {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			svg.innerHTML = `
				<circle cx="50" cy="50" r="40" fill="red"/>
				<rect x="100" y="10" width="80" height="80" fill="blue"/>
			`

			const result = await convertSvgToWebp(svg)

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should handle multiple sequential conversions', async () => {
			const results = []

			for (let i = 0; i < 5; i++) {
				const result = await convertSvgToWebp(mockSvgElement, {
					width: 100 + i * 50,
					quality: 0.7 + i * 0.05
				})
				results.push(result)
			}

			expect(results).toHaveLength(5)
			results.forEach((result) => {
				expect(result).toContain('data:image/webp')
			})
		})
	})

	describe('Edge cases', () => {
		it('should handle very small dimensions', async () => {
			const result = await convertSvgToWebp(mockSvgElement, {
				width: 1,
				height: 1
			})

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should handle very large dimensions', async () => {
			const result = await convertSvgToWebp(mockSvgElement, {
				width: 4000,
				height: 4000
			})

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should handle quality boundaries', async () => {
			const resultMin = await convertSvgToWebp(mockSvgElement, { quality: 0 })
			const resultMax = await convertSvgToWebp(mockSvgElement, { quality: 1 })

			expect(resultMin).toContain('data:image/webp')
			expect(resultMax).toContain('data:image/webp')
		})

		it('should handle SVG without viewBox', async () => {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			svg.setAttribute('width', '100')
			svg.setAttribute('height', '100')

			const result = await convertSvgToWebp(svg)

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})

		it('should handle empty SVG', async () => {
			const emptySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

			const result = await convertSvgToWebp(emptySvg)

			expect(result).toBeDefined()
			expect(result).toContain('data:image/webp')
		})
	})
})
