export function extractClipboardImages(html: string): { html: string; files: File[] } | null {
	const document = new DOMParser().parseFromString(html, 'text/html')
	const images = Array.from(document.querySelectorAll('img[src]')).filter((image) =>
		/^data:/i.test(image.getAttribute('src') ?? '')
	)
	if (!images.length) return null

	const files = images.map((image) => {
		const match = /^data:([^;,]+);base64,(.*)$/is.exec(image.getAttribute('src') ?? '')
		if (!match) throw new Error('Invalid pasted image data')
		const binary = atob(match[2])
		const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
		image.remove()
		return new File([bytes], 'clipboard-image', { type: match[1] })
	})
	return { html: document.body.innerHTML, files }
}
