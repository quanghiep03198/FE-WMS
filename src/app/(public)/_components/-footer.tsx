import { Box, Typography } from '@/components/ui';

export default function Footer() {
	return (
		<Box as='footer' className='mx-auto max-w-full border-t border-border p-6 text-center'>
			<Typography variant='small'>© {new Date().getFullYear()} GreenLand, Inc. All rights reserved.</Typography>
		</Box>
	);
}
