import { Typography } from '@components/ui'
import { Link } from '@tanstack/react-router'
import { DocumentHashNavigation } from '../../constants/document-hash-navigation'
import SectionHeading from './section-heading'
import { ListItem, OrderedList, Section } from './styled'

const RFIDAgentTroubleShooting: React.FC = () => {
	return (
		<Section>
			<SectionHeading id={DocumentHashNavigation.RFID_AGENT_TROUBLESHOOTING}>Troubleshooting</SectionHeading>
			<Typography>
				If you encounter any issues while using RFID Agent, consider the following troubleshooting steps:
			</Typography>
			<OrderedList>
				<ListItem>
					Ensure that you already installed{' '}
					<Link to='/rfid-agent' hash={DocumentHashNavigation.MOSQUITTO_INTRODUCTION} className='text-active'>
						Eclipse Mosquitto
					</Link>
					, followed{' '}
					<Link
						to='/rfid-agent/docs'
						hash={DocumentHashNavigation.MOSQUITTO_CONFIGURATION}
						className='underline underline-offset-2'>
						configuration steps
					</Link>{' '}
					mentioned in the documentation, and it is running properly.
				</ListItem>
				<ListItem>Ensure that your UHF RFID reader is properly connected to your computer and powered on.</ListItem>
				<ListItem>Verify that the RFID Agent is running and that you have the latest version installed.</ListItem>
				<ListItem>
					Double-check the IP address and port settings in the RFID Agent to ensure they match your UHF
					reader&apos;s
				</ListItem>
				<ListItem>
					Check your network settings to ensure that there are no firewall or security settings blocking
					communication
				</ListItem>
				<ListItem>
					Make sure that you are using the same antenna port number as configured in your UHF reader settings.
				</ListItem>
				<ListItem>
					Restart the RFID Agent application and your UHF reader to resolve any temporary glitches.
				</ListItem>
				<ListItem>
					Consult the official documentation or support resources for your specific UHF reader model for
				</ListItem>
				<ListItem>If the problem persists, reach out to our support team for assistance.</ListItem>
			</OrderedList>
		</Section>
	)
}

export default RFIDAgentTroubleShooting
