import { LucideProps, icons } from 'lucide-react'

export type TIconProps = {
	name: keyof typeof icons
	color?: string
	size?: number
} & React.HTMLAttributes<HTMLOrSVGElement> &
	LucideProps

export const Icon: React.FC<TIconProps> = ({ name, color, size = 16, ...props }) => {
	const LucideIcon = icons[name]

	return <LucideIcon color={color} size={size} {...props} />
}