import { stringify } from 'qs'

type TAvatarGenOptions = {
	name: string
	background?: string
	color?: string
	length?: number
	bold?: boolean
	format?: 'svg' | 'png'
}

export const generateAvatar = ({
	background = '#525252',
	color = '#fafafa',
	length = 1,
	bold = true,
	format = 'svg',
	name
}: TAvatarGenOptions) => {
	const BASE_AVATAR_URL = 'https://ui-avatars.com/api/'
	return (
		BASE_AVATAR_URL +
		stringify(
			{
				background,
				color,
				length,
				bold,
				format,
				name
			},
			{ addQueryPrefix: true }
		)
	)
}
