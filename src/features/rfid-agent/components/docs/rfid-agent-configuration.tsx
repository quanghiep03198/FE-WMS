import RFIDAgentConfigImage from '@assets/images/rfid-agent-configuration.png'
import { Dialog, DialogContent, DialogTrigger, Typography } from '@components/ui'
import { DocumentHashNavigation } from '../../constants/document-hash-navigation'
import SectionHeading from './section-heading'
import { Section } from './styled'

const RFIDAgentConfiguration: React.FC = () => {
	return (
		<Section>
			<SectionHeading id={DocumentHashNavigation.RFID_AGENT_CONFIGURATION}>Configuration</SectionHeading>
			<Typography>
				After installing the RFID Agent, you need to configure it to connect with your UHF RFID reader and our web.
				The configuration form will look like this image below.
			</Typography>
			<Dialog>
				<DialogTrigger>
					<figure className='space-y-1 [&_img]:rounded'>
						<img
							alt='RFID Agent Configuration'
							className='object-contain object-center'
							src={RFIDAgentConfigImage}
						/>
						<figcaption className='text-muted-foreground text-center text-sm'>
							RFID Agent Configuration
						</figcaption>
					</figure>
				</DialogTrigger>
				<DialogContent className='bg-background/50! relative h-screen max-w-screen rounded-none backdrop-blur-sm'>
					<figure className='space-y-1'>
						<img
							alt='RFID Agent Configuration'
							className='mx-auto w-full max-w-[90vw] rounded object-contain object-center'
							src={RFIDAgentConfigImage}
						/>
						<figcaption className='text-muted-foreground text-center text-sm'>
							RFID Agent Configuration
						</figcaption>
					</figure>
				</DialogContent>
			</Dialog>
		</Section>
	)
}

export default RFIDAgentConfiguration
