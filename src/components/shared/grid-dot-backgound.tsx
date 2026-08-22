import { cn } from '@common/utils/cn'
import React, { Fragment } from 'react'

const GridDotBackground: React.FC = () => {
	return (
		<Fragment>
			<div className='bg-background text-foreground pointer-events-none absolute inset-0 z-10 flex items-center justify-center mask-[radial-gradient(ellipse_at_center,transparent_5%,black)]'></div>
			<div
				className={cn(
					'absolute inset-0',
					'bg-size-[40px_40px]',
					'bg-[linear-gradient(to_right,var(--border)/50%)_1px,,linear-gradient(to_bottom,var(--border)/50%)_1px,]'
				)}
			/>
		</Fragment>
	)
}

export default GridDotBackground
