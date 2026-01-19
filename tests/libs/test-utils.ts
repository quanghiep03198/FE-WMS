/**
 * Test utilities for creating mock images and SVG elements
 */

/**
 * Create a test base64 image with gradient and shapes
 */
export function createTestImageBase64(width: number = 200, height: number = 200): string {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const ctx = canvas.getContext('2d')!

	// Gradient background
	const gradient = ctx.createLinearGradient(0, 0, width, height)
	gradient.addColorStop(0, '#4158D0')
	gradient.addColorStop(0.5, '#C850C0')
	gradient.addColorStop(1, '#FFCC70')
	ctx.fillStyle = gradient
	ctx.fillRect(0, 0, width, height)

	// Add some shapes for complexity
	ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
	for (let i = 0; i < 5; i++) {
		ctx.beginPath()
		ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 50 + 20, 0, Math.PI * 2)
		ctx.fill()
	}

	// Add text
	ctx.fillStyle = 'white'
	ctx.font = 'bold 24px Arial'
	ctx.textAlign = 'center'
	ctx.fillText('Test Image', width / 2, height / 2)

	return canvas.toDataURL('image/png')
}

/**
 * Create a simple 1x1 pixel test image
 */
export function createSimpleTestImage(color: string = 'red'): string {
	const canvas = document.createElement('canvas')
	canvas.width = 1
	canvas.height = 1
	const ctx = canvas.getContext('2d')!

	ctx.fillStyle = color
	ctx.fillRect(0, 0, 1, 1)

	return canvas.toDataURL('image/png')
}

/**
 * Create a photo-like test image with noise
 */
export function createPhotoTestImage(width: number = 800, height: number = 600): string {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const ctx = canvas.getContext('2d')!

	// Sky gradient
	const skyGradient = ctx.createLinearGradient(0, 0, 0, height / 2)
	skyGradient.addColorStop(0, '#87CEEB')
	skyGradient.addColorStop(1, '#E0F6FF')
	ctx.fillStyle = skyGradient
	ctx.fillRect(0, 0, width, height / 2)

	// Ground
	ctx.fillStyle = '#90EE90'
	ctx.fillRect(0, height / 2, width, height / 2)

	// Sun
	ctx.fillStyle = '#FFD700'
	ctx.beginPath()
	ctx.arc(width * 0.8, height * 0.2, 40, 0, Math.PI * 2)
	ctx.fill()

	// Add noise for complexity
	const imageData = ctx.getImageData(0, 0, width, height)
	for (let i = 0; i < imageData.data.length; i += 4) {
		const noise = Math.random() * 20 - 10
		imageData.data[i] += noise // R
		imageData.data[i + 1] += noise // G
		imageData.data[i + 2] += noise // B
	}
	ctx.putImageData(imageData, 0, 0)

	return canvas.toDataURL('image/png')
}

/**
 * Create a chart-like test image
 */
export function createChartTestImage(width: number = 800, height: number = 400): string {
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const ctx = canvas.getContext('2d')!

	// White background
	ctx.fillStyle = 'white'
	ctx.fillRect(0, 0, width, height)

	// Grid lines
	ctx.strokeStyle = '#e0e0e0'
	ctx.lineWidth = 1
	for (let i = 0; i < 10; i++) {
		const y = (height / 10) * i
		ctx.beginPath()
		ctx.moveTo(0, y)
		ctx.lineTo(width, y)
		ctx.stroke()
	}

	// Bar chart
	const barWidth = width / 8
	const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
	for (let i = 0; i < 5; i++) {
		const barHeight = Math.random() * height * 0.7
		ctx.fillStyle = colors[i]
		ctx.fillRect(barWidth * (i + 1), height - barHeight, barWidth * 0.8, barHeight)
	}

	// Title
	ctx.fillStyle = '#333'
	ctx.font = 'bold 20px Arial'
	ctx.fillText('Test Chart', 20, 30)

	return canvas.toDataURL('image/png')
}

/**
 * Create a mock SVG element
 */
export function createMockSvgElement(width: number = 200, height: number = 200): SVGSVGElement {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	svg.setAttribute('width', String(width))
	svg.setAttribute('height', String(height))
	svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

	// Add circle
	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
	circle.setAttribute('cx', String(width / 2))
	circle.setAttribute('cy', String(height / 2))
	circle.setAttribute('r', String(Math.min(width, height) / 4))
	circle.setAttribute('fill', '#4158D0')
	svg.appendChild(circle)

	// Add text
	const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
	text.setAttribute('x', String(width / 2))
	text.setAttribute('y', String(height / 2))
	text.setAttribute('text-anchor', 'middle')
	text.setAttribute('dominant-baseline', 'middle')
	text.setAttribute('fill', 'white')
	text.setAttribute('font-size', '16')
	text.textContent = 'Test'
	svg.appendChild(text)

	return svg
}

