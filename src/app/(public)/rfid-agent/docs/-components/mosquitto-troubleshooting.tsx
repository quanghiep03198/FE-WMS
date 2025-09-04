import { Typography } from '@/components/ui'
import { DocumentHashNavigation } from '../-constants/document-hash-navigation'
import SectionHeading from './section-heading'
import { ListItem, OrderedList, Section } from './styled'

const MosquittoTroubleshooting: React.FC = () => {
	return (
		<Section>
			<SectionHeading id={DocumentHashNavigation.MOSQUITTO_TROUBLESHOOTING}>Troubleshooting</SectionHeading>
			<Typography>
				If you encounter any issues while using Eclipse Mosquitto, consider the following troubleshooting steps:
			</Typography>
			<OrderedList>
				<ListItem>
					Ensure that Mosquitto is properly installed and running on your system. You can check the service status
					or run the Mosquitto broker manually to verify.
				</ListItem>
				<ListItem>
					Verify that the configuration file (mosquitto.conf) is correctly set up, including listener ports,
					authentication settings (&quot;allow_anonymous&quot; must be &quot;true&quot;).
				</ListItem>
				<ListItem>
					Check for any error messages in the Mosquitto log files. The log files can provide valuable information
					about issues with the broker.
				</ListItem>
				<ListItem>
					Ensure that your firewall or security software is not blocking the Mosquitto ports (default is 1883 for
					TCP and 9001 for Websocket).
				</ListItem>
			</OrderedList>
		</Section>
	)
}

export default MosquittoTroubleshooting
