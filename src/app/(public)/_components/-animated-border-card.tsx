import { cn } from '@/common/utils/cn'
import { Div, DivProps } from '@/components/ui'

const AnimatedBorderCard: React.FC<DivProps> = ({ className, children, ...props }) => {
	return (
		<Div
			{...props}
			className={cn(
				'relative flex aspect-square items-center justify-center overflow-hidden rounded-md bg-border p-px before:absolute before:left-[-25%] before:top-[-25%] before:h-[150%] before:w-[150%] before:animate-border-spin before:bg-[conic-gradient(rgb(80,162,255,0.5)_0deg,rgba(43,127,255,0.5)_0deg,transparent_80deg)] before:content-[""]',
				className
			)}>
			<Div className='z-10 grid aspect-square h-full w-full flex-1 basis-full place-content-center rounded-[inherit] bg-popover'>
				{children}
			</Div>
		</Div>
	)
}

export default AnimatedBorderCard
