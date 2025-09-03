import { Div, Typography } from '@/components/ui'

const RFIDAgentUsageReason: React.FC = () => {
	return (
		<Div as='section' className='space-y-3'>
			<Typography variant='h2'>Why to use ?</Typography>
			<Typography>
				RFID Agent is a crucial component for anyone looking to leverage the power of UHF RFID technology. By using
				RFID Agent, you can:
			</Typography>
			<ul className='list-inside list-disc space-y-2 pl-4'>
				<li>Seamlessly connect your UHF reader to our web application.</li>
				<li>Real-time interaction with your RFID devices.</li>
				<li>Efficient data transfer between hardware and software.</li>
				<li>Improved inventory management and tracking capabilities.</li>
				<li>Easy setup and configuration process.</li>
				<li>Lightweight application with minimal resource usage.</li>
				<li>Long-term support and updates.</li>
			</ul>
		</Div>
	)
}

export default RFIDAgentUsageReason
