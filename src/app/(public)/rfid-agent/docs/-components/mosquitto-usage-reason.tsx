import { Div, Typography } from '@/components/ui'

const MosquittoUsageReason: React.FC = () => {
	return (
		<Div as='section' className='space-y-3'>
			<Typography variant='h2'>Why Eclipse Mosquitto needed ?</Typography>
			<Typography>
				Mosquitto is needed as a lightweight and efficient message broker to facilitate communication between the
				RFID Agent and the web application. It enables real-time data exchange, allowing the RFID Agent to publish
				RFID tag information to specific topics that the web application can subscribe to. This ensures seamless
				integration, reliable message delivery, and efficient handling of data from UHF RFID readers, making it an
				essential component for the overall system architecture.
			</Typography>
		</Div>
	)
}

export default MosquittoUsageReason
