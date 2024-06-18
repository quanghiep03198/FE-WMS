import env from '@/common/utils/env'
import { Badge, Div, Typography } from '@/components/ui'
import React from 'react'

const AppLogo: React.FC = () => {
	return (
		<Div className='inline-flex items-center gap-x-2'>
			<Typography variant='small' className='whitespace-nowrap text-xs font-bold tracking-widest'>
				i-WMS
			</Typography>
			<Badge variant='default' className='font-mono tracking-wide'>
				{env('VITE_APP_VERSION')}
			</Badge>
		</Div>
	)
}

export default AppLogo
