type ConvertSvgToPngOptions = {
	/** Canvas width (default: auto-detect from SVG) */
	width?: number
	/** Canvas height (default: auto-detect from SVG) */
	height?: number
	/** Background color (default: transparent). Use 'transparent' or any CSS color like '#ffffff', 'rgba(255,255,255,0.5)' */
	backgroundColor?: string | 'transparent'
	/** PNG quality (0-1, default: 1.0 for lossless) */
	quality?: number
	/** Custom fill color for SVG elements (default: keep original) */
	fillColor?: string
}

/**
 * Convert SVG element to PNG base64
 * @param svgElement - SVG DOM element or HTMLElement containing SVG
 * @param options - Conversion options
 * @returns Promise<string> - PNG base64 data URL
 * @throws Error if SVG element is invalid or conversion fails
 *
 * @example
 * ```typescript
 * // Basic usage
 * const pngBase64 = await convertSvgToPng(svgRef.current)
 *
 * // With custom size and white background
 * const pngBase64 = await convertSvgToPng(svgRef.current, {
 *   width: 400,
 *   height: 200,
 *   backgroundColor: '#ffffff'
 * })
 *
 * // With transparent background (default)
 * const pngBase64 = await convertSvgToPng(svgRef.current, {
 *   backgroundColor: 'transparent'
 * })
 * ```
 */
export async function convertSvgToPng(
	svgElement: SVGSVGElement | HTMLElement | null | undefined,
	options?: ConvertSvgToPngOptions
): Promise<string> {
	const { width, height, backgroundColor = 'transparent', quality = 1.0, fillColor } = options ?? {}

	return new Promise((resolve, reject) => {
		// Validate SVG element
		if (!svgElement) {
			reject(new Error('SVG element is null or undefined'))
			return
		}

		// Get SVG element (handle both direct SVG or wrapper element)
		let svgElm: SVGSVGElement
		if (svgElement instanceof SVGSVGElement) {
			svgElm = svgElement.cloneNode(true) as SVGSVGElement
		} else if (svgElement instanceof HTMLElement) {
			const foundSvg = svgElement.querySelector('svg')
			if (!foundSvg) {
				reject(new Error('No SVG element found in the provided element'))
				return
			}
			svgElm = foundSvg.cloneNode(true) as SVGSVGElement
		} else {
			reject(new Error('Invalid element type. Expected SVGSVGElement or HTMLElement'))
			return
		}

		// Get dimensions
		const clientWidth = width ?? (svgElement.clientWidth || 400)
		const clientHeight = height ?? (svgElement.clientHeight || 200)

		// Prepare SVG attributes
		svgElm.removeAttribute('style')
		svgElm.setAttribute('width', `${clientWidth}px`)
		svgElm.setAttribute('height', `${clientHeight}px`)
		svgElm.setAttribute('viewBox', `0 0 ${clientWidth} ${clientHeight}`)

		// Apply custom fill color if specified
		if (fillColor) {
			svgElm.setAttribute('fill', fillColor)
		}

		// Serialize SVG to XML
		const xmlStringData = new XMLSerializer().serializeToString(svgElm)
		const svgBlob = new Blob([xmlStringData], { type: 'image/svg+xml;charset=utf-8' })
		const url = URL.createObjectURL(svgBlob)

		// Create image from SVG
		const img = new Image()

		img.onload = () => {
			try {
				// Create canvas
				const canvas = document.createElement('canvas')
				canvas.width = clientWidth
				canvas.height = clientHeight

				const ctx = canvas.getContext('2d')
				if (!ctx) {
					reject(new Error('Canvas 2D context not available'))
					URL.revokeObjectURL(url)
					return
				}

				// Apply background color if not transparent
				if (backgroundColor && backgroundColor !== 'transparent') {
					ctx.fillStyle = backgroundColor
					ctx.fillRect(0, 0, canvas.width, canvas.height)
				}

				// Draw SVG image onto canvas
				ctx.drawImage(img, 0, 0)

				// Convert canvas to PNG base64
				const pngBase64 = canvas.toDataURL('image/png', quality)

				// Cleanup
				URL.revokeObjectURL(url)

				resolve(pngBase64)
			} catch (error) {
				URL.revokeObjectURL(url)
				reject(new Error(`Failed to convert SVG to PNG: ${error instanceof Error ? error.message : String(error)}`))
			}
		}

		img.onerror = () => {
			URL.revokeObjectURL(url)
			reject(new Error('Failed to load SVG image'))
		}

		img.src = url
	})
}

/**
 * Convert SVG string to PNG base64
 * @param svgString - SVG XML string
 * @param options - Conversion options
 * @returns Promise<string> - PNG base64 data URL
 *
 * @example
 * ```typescript
 * const svgString = '<svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="red"/></svg>'
 * const pngBase64 = await convertSvgStringToPng(svgString, { backgroundColor: 'white' })
 * ```
 */
export async function convertSvgStringToPng(svgString: string, options?: ConvertSvgToPngOptions): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			// Parse SVG string to DOM
			const parser = new DOMParser()
			const doc = parser.parseFromString(svgString, 'image/svg+xml')
			const svgElement = doc.querySelector('svg')

			if (!svgElement) {
				reject(new Error('Invalid SVG string: No SVG element found'))
				return
			}

			// Use main convert function
			convertSvgToPng(svgElement, options).then(resolve).catch(reject)
		} catch (error) {
			reject(new Error(`Failed to parse SVG string: ${error instanceof Error ? error.message : String(error)}`))
		}
	})
}

/**
 * Download PNG from SVG element
 * @param svgElement - SVG element to convert
 * @param filename - Download filename (default: 'image.png')
 * @param options - Conversion options
 *
 * @example
 * ```typescript
 * await downloadPngFromSvg(svgRef.current, 'signature.png', {
 *   backgroundColor: 'white'
 * })
 * ```
 */
export async function downloadPngFromSvg(
	svgElement: SVGSVGElement | HTMLElement | null | undefined,
	filename: string = 'image.png',
	options?: ConvertSvgToPngOptions
): Promise<void> {
	try {
		const pngBase64 = await convertSvgToPng(svgElement, options)

		// Create download link
		const link = document.createElement('a')
		link.href = pngBase64
		link.download = filename
		link.click()
	} catch (error) {
		throw new Error(`Failed to download PNG: ${error instanceof Error ? error.message : String(error)}`)
	}
}
