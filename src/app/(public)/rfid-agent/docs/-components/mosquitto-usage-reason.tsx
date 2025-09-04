import { Typography } from '@/components/ui'
import { DocumentHashNavigation } from '../-constants/document-hash-navigation'
import SectionHeading from './section-heading'
import { Section } from './styled'

const MosquittoUsageReason: React.FC = () => {
	return (
		<Section>
			<SectionHeading variant='h2' id={DocumentHashNavigation.MOSQUITTO_USAGE_REASON}>
				Why Eclipse Mosquitto is needed ?
			</SectionHeading>
			<Typography>
				Mosquitto is needed as a lightweight and efficient message broker to facilitate communication between the
				RFID Agent and the web application. It enables real-time data exchange, allowing the RFID Agent to publish
				RFID tag information to specific topics that the web application can subscribe to. This ensures seamless
				integration, reliable message delivery, and efficient handling of data from UHF RFID readers, making it an
				essential component for the overall system architecture.
			</Typography>
		</Section>
	)
}

export default MosquittoUsageReason
