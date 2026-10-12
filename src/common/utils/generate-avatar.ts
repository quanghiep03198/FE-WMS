import { stringify } from 'qs'

type TAvatarGenOptions = {
	name: string
	format?: 'svg' | 'png'
	variant?: 'initial' | 'glass'
}

export default function generateAvatar({ name, variant = 'glass' }: TAvatarGenOptions) {
	const BASE_AVATAR_URL = 'https://api.dicebear.com'
	const avatarURL = new URL(`/10.x/${variant}/svg`, BASE_AVATAR_URL)

	avatarURL.search = stringify({ seed: name })

	return avatarURL.toString()
}
