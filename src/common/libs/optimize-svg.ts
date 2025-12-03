/**
 * SVG Optimization Utilities
 * Giảm kích thước SVG base64 bằng cách optimize và minify
 */

type OptimizeSvgOptions = {
	/** Remove unnecessary attributes (default: true) */
	removeUnusedAttrs?: boolean
	/** Remove comments (default: true) */
	removeComments?: boolean
	/** Remove XML declaration (default: true) */
	removeXMLDeclaration?: boolean
	/** Minify path data (default: true) */
	minifyPathData?: boolean
	/** Round decimal numbers (default: 2) */
	decimalPrecision?: number
	/** Remove default values (default: true) */
	removeDefaults?: boolean
}

/**
 * Optimize SVG element to reduce size
 * @param svgElement - SVG element to optimize
 * @param options - Optimization options
 * @returns Optimized SVG string
 */
export function optimizeSvg(svgElement: SVGSVGElement | null | undefined, options?: OptimizeSvgOptions): string {
	const {
		removeUnusedAttrs = true,
		removeComments = true,
		removeXMLDeclaration = true,
		minifyPathData = true,
		decimalPrecision = 2,
		removeDefaults = true
	} = options ?? {}

	if (!svgElement) {
		throw new Error('SVG element is required')
	}

	// Clone to avoid modifying original
	const svgClone = svgElement.cloneNode(true) as SVGSVGElement

	// Remove unnecessary attributes
	if (removeUnusedAttrs) {
		svgClone.removeAttribute('style')
		svgClone.removeAttribute('class')
		svgClone.removeAttribute('data-testid')
	}

	// Remove default values
	if (removeDefaults) {
		// Remove default fill="black"
		const allElements = svgClone.querySelectorAll('*')
		allElements.forEach((el) => {
			if (el.getAttribute('fill') === 'black') {
				el.removeAttribute('fill')
			}
			if (el.getAttribute('stroke') === 'none') {
				el.removeAttribute('stroke')
			}
		})
	}

	// Minify path data
	if (minifyPathData) {
		const paths = svgClone.querySelectorAll('path')
		paths.forEach((path) => {
			const d = path.getAttribute('d')
			if (d) {
				// Round numbers to reduce precision
				const minified = d.replace(/(\d+\.\d+)/g, (match) => {
					return parseFloat(match).toFixed(decimalPrecision)
				})
				path.setAttribute('d', minified)
			}
		})
	}

	// Serialize to string
	let svgString = new XMLSerializer().serializeToString(svgClone)

	// Remove XML declaration
	if (removeXMLDeclaration) {
		svgString = svgString.replace(/<\?xml[^>]*\?>/g, '')
	}

	// Remove comments
	if (removeComments) {
		svgString = svgString.replace(/<!--[\s\S]*?-->/g, '')
	}

	// Remove extra whitespace
	svgString = svgString
		.replace(/\s+/g, ' ') // Multiple spaces to single
		.replace(/>\s+</g, '><') // Spaces between tags
		.trim()

	return svgString
}

/**
 * Convert optimized SVG to base64
 * @param svgElement - SVG element
 * @param options - Optimization options
 * @returns Base64 encoded SVG
 */
export function svgToOptimizedBase64(
	svgElement: SVGSVGElement | null | undefined,
	options?: OptimizeSvgOptions
): string {
	const optimizedSvg = optimizeSvg(svgElement, options)

	// Use btoa for base64 encoding
	const base64 = btoa(unescape(encodeURIComponent(optimizedSvg)))

	return `data:image/svg+xml;base64,${base64}`
}

/**
 * Convert SVG to compressed base64 using URL encoding (smaller than base64)
 * @param svgElement - SVG element
 * @param options - Optimization options
 * @returns URL-encoded SVG (smaller than base64)
 */
export function svgToDataUrl(svgElement: SVGSVGElement | null | undefined, options?: OptimizeSvgOptions): string {
	const optimizedSvg = optimizeSvg(svgElement, options)

	// URL encode instead of base64 (usually 30% smaller)
	const encoded = encodeURIComponent(optimizedSvg).replace(/'/g, '%27').replace(/"/g, '%22')

	return `data:image/svg+xml,${encoded}`
}

/**
 * Get SVG size comparison
 * @param svgElement - SVG element
 * @returns Size comparison object
 */
export function getSvgSizeComparison(svgElement: SVGSVGElement | null | undefined) {
	if (!svgElement) {
		throw new Error('SVG element is required')
	}

	const original = new XMLSerializer().serializeToString(svgElement)
	const optimized = optimizeSvg(svgElement)
	const base64 = svgToOptimizedBase64(svgElement)
	const dataUrl = svgToDataUrl(svgElement)

	const getSize = (str: string) => new Blob([str]).size

	return {
		original: {
			size: getSize(original),
			sizeKB: (getSize(original) / 1024).toFixed(2)
		},
		optimized: {
			size: getSize(optimized),
			sizeKB: (getSize(optimized) / 1024).toFixed(2),
			reduction: ((1 - getSize(optimized) / getSize(original)) * 100).toFixed(1) + '%'
		},
		base64: {
			size: getSize(base64),
			sizeKB: (getSize(base64) / 1024).toFixed(2),
			reduction: ((1 - getSize(base64) / getSize(original)) * 100).toFixed(1) + '%'
		},
		dataUrl: {
			size: getSize(dataUrl),
			sizeKB: (getSize(dataUrl) / 1024).toFixed(2),
			reduction: ((1 - getSize(dataUrl) / getSize(original)) * 100).toFixed(1) + '%'
		}
	}
}

/**
 * Compress SVG using SVGO-like optimizations (manual implementation)
 * @param svgString - SVG string to compress
 * @returns Compressed SVG string
 */
export function compressSvgString(svgString: string): string {
	return (
		svgString
			// Remove XML declaration
			.replace(/<\?xml[^>]*\?>/g, '')
			// Remove comments
			.replace(/<!--[\s\S]*?-->/g, '')
			// Remove DOCTYPE
			.replace(/<!DOCTYPE[^>]*>/g, '')
			// Remove metadata
			.replace(/<metadata[\s\S]*?<\/metadata>/g, '')
			// Remove title
			.replace(/<title[\s\S]*?<\/title>/g, '')
			// Remove desc
			.replace(/<desc[\s\S]*?<\/desc>/g, '')
			// Minify whitespace
			.replace(/\s+/g, ' ')
			.replace(/>\s+</g, '><')
			.trim()
	)
}
