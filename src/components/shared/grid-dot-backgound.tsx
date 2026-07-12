import { cn } from '@common/utils/cn'
import React, { Fragment } from 'react'

const GridDotBackground: React.FC = () => {
	return (
		<Fragment>
			<div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background text-foreground [mask-image:radial-gradient(ellipse_at_center,transparent_5%,black)]'></div>
			<div
				className={cn(
					'absolute inset-0',
					'[background-size:40px_40px]',
					'[background-image:linear-gradient(to_right,hsl(var(--border)/50%)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/50%)_1px,transparent_1px)]'
				)}
			/>
		</Fragment>
	)
}

export default GridDotBackground
