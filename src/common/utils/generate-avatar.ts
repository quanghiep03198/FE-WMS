type TAvatarGenOptions = {
	name: string
	format?: 'svg' | 'png'
	variant?: 'initial' | 'glass' | 'voxel-bot'
	animation?: boolean
}

export default function generateAvatar({ name, variant = 'voxel-bot', animation = true }: TAvatarGenOptions) {
	const BASE_AVATAR_URL = 'https://api.dicebear.com'
	const avatarURL = new URL(`/10.x/${variant}/svg`, BASE_AVATAR_URL)

	avatarURL.searchParams.set('seed', name)
	avatarURL.searchParams.set('backgroundColor', 'e4e4e7')

	if (animation) avatarURL.searchParams.set('tags', 'animation')

	return avatarURL.toString()
}

console.log(generateAvatar({ name: 'John Doe' }))
