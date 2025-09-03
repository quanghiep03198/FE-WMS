import { Typography } from '@/components/ui'

const RFIDAgentIntroduction: React.FC = () => {
	return (
		<section className='space-y-3'>
			<Typography variant='h2' id='about-rfid-agent'>
				What is RFID Agent ?
			</Typography>
			<Typography>
				RFID Agent is a lightweight desktop application that connects your UHF reader to our web application. It
				acts as a bridge between the hardware and software, enabling seamless communication and data transfer. With
				RFID Agent, you can easily manage and monitor your RFID devices in real-time, making it an essential tool
				for inventory management, and other RFID-related applications.
			</Typography>
		</section>
	)
}

export default RFIDAgentIntroduction
