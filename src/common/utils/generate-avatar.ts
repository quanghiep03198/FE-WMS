type TAvatarGenOptions = {
	name: string
	format?: 'svg' | 'png'
	variant?: 'initials' | 'glass' | 'landscape'
	animation?: boolean
}

export default function generateAvatar({ name, variant = 'initials' }: TAvatarGenOptions) {
	const BASE_AVATAR_URL = 'https://api.dicebear.com'
	const avatarURL = new URL(`/10.x/${variant}/svg`, BASE_AVATAR_URL)

	const backgroundColors = ['6b705c', 'a5a58d', 'b98b73', '7c9082', '8e9aaf', '9c6b58']
	const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)]

	avatarURL.searchParams.set('seed', name)
	avatarURL.searchParams.set('backgroundColor', randomColor)

	return avatarURL.toString()
}
