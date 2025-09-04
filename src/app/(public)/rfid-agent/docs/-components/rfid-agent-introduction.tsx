import { Typography } from '@/components/ui'

import { DocumentHashNavigation } from '../-constants/document-hash-navigation'
import SectionHeading from './section-heading'
import { Section } from './styled'

const RFIDAgentIntroduction: React.FC = () => {
	return (
		<Section>
			<SectionHeading id={DocumentHashNavigation.RFID_AGENT_INTRODUCTION}>What is RFID Agent ?</SectionHeading>
			<Typography>
				RFID Agent is a lightweight desktop application that connects your UHF reader to our web application. It
				acts as a bridge between the hardware and software, enabling seamless communication and data transfer. With
				RFID Agent, you can easily manage and monitor your RFID devices in real-time, making it an essential tool
				for inventory management, and other RFID-related applications.
			</Typography>
		</Section>
	)
}

export default RFIDAgentIntroduction