/**
 * Create a complex SVG with multiple elements
 */
export function createComplexSvgElement(): SVGSVGElement {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
	svg.setAttribute('width', '400')
	svg.setAttribute('height', '300')
	svg.setAttribute('viewBox', '0 0 400 300')

	// Background
	const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
	rect.setAttribute('x', '0')
	rect.setAttribute('y', '0')
	rect.setAttribute('width', '400')
	rect.setAttribute('height', '300')
	rect.setAttribute('fill', '#f0f0f0')
	svg.appendChild(rect)

	// Shapes
	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
	circle.setAttribute('cx', '100')
	circle.setAttribute('cy', '100')
	circle.setAttribute('r', '50')
	circle.setAttribute('fill', 'red')
	svg.appendChild(circle)

	const rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
	rect2.setAttribute('x', '200')
	rect2.setAttribute('y', '50')
	rect2.setAttribute('width', '100')
	rect2.setAttribute('height', '100')
	rect2.setAttribute('fill', 'blue')
	svg.appendChild(rect2)

	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
	path.setAttribute('d', 'M 50 200 L 150 250 L 50 300 Z')
	path.setAttribute('fill', 'green')
	svg.appendChild(path)

	// Text
	const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
	text.setAttribute('x', '200')
	text.setAttribute('y', '250')
	text.setAttribute('font-size', '24')
	text.setAttribute('fill', 'black')
	text.textContent = 'Complex SVG'
	svg.appendChild(text)

	return svg
}

/**
 * Calculate approximate size of base64 string in KB
 */
export function getBase64SizeKB(base64: string): number {
	return (base64.length * 0.75) / 1024
}

/**
 * Compare two base64 images and return size difference
 */
export function compareSizes(
	base64_1: string,
	base64_2: string
): {
	size1: number
	size2: number
	difference: number
	percentageChange: number
} {
	const size1 = getBase64SizeKB(base64_1)
	const size2 = getBase64SizeKB(base64_2)
	const difference = size1 - size2
	const percentageChange = (difference / size1) * 100

	return {
		size1: Number(size1.toFixed(2)),
		size2: Number(size2.toFixed(2)),
		difference: Number(difference.toFixed(2)),
		percentageChange: Number(percentageChange.toFixed(2))
	}
}

/**
 * Verify base64 string is valid image data URL
 */
export function isValidImageBase64(base64: string): boolean {
	return /^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(base64)
}

/**
 * Extract image format from base64 string
 */
export function getImageFormat(base64: string): string | null {
	const match = base64.match(/^data:image\/(\w+);base64,/)
	return match ? match[1] : null
}

/**
 * Create a mock Image element for testing
 */
export function createMockImage(width: number = 100, height: number = 100): HTMLImageElement {
	const img = new Image()
	img.width = width
	img.height = height

	// Mock canvas for testing
	const canvas = document.createElement('canvas')
	canvas.width = width
	canvas.height = height
	const ctx = canvas.getContext('2d')!
	ctx.fillStyle = '#4158D0'
	ctx.fillRect(0, 0, width, height)

	img.src = canvas.toDataURL('image/png')
	return img
}

/**
 * Wait for a specified time (useful for async tests)
 */
export function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Create a test scenario object for compression tests
 */
export interface CompressionTestScenario {
	name: string
	input: string
	options: any
	expectedFormat?: string
	expectedMaxSize?: number
}

export function createCompressionTestScenarios(): CompressionTestScenario[] {
	return [
		{
			name: 'Default compression (WebP)',
			input: createSimpleTestImage(),
			options: { max: 200 },
			expectedFormat: 'webp',
			expectedMaxSize: 210
		},
		{
			name: 'PNG compression',
			input: createSimpleTestImage(),
			options: { type: 'image/png', max: 200 },
			expectedFormat: 'png',
			expectedMaxSize: 210
		},
		{
			name: 'High quality WebP',
			input: createSimpleTestImage(),
			options: { quality: 0.95, max: 300 },
			expectedFormat: 'webp',
			expectedMaxSize: 310
		},
		{
			name: 'Aggressive compression',
			input: createSimpleTestImage(),
			options: { quality: 0.5, max: 50 },
			expectedFormat: 'webp',
			expectedMaxSize: 55
		},
		{
			name: 'Thumbnail with dimensions',
			input: createSimpleTestImage(),
			options: { width: 150, height: 150, max: 30 },
			expectedFormat: 'webp',
			expectedMaxSize: 35
		}
	]
}
