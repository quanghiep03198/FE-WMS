import { Div, Separator, Typography } from '@/components/ui'
import React from 'react'

const AppLogo: React.FC = () => {
	return (
		<Div className='flex items-center gap-x-3 font-jetbrains group-data-[state=expanded]:gap-x-3 xl:gap-x-0'>
			<Div className='flex aspect-square flex-col items-center justify-center gap-y-2 rounded bg-primary p-2 text-center font-jetbrains text-[10px] text-sm font-medium leading-none text-primary-foreground shadow-2xl group-data-[state=collapsed]:size-8 group-data-[state=expanded]:size-12 group-data-[state=collapsed]:gap-y-1.5 group-data-[state=collapsed]:p-[3px] group-data-[state=collapsed]:text-[10px] group-data-[state=collapsed]:tracking-widest'>
				WMS
				<Separator className='h-[2px] w-full group-data-[state=expanded]:h-[3px]' />
			</Div>
			<Typography
				variant='code'
				className='duration-50 text-sm font-semibold leading-snug tracking-widest transition-[width_opacity] group-data-[state=expanded]:w-auto group-data-[state=expanded]:opacity-100 xl:w-0 xl:opacity-0'>
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
