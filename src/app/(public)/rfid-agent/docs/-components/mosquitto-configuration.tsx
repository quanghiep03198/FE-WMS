import { Badge, Icon, Typography } from '@/components/ui'
import { Kbd, KbdKey } from '@/components/ui/@custom/kbd'
import { DocumentHashNavigation } from '../-constants/document-hash-navigation'
import SectionHeading from './section-heading'
import { Section } from './styled'
import Terminal from './terminal'

const MosquittoConfiguration: React.FC = () => {
	return (
		<Section>
			<SectionHeading id={DocumentHashNavigation.MOSQUITTO_CONFIGURATION}>Configuration</SectionHeading>
			<Typography>
				To configure Mosquitto, you need to edit the mosquitto.conf file. This file contains various settings that
				control the behavior of the Mosquitto broker. You can find the configuration file in the installation
				directory or in /etc/mosquitto/ on Linux systems. Make sure to set parameters such as listener ports,
				authentication methods, and persistence options according to your requirements.
			</Typography>
			<ol className='list-inside list-decimal space-y-2 pl-4'>
				<li className='mb-4 space-y-4'>
					<Typography as='span'>
						Open{' '}
						<Badge variant='secondary' className='gap-x-1'>
							<Icon name='FileCog' /> mosquitto.conf
						</Badge>{' '}
						file and set the following parameters:
					</Typography>
					<Terminal
						tabIcon='FileCog'
						tabTitle='mosquitto.conf'
						command={
							/* template */ `
								# Enable anonymous access locally
								allow_anonymous true
								
								# MQTT TCP for publisher/subscriber/backend
								listener 1883 your_ip_address		
								
								# MQTT WebSocket for client
								listener 9001 your_ip_address
								protocol websockets
							`
						}>
						<span className='text-muted-foreground'># Enable anonymous access locally</span>
						<br />
						allow_anonymous true
						<br />
						<br />
						<span className='text-muted-foreground'># MQTT TCP for publisher/subscriber/backend</span>
						<br />
						listener 1883 &lt;your_ip_address&gt;
						<br />
						<br />
						<span className='text-muted-foreground'># MQTT WebSocket for client</span>
						<br />
						listener 9001 &lt;your_ip_address&gt;
						<br />
						protocol websockets
					</Terminal>
					<Typography variant='blockquote' className='!mb-4'>
						Replace &lt;your_ip_address&gt; with the actual IP address of your machine. Save the file after making
						the changes.
					</Typography>
				</li>
				<li>
					<Typography className='inline'>
						Press{' '}
						<Kbd className='mx-1'>
							<KbdKey aria-label='Meta'>Win</KbdKey>
							<KbdKey>R</KbdKey>
						</Kbd>
						, type <code>&quot;cmd&quot;</code> and hit{' '}
						<Kbd className='mx-1'>
							<KbdKey aria-label='Meta'> ↳ Enter</KbdKey>
						</Kbd>{' '}
						to open <b>Command Prompt</b>. After that, run the following commands to restart the Mosquitto service
						and apply the new configuration.
					</Typography>
					<Terminal
						command={
							/* template */ `
								net stop mosquitto
								net start mosquitto
							`
						}
						className='my-4'>
						net stop mosquitto
						<br />
						net start mosquitto
					</Terminal>
				</li>
			</ol>
		</Section>
	)
}

export default MosquittoConfiguration
