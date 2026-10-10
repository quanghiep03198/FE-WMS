import { stringify } from 'qs'

type TAvatarGenOptions = {
	name: string
	background?: string
	color?: string
	length?: number
	bold?: boolean
	format?: 'svg' | 'png'
}

export default function generateAvatar({ name }: TAvatarGenOptions) {
	const BASE_AVATAR_URL = 'https://api.dicebear.com'
	const avatarURL = new URL(`/10.x/glass/svg`, BASE_AVATAR_URL)

	avatarURL.search = stringify({ seed: name })

	return avatarURL.toString()
}
