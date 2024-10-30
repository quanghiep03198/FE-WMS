import env from '@/common/utils/env'
import { Badge, Div, Typography } from '@/components/ui'
import React from 'react'

const AppLogo: React.FC = () => {
	return (
		<Div className='inline-flex items-center gap-x-2'>
			<Typography variant='small' className='whitespace-nowrap text-xs font-bold tracking-widest'>
				I-WMS
			</Typography>
			<Badge className='py-[1.5px]'>{env('VITE_APP_VERSION')}</Badge>
		</Div>
	)
}

export default AppLogo
