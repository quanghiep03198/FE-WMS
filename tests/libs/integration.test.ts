import { beforeEach, describe, expect, it } from 'vitest'
import compressBase64 from '../../src/common/libs/compress-base64'
import { convertSvgStringToWebp, convertSvgToWebp } from '../../src/common/libs/convert-webp'
import {
	compareSizes,
	createChartTestImage,
	createComplexSvgElement,
	createMockSvgElement,
	createPhotoTestImage,
	createTestImageBase64,
	getBase64SizeKB,
	getImageFormat,
	isValidImageBase64
} from './test-utils'

// SKIP: Integration tests require real browser environment for SVG → WebP conversion
// TODO: Move to E2E tests with Playwright or test compress-base64 separately
describe.skip('Integration: SVG → WebP → Compression', () => {
	let mockSvg: SVGSVGElement

	beforeEach(() => {
		mockSvg = createMockSvgElement(400, 300)
	})

	describe('Complete workflow', () => {
		it('should convert SVG to WebP and then compress', async () => {
			// Step 1: Convert SVG to WebP
			const webpBase64 = await convertSvgToWebp(mockSvg, {
				width: 800,
				height: 600,
				quality: 1.0
			})

			expect(isValidImageBase64(webpBase64)).toBe(true)
			expect(getImageFormat(webpBase64)).toBe('webp')

			// Step 2: Compress the WebP
			const compressed = await compressBase64(webpBase64, {
				max: 150,
				quality: 0.85
			})

			expect(isValidImageBase64(compressed)).toBe(true)
			expect(getImageFormat(compressed)).toBe('webp')

			// Verify compression
			const originalSize = getBase64SizeKB(webpBase64)
			const compressedSize = getBase64SizeKB(compressed)
			expect(compressedSize).toBeLessThan(originalSize)
			expect(compressedSize).toBeLessThanOrEqual(155)
		})

		it('should handle complex SVG with multiple elements', async () => {
			const complexSvg = createComplexSvgElement()

			// Convert to WebP
			const webp = await convertSvgToWebp(complexSvg, {
				width: 600,
				height: 400,
				backgroundColor: 'white'
			})

			// Compress
			const compressed = await compressBase64(webp, {
				max: 200,
				quality: 0.8
			})

			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(210)
		})

		it('should preserve quality in high-quality mode', async () => {
			const webp = await convertSvgToWebp(mockSvg, {
				quality: 0.95
			})

			const compressed = await compressBase64(webp, {
				quality: 0.95,
				max: 500
			})

			expect(isValidImageBase64(compressed)).toBe(true)
			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(510)
		})

		it('should handle aggressive compression chain', async () => {
			// Start with SVG
			const webp = await convertSvgToWebp(mockSvg, {
				width: 200,
				height: 150
			})

			// Aggressive compression
			const compressed = await compressBase64(webp, {
				width: 100,
				height: 75,
				quality: 0.6,
				max: 30
			})

			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(35)
		})
	})

	describe('Format comparison', () => {
		it('should compare PNG vs WebP compression', async () => {
			const testImage = createTestImageBase64(400, 300)

			// Compress as PNG
			const pngCompressed = await compressBase64(testImage, {
				type: 'image/png',
				max: 200
			})

			// Compress as WebP
			const webpCompressed = await compressBase64(testImage, {
				type: 'image/webp',
				max: 200
			})

			const comparison = compareSizes(pngCompressed, webpCompressed)

			// WebP should be smaller (negative difference)
			expect(comparison.size2).toBeLessThan(comparison.size1)
			expect(comparison.percentageChange).toBeGreaterThan(0)
		})

		it('should verify WebP is default format', async () => {
			const webp = await convertSvgToWebp(mockSvg)
			const compressed = await compressBase64(webp)

			expect(getImageFormat(compressed)).toBe('webp')
		})
	})

	describe('Real-world scenarios', () => {
		it('should handle chart export workflow', async () => {
			// Simulate chart as SVG
			const chartSvg = createComplexSvgElement()

			// Convert chart to WebP (high quality)
			const chartWebp = await convertSvgToWebp(chartSvg, {
				width: 1600,
				height: 900,
				backgroundColor: 'white',
				quality: 0.95
			})

			// Compress for web display
			const compressed = await compressBase64(chartWebp, {
				max: 250,
				quality: 0.9
			})

			expect(isValidImageBase64(compressed)).toBe(true)
			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(260)
		})

		it('should handle icon generation workflow', async () => {
			const iconSvg = createMockSvgElement(64, 64)

			// Convert to WebP
			const webp = await convertSvgToWebp(iconSvg, {
				width: 64,
				height: 64,
				fillColor: '#000000'
			})

			// Compress to small size
			const compressed = await compressBase64(webp, {
				max: 10,
				quality: 0.8
			})

			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(12)
		})

		it('should handle thumbnail workflow', async () => {
			const svg = createComplexSvgElement()

			// Convert to WebP thumbnail
			const webp = await convertSvgToWebp(svg, {
				width: 200,
				height: 150
			})

			// Compress thumbnail
			const compressed = await compressBase64(webp, {
				max: 50,
				quality: 0.75
			})

			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(55)
		})

		it('should handle screenshot workflow', async () => {
			// Simulate screenshot
			const screenshot = createTestImageBase64(1920, 1080)

			// Compress for storage
			const compressed = await compressBase64(screenshot, {
				width: 1280,
				height: 720,
				max: 200,
				quality: 0.85
			})

			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(210)
		})

		it('should handle avatar workflow', async () => {
			const photo = createPhotoTestImage(800, 600)

			// Compress for avatar
			const compressed = await compressBase64(photo, {
				width: 200,
				height: 200,
				max: 100,
				quality: 0.85
			})

			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(105)
		})
	})

	describe('Performance scenarios', () => {
		it('should handle multiple conversions in sequence', async () => {
			const sizes = [100, 200, 400, 800]
			const results = []

			for (const size of sizes) {
				const svg = createMockSvgElement(size, size)
				const webp = await convertSvgToWebp(svg)
				const compressed = await compressBase64(webp, { max: 100 })
				results.push(compressed)
			}

			expect(results).toHaveLength(4)
			results.forEach((result) => {
				expect(isValidImageBase64(result)).toBe(true)
			})
		})

		it('should handle parallel conversions', async () => {
			const svgs = [createMockSvgElement(100, 100), createMockSvgElement(200, 200), createMockSvgElement(300, 300)]

			const conversions = svgs.map(async (svg) => {
				const webp = await convertSvgToWebp(svg)
				return compressBase64(webp, { max: 50 })
			})

			const results = await Promise.all(conversions)

			expect(results).toHaveLength(3)
			results.forEach((result) => {
				expect(isValidImageBase64(result)).toBe(true)
				expect(getBase64SizeKB(result)).toBeLessThanOrEqual(55)
			})
		})
	})

	describe('Size optimization scenarios', () => {
		it('should achieve target compression ratio', async () => {
			const testImage = createTestImageBase64(800, 600)
			const originalSize = getBase64SizeKB(testImage)

			// Compress with 50% target
			const compressed = await compressBase64(testImage, {
				max: originalSize * 0.5
			})

			const compressedSize = getBase64SizeKB(compressed)
			const compressionRatio = (compressedSize / originalSize) * 100

			expect(compressionRatio).toBeLessThanOrEqual(55) // Allow 5% tolerance
		})

		it('should handle extreme compression', async () => {
			const svg = createComplexSvgElement()
			const webp = await convertSvgToWebp(svg, { width: 400, height: 300 })

			// Extreme compression
			const compressed = await compressBase64(webp, {
				quality: 0.3,
				max: 20
			})

			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(25)
		})

		it('should maintain quality when size allows', async () => {
			const svg = createMockSvgElement(200, 200)
			const webp = await convertSvgToWebp(svg, { quality: 1.0 })

			// Generous size limit
			const compressed = await compressBase64(webp, {
				quality: 0.95,
				max: 1000
			})

			expect(isValidImageBase64(compressed)).toBe(true)
		})
	})

	describe('Edge cases integration', () => {
		it('should handle very small SVG → compress chain', async () => {
			const tinySvg = createMockSvgElement(10, 10)
			const webp = await convertSvgToWebp(tinySvg)
			const compressed = await compressBase64(webp, { max: 5 })

			expect(isValidImageBase64(compressed)).toBe(true)
		})

		it('should handle very large SVG → compress chain', async () => {
			const largeSvg = createMockSvgElement(2000, 2000)
			const webp = await convertSvgToWebp(largeSvg, {
				width: 1000,
				height: 1000
			})
			const compressed = await compressBase64(webp, { max: 300 })

			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(310)
		})

		it('should handle SVG with transparent background → compress', async () => {
			const svg = createMockSvgElement(300, 300)
			const webp = await convertSvgToWebp(svg, {
				backgroundColor: 'transparent'
			})
			const compressed = await compressBase64(webp, { max: 100 })

			expect(isValidImageBase64(compressed)).toBe(true)
		})

		it('should handle SVG with colored background → compress', async () => {
			const svg = createMockSvgElement(300, 300)
			const webp = await convertSvgToWebp(svg, {
				backgroundColor: '#f0f0f0'
			})
			const compressed = await compressBase64(webp, { max: 100 })

			expect(isValidImageBase64(compressed)).toBe(true)
		})
	})

	describe('SVG string workflow', () => {
		it('should convert SVG string → WebP → compress', async () => {
			const svgString = `
				<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
					<circle cx="100" cy="100" r="80" fill="blue"/>
					<text x="100" y="110" text-anchor="middle" fill="white">Test</text>
				</svg>
			`

			const webp = await convertSvgStringToWebp(svgString)
			const compressed = await compressBase64(webp, { max: 50 })

			expect(isValidImageBase64(compressed)).toBe(true)
			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(55)
		})

		it('should handle complex SVG string', async () => {
			const complexSvg = `
				<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
					<rect x="0" y="0" width="400" height="300" fill="#f0f0f0"/>
					<circle cx="100" cy="100" r="50" fill="red"/>
					<rect x="200" y="50" width="100" height="100" fill="blue"/>
					<path d="M 50 200 L 150 250 L 50 300 Z" fill="green"/>
					<text x="200" y="250" font-size="24" fill="black">Chart</text>
				</svg>
			`

			const webp = await convertSvgStringToWebp(complexSvg, {
				width: 800,
				height: 600
			})

			const compressed = await compressBase64(webp, {
				max: 200,
				quality: 0.85
			})

			expect(getBase64SizeKB(compressed)).toBeLessThanOrEqual(210)
		})
	})

	describe('Comparison tests', () => {
		it('should demonstrate compression improvement', async () => {
			const chart = createChartTestImage(1600, 900)

			// Old way: PNG with high quality
			const oldCompressed = await compressBase64(chart, {
				type: 'image/png',
				quality: 1.0,
				max: 300
			})

			// New way: WebP with optimized quality
			const newCompressed = await compressBase64(chart, {
				type: 'image/webp',
				quality: 0.85,
				max: 300
			})

			const comparison = compareSizes(oldCompressed, newCompressed)

			expect(comparison.percentageChange).toBeGreaterThan(15) // At least 15% improvement
		})

		it('should show size progression through pipeline', async () => {
			const svg = createComplexSvgElement()

			// Step 1: Convert to WebP (high quality)
			const webp1 = await convertSvgToWebp(svg, {
				width: 800,
				height: 600,
				quality: 1.0
			})
			const size1 = getBase64SizeKB(webp1)

			// Step 2: First compression
			const compressed1 = await compressBase64(webp1, {
				quality: 0.9,
				max: 300
			})
			const size2 = getBase64SizeKB(compressed1)

			// Step 3: Aggressive compression
			const compressed2 = await compressBase64(compressed1, {
				width: 400,
				height: 300,
				quality: 0.7,
				max: 100
			})
			const size3 = getBase64SizeKB(compressed2)

			expect(size2).toBeLessThan(size1)
			expect(size3).toBeLessThan(size2)
		})
	})
})
