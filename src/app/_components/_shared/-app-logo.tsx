import { Badge, Box, Typography } from '@/components/ui';
import React from 'react';

const AppLogo: React.FC = () => {
	return (
		<Box className=''>
			<Typography className='text-xs font-bold tracking-widest'>i-WMS</Typography>
			<Badge variant='default'>{import.meta.env.VITE_APP_VERSION}</Badge>
		</Box>
	);
};

export default AppLogo;
