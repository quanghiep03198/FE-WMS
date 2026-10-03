import { cn } from '@common/utils/cn'
import type { ClassNameValue } from 'tailwind-merge'

const GridBackground: React.FC<{ className?: ClassNameValue }> = ({ className }) => {
	return (
		<svg
			aria-hidden='true'
			className={cn(
				'stroke-border/50 fixed inset-0 z-0 h-full w-full mask-[radial-gradient(100%_100%_at_bottom_right,white,transparent)]',
				className
			)}>
			<defs>
				<pattern
					height={200}
					id='983e3e4c-de6d-4c3f-8d64-b9761d1534cc'
					patternUnits='userSpaceOnUse'
					width={200}
					x='50%'
					y={-1}>
					<path d='M.5 200V.5H200' fill='none' />
				</pattern>
			</defs>
			<svg className='fill-border/20 overflow-visible' x='50%' y={-1}>
				<path
					d='M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z'
					strokeWidth={0}
				/>
			</svg>
			<rect fill='url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)' height='100%' strokeWidth={0} width='100%' />
		</svg>
	)
}

export default GridBackground
