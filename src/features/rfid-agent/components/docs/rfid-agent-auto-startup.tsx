import { Badge, Typography } from '@components/ui'
import { Kbd, KbdKey } from '@components/ui/@custom/kbd'
import { DocumentHashNavigation } from '../../constants/document-hash-navigation'
import SectionHeading from './section-heading'
import { ListItem, OrderedList, Section } from './styled'
import Terminal from './terminal'

const RFIDAgentAutoStartup: React.FC = () => {
	return (
		<Section>
			<SectionHeading id={DocumentHashNavigation.RFID_AGENT_AUTO_STARTUP}>Auto Startup</SectionHeading>
			<Typography>
				RFID Agent is designed to run in the background and start automatically when your computer boots up. This
				ensures that your RFID readers are always connected and ready to use without requiring manual intervention.
				In order to enable or disable the auto startup feature, you can follow these steps:
			</Typography>
			<OrderedList>
				<ListItem>
					Install <Badge variant='secondary'>nssm</Badge> via <Badge variant='secondary'>Chocolately</Badge>
					<Terminal tabTitle='Powershell' command='choco install nssm'>
						choco install nssm
					</Terminal>
				</ListItem>
				<ListItem>
					Find the directory where RFID Agent is installed, usually it is{' '}
					<Badge variant='secondary'>C:\Program Files\RFID Agent</Badge>. Run the following command to set up RFID
					Agent as a service that starts automatically:
					<Terminal
						tabTitle='Powershell'
						command='nssm install "RFID Agent" "C:\Program Files\RFID Agent\rfid-agent.exe"'>
						nssm install &quot;RFID Agent&quot; &quot;C:\Program Files\RFID Agent\rfid-agent.exe&quot;
					</Terminal>
				</ListItem>
				<ListItem>
					Press{' '}
					<Kbd>
						<KbdKey>Win</KbdKey>
						<KbdKey>R</KbdKey>
					</Kbd>
					to open the Run dialog, type <Badge variant='secondary'>services.msc</Badge>, and press Enter to open the
					Services application. In the Services window, find the <Badge variant='secondary'>RFID Agent</Badge>{' '}
					service, if current status is not running, right-click on it and select{' '}
					<Badge variant='secondary'>Start</Badge> to start the service. You can also set the startup type to{' '}
					<Badge variant='secondary'>Automatic</Badge> to ensure it starts automatically on boot.
				</ListItem>
			</OrderedList>
		</Section>
	)
}

export default RFIDAgentAutoStartup
