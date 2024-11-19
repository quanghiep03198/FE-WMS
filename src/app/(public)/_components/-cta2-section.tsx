import { Div, Typography } from '@/components/ui'
import DeploymentGlobe from './-deployment-globe'

const CTA2Section: React.FC = () => {
	return (
		<Div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-2 xl:grid-cols-2'>
			<Div className='flex flex-col gap-y-6 sm:gap-y-3 sm:text-center'>
				<Typography variant='h3' className='sm:text-lg'>
					High Availability at our factories across Asia
				</Typography>
				<Typography className='leading-relaxed tracking-wide sm:text-sm'>
					Our app is designed to provide exceptional reliability and performance at factories throughout Asia.
					Ensure seamless operations and robust connectivity where it’s needed most—empower your facilities today
				</Typography>
			</Div>
			<Div className='relative flex justify-end'>
				<DeploymentGlobe />
			</Div>
		</Div>
	)
}

export default CTA2Section
