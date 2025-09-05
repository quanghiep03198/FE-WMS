import RFIDAgentConfigImage from '@/assets/images/rfid-agent-configuration.png'
import { Dialog, DialogContent, DialogTrigger, Typography } from '@/components/ui'
import { DocumentHashNavigation } from '../-constants/document-hash-navigation'
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
						<img src={RFIDAgentConfigImage} className='object-contain object-center' />
						<figcaption className='text-center text-sm text-muted-foreground'>
							RFID Agent Configuration
						</figcaption>
					</figure>
				</DialogTrigger>
				<DialogContent className='max-w-screen relative h-screen rounded-none !bg-background/50 backdrop-blur-sm'>
					<figure className='space-y-1'>
						<img
							src={RFIDAgentConfigImage}
							className='mx-auto w-full max-w-[90vw] rounded object-contain object-center'
						/>
						<figcaption className='text-center text-sm text-muted-foreground'>
							RFID Agent Configuration
						</figcaption>
					</figure>
				</DialogContent>
			</Dialog>
		</Section>
	)
}

export default RFIDAgentConfiguration
