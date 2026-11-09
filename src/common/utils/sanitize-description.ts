import DOMPurify from 'dompurify'
import { resolveImageUrl } from './image-url'

export function sanitizeDescription(html: string) {
	const fragment = DOMPurify.sanitize(html, { RETURN_DOM_FRAGMENT: true })
	fragment.querySelectorAll('img').forEach((image) => {
		image.setAttribute('loading', 'lazy')
		image.setAttribute('decoding', 'async')
		const src = image.getAttribute('src')
		if (src) image.setAttribute('src', resolveImageUrl(src))
	})
	const container = document.createElement('div')
	container.append(fragment)
	return container.innerHTML
}
