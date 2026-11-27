import type { LucideProps } from 'lucide-react'
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	CircleAlert,
	ClockAlert,
	FoldHorizontal,
	History,
	SmilePlus,
	SquareArrowOutUpRight,
	Trash2,
	TriangleAlert,
	UnfoldHorizontal,
	icons
} from 'lucide-react'

// Lucide v1 keeps these aliases as named exports, but excludes them from `icons`.
const iconComponents = {
	...icons,
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	CircleAlert,
	ClockAlert,
	FoldHorizontal,
	History,
	SmilePlus,
	SquareArrowOutUpRight,
	Trash2,
	TriangleAlert,
	UnfoldHorizontal
}

export type IconProps = {
	name: keyof typeof iconComponents
	color?: string
	size?: number
	ref?: React.RefAttributes<SVGSVGElement>
} & React.HTMLAttributes<HTMLOrSVGElement> &
	LucideProps

export const Icon: React.FC<IconProps> = ({ name, color, size = 16, ...props }) => {
	const LucideIcon = iconComponents[name]

	return <LucideIcon color={color} size={size} {...props} />
}
