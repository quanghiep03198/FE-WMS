type TAvatarGenOptions = {
	name: string
	format?: 'svg' | 'png'
	variant?: 'initials' | 'glass' | 'landscape' | 'planets'
	animation?: boolean
}

export default function generateAvatar({ name, variant = 'planets' }: TAvatarGenOptions) {
	const BASE_AVATAR_URL = 'https://api.dicebear.com'
	const avatarURL = new URL(`/10.x/${variant}/svg`, BASE_AVATAR_URL)

	avatarURL.searchParams.set('seed', name)
	avatarURL.searchParams.set('backgroundColor', '262626')
	avatarURL.searchParams.set('backgroundColorFill', 'linear')
	avatarURL.searchParams.set('textColor', 'e5e5e5')
	avatarURL.searchParams.set('lettersVariant', 'single')

	return avatarURL.toString()
}
