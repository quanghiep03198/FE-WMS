import { Div, Icon, Typography } from '@/components/ui'
import { Kbd, KbdKey } from '@/components/ui/@custom/kbd'
import React from 'react'
import { DocumentHashNavigation } from '../-constants/document-hash-navigation'
import { DownloadButton } from './download-button'
import SectionHeading from './section-heading'
import { ListItem, OrderedList, Section } from './styled'
import Terminal from './terminal'

const MosquittoInstallation: React.FC = () => {
	return (
		<Section>
			<SectionHeading id={DocumentHashNavigation.MOSQUITTO_INSTALLATION}>Installation</SectionHeading>
			<Typography>
				To install Mosquitto on your system, follow the instructions below based on your operating system:
			</Typography>

			<OrderedList>
				<ListItem>
					<Typography as='span'>
						Download the latest version of Eclipse Mosquitto from official website.
					</Typography>
					<Div className='my-6'>
						<Div className='inline-flex items-center gap-x-2'>
							<DownloadButton
								href='https://mosquitto.org/files/binary/win64/mosquitto-2.0.22-install-windows-x64.exe'
								download>
								<Icon name='CloudDownload' /> Mosquitto Windows Installer (.exe)
							</DownloadButton>
						</Div>
					</Div>
				</ListItem>
				<ListItem>Run the installer and follow the on-screen instructions.</ListItem>
				<ListItem>
					<Typography className='inline'>
						Once installed, add Eclipse Mosquitto into your Evironment variables Path. This allows you to run
						Mosquitto from any command prompt. Press{' '}
						<Kbd className='mx-1'>
							<KbdKey aria-label='Meta'>Win</KbdKey>
							<KbdKey>R</KbdKey>
						</Kbd>
						, type <code>&quot;cmd&quot;</code> and hit{' '}
						<Kbd className='mx-1'>
							<KbdKey aria-label='Meta'> ↳ Enter</KbdKey>
						</Kbd>{' '}
						to open <b>Command Prompt</b>.
					</Typography>
					<Terminal command={/* template */ `setx PATH "%PATH%;%MOSQUITTO_DIR%" /M`} className='my-4'>
						{`setx PATH "%PATH%;%MOSQUITTO_DIR%" /M`}
					</Terminal>
				</ListItem>
				<ListItem>
					<Typography className='inline'>
						Open new <b>Command Prompt</b> window and type the below command. If you see the following output, it
						means Mosquitto is installed correctly and working.
					</Typography>
					<Terminal command={/* template */ `mosquitto -h`} className='my-4'>
						mosquitto -h
						<br />
						<br />
						<span className='text-muted-foreground'>
							mosquitto version 2.0.22
							<br />
							<br />
							mosquitto is an MQTT v5.0/v3.1.1/v3.1 broker.
							<br />
							<br />
							Usage: mosquitto [-c config_file] [-d] [-h] [-p port]
							<br />
							-c : specify the broker config file.
							<br />
							-d : put the broker into the background after starting.
							<br />
							-h : display this help.
							<br />
							-p : start the broker listening on the specified port. Not recommended in conjunction with the -c
							option.
							<br />
							-v : verbose mode - enable all logging types. This overrides any logging options given in the
							config file.
							<br />
							See https://mosquitto.org/ for more information.
						</span>
					</Terminal>
				</ListItem>
			</OrderedList>
		</Section>
	)
}

export default MosquittoInstallation
