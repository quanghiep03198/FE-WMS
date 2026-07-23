import { Div, Separator, Typography } from '@components/ui'
import React from 'react'

const AppLogo: React.FC = () => {
	return (
		<Div className='font-jetbrains flex items-center gap-x-3 group-data-[state=expanded]:gap-x-3 xl:gap-x-0'>
			<Div className='bg-primary font-jetbrains text-primary-foreground flex aspect-square flex-col items-center justify-center gap-y-2 rounded p-2 text-center text-sm leading-none font-medium group-data-[state=collapsed]:size-8 group-data-[state=collapsed]:gap-y-1.5 group-data-[state=collapsed]:p-0.75 group-data-[state=collapsed]:text-[10px] group-data-[state=collapsed]:tracking-widest group-data-[state=expanded]:size-12'>
				WMS
				<Separator className='h-0.5 w-full group-data-[state=expanded]:h-0.75' />
			</Div>
			<Div className='transition-all duration-200 group-data-[state=collapsed]:scale-75 group-data-[state=expanded]:w-auto group-data-[state=expanded]:scale-100 group-data-[state=expanded]:opacity-100 xl:w-0 xl:opacity-0'>
				<Typography className='font-jetbrains animate-[shimmer_3s_linear_infinite_both] bg-[linear-gradient(75deg,var(--foreground),45%,var(--muted-foreground),50%,var(--foreground))] bg-size-[200%_100%] bg-clip-text text-xs leading-normal font-semibold tracking-widest text-transparent dark:bg-[linear-gradient(75deg,var(--muted-foreground),45%,var(--foreground),50%,var(--muted-foreground))]'>
					WAREHOUSE
					<br />
					MANAGEMENT
					<br />
					SYSTEM
				</Typography>
			</Div>
		</Div>
	)
}

export default AppLogo
