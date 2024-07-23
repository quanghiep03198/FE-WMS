import { Div, Typography } from '@/components/ui'

const Footer: React.FC = () => {
	return (
		<Div as='footer' className='mx-auto max-w-full border-t border-border p-6 text-center'>
			<Typography id='company' variant='small'>
				© {new Date().getFullYear()} GreenLand, Inc. All rights reserved.
			</Typography>
		</Div>
	)
}

export default Footer
