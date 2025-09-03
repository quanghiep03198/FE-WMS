import { Div, Typography } from '@/components/ui'

const MosquittoIntroduction: React.FC = () => {
	return (
		<Div as='section' className='space-y-3'>
			<Typography variant='h2' id='about-mosquitto'>
				What is Eclipse Mosquitto ?
			</Typography>
			<Typography>
				Mosquitto is an open-source message broker that implements the MQTT (Message Queuing Telemetry Transport)
				protocol. It is designed for lightweight, low-bandwidth, and low-power devices, making it ideal for Internet
				of Things (IoT) applications. Mosquitto allows devices to communicate with each other by publishing and
				subscribing to topics, enabling real-time data exchange and efficient messaging in distributed systems.
			</Typography>
		</Div>
	)
}

export default MosquittoIntroduction
