import { Typography } from '@/components/ui'
import { DocumentHashNavigation } from '../-constants/document-hash-navigation'
import SectionHeading from './section-heading'
import { Section } from './styled'

const MosquittoIntroduction: React.FC = () => {
	return (
		<Section>
			<SectionHeading id={DocumentHashNavigation.MOSQUITTO_INTRODUCTION}>What is Eclipse Mosquitto ?</SectionHeading>
			<Typography>
				Mosquitto is an open-source message broker that implements the MQTT (Message Queuing Telemetry Transport)
				protocol. It is designed for lightweight, low-bandwidth, and low-power devices, making it ideal for Internet
				of Things (IoT) applications. <br /> Mosquitto allows devices to communicate with each other by publishing
				and subscribing to topics, enabling real-time data exchange and efficient messaging in distributed systems.
			</Typography>
		</Section>
	)
}

export default MosquittoIntroduction
