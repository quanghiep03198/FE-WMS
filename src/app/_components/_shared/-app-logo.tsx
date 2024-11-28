import { Div, Separator, Typography } from '@/components/ui'
import React from 'react'

const AppLogo: React.FC = () => {
	return (
		<Div className='flex items-center gap-x-3 font-jetbrains group-data-[state=expanded]:gap-x-3 xl:gap-x-0'>
			<Div className='flex aspect-square size-16 flex-col items-center justify-around rounded bg-primary p-px text-center text-[10px] text-sm font-medium tracking-widest text-primary-foreground group-data-[state=collapsed]:size-8 group-data-[state=expanded]:size-14 group-data-[state=expanded]:p-2 group-data-[state=collapsed]:!text-[10px]'>
				WMS
				<Separator className='h-0.5 max-w-[80%]' />
			</Div>
			<Typography
				variant='code'
				className='duration-50 text-sm font-semibold tracking-widest transition-[width_opacity] group-data-[state=expanded]:w-auto group-data-[state=expanded]:opacity-100 xl:w-0 xl:opacity-0'>
				WAREHOUSE
				<br />
				MANAGEMENT
				<br />
				SYSTEM
			</Typography>
		</Div>
	)
}

export default AppLogo
