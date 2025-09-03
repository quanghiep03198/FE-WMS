import { cn } from '@/common/utils/cn'
import { Badge, buttonVariants, Div, Icon, Typography } from '@/components/ui'
import Terminal from './terminal'

const RFIDAgentInstallation: React.FC = () => {
	return (
		<Div as='section' className='space-y-3'>
			<Typography variant='h2' id='rfid-agent-installation'>
				Installation and setup
			</Typography>
			<Typography>To install RFID Agent, please follow these steps:</Typography>
			<ol className='list-inside list-decimal space-y-2 pl-4' data-level={1}>
				<li>
					<Typography as='span'>Download the latest version of RFID Agent from our official website.</Typography>
					<Div className='my-6'>
						<Div className='inline-flex items-center gap-x-2'>
							<a href='' className={cn(buttonVariants())}>
								<Icon name='CloudDownload' /> Windows Installer (.exe)
							</a>
							<a href='' className={cn(buttonVariants())}>
								<Icon name='FolderArchive' /> Portable Version (.rar)
							</a>
						</Div>
					</Div>
				</li>
				<li>
					<Typography as='span'>Run the installer and follow the on-screen instructions.</Typography>
					<ul className='my-6 list-inside list-disc space-y-2 pl-8'>
						<li>
							Run{' '}
							<Badge variant='secondary' className='translate-y-0.5 gap-x-1'>
								<Icon name='AppWindow' /> rfid-agent.exe
							</Badge>{' '}
							in case you use download Window installer
						</li>
						<li>
							Extract{' '}
							<Badge variant='secondary' className='translate-y-0.5 gap-x-1'>
								<Icon name='FolderArchive' /> rfid-agent.rar
							</Badge>{' '}
							{`if you download "Portable Version"`}
						</li>
					</ul>
				</li>
				<li>Once installed, launch the application and configure your UHF reader settings.</li>
				<li>
					<Typography as='span'>
						Ping RFID Reader TCP/IP to check if communication between your computer and RFID Reader is available
					</Typography>
					<Terminal command='ping <your_reader_ip_address>' className='my-4'>
						ping &lt;your_reader_ip_address&gt;
					</Terminal>
				</li>
				<li>Connect your UHF reader to your computer using the appropriate interface (Wifi, LAN, etc.).</li>
				<li>Ensure that the RFID Agent is running and properly communicating with your UHF reader.</li>
			</ol>
		</Div>
	)
}

export default RFIDAgentInstallation
