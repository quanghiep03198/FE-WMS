import { Badge, Div, Typography } from '@/components/ui';
import React from 'react';

const AppLogo: React.FC = () => {
	return (
		<Div className=''>
			<Typography className='text-xs font-bold tracking-widest'>i-WMS</Typography>
			<Badge variant='default'>{import.meta.env.VITE_APP_VERSION}</Badge>
		</Div>
	);
};

export default AppLogo;
