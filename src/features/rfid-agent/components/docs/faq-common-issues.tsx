import { Typography } from '@components/ui'
import { DocumentHashNavigation } from '../../constants/document-hash-navigation'
import SectionHeading from './section-heading'
import { ListItem, OrderedList, Section } from './styled'

const FAQCommonQuestions: React.FC = () => {
	return (
		<Section>
			<SectionHeading id={DocumentHashNavigation.FAQ_COMMON_QUESTIONS}>Common Questions</SectionHeading>
			<Typography>
				Here are some common questions and issues users may encounter when using the RFID Agent. If you have
				additional questions, please refer to the official documentation or contact support.
			</Typography>
			<OrderedList className='space-y-4'>
				<ListItem>
					<strong>Why is my RFID reader not being detected?</strong>
					<br />
					Ensure that your RFID reader is properly connected to your computer and that the necessary drivers are
					installed. Check the device manager (Windows) or system profiler (Mac) to see if the device is
					recognized.
				</ListItem>
				<ListItem>
					<strong>How do I configure the RFID Agent to connect to my MQTT broker?</strong>
					<br />
					You can configure the MQTT broker settings in the RFID Agent configuration file. Make sure to provide the
					correct broker address, port, username, and password if required.
				</ListItem>
				<ListItem>
					<strong>What should I do if the RFID Agent is not publishing data to the MQTT broker?</strong>
					<br />
					Check the connection status of the MQTT broker in the RFID Agent logs. Ensure that the broker is running
					and that the network connection is stable. Verify that the topic configuration matches your MQTT broker
					settings.
				</ListItem>
				<ListItem>
					<strong>How can I troubleshoot RFID tag reading issues?</strong>
					<br />
					Make sure that the RFID tags are within the range of the reader and that there are no obstructions. Check
					the reader&apos;s settings and ensure it is configured to read the specific type of RFID tags you are
					using.
				</ListItem>
				<ListItem>
					<strong>How do I update the RFID Agent to the latest version?</strong>
					<br />
					Check the official website or repository for updates. Follow the provided instructions to download and
					install the latest version of the RFID Agent.
				</ListItem>
				<ListItem>
					<strong>What should I do if I encounter an error message?</strong>
					<br />
					Refer to the error message details and check the RFID Agent documentation for troubleshooting steps. You
					can also search online forums or contact support for assistance.
				</ListItem>
				<ListItem>
					<strong>Can I use multiple RFID readers with the RFID Agent?</strong>
					<br />
					No, the current version of the RFID Agent supports only one RFID reader at a time.
				</ListItem>
				<ListItem>
					<strong>How do I reset the RFID Agent to its default settings?</strong>
					<br />
					You can reset the configuration file to its default state by deleting or renaming the existing file. The
					RFID Agent will generate a new configuration file with default settings upon the next startup.
				</ListItem>
			</OrderedList>
		</Section>
	)
}

export default FAQCommonQuestions
