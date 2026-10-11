import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { MicrosoftIcon } from '@components/icons/microsoft-icon'
import { Badge } from '@components/ui/badge'
import { Icon } from '@components/ui/icon'
import { DocumentHashNavigation } from '../../constants/document-hash-navigation'
import { useGetLatestRelease } from '../../hooks/use-get-latest-release'
import { DownloadButton } from './download-button'
import SectionHeading from './section-heading'
import { ListItem, OrderedList, Section, UnorderedList } from './styled'
import Terminal from './terminal'

const RFIDAgentInstallation: React.FC = () => {
	const { data, isLoading, isError } = useGetLatestRelease()

	return (
		<Section>
			<SectionHeading id={DocumentHashNavigation.RFID_AGENT_INSTALLATION}>Installation and setup</SectionHeading>
			<Typography>To install RFID Agent, please follow these steps:</Typography>
			<OrderedList className='list-inside list-decimal space-y-2 pl-4' data-level={1}>
				<ListItem>
					<Typography as='span'>Download the latest version of RFID Agent from our official website.</Typography>
					<Div className='my-6'>
						<Div className='inline-flex items-center gap-x-2'>
							<DownloadButton
								href={
									data?.assets.find((asset) => asset.content_type === 'application/x-msdos-program')
										?.browser_download_url
								}>
								{isLoading ? <Icon className='animate-spin' name='LoaderCircle' /> : <MicrosoftIcon />}
								Windows Installer (.exe)
								{isError && (
									<Icon
										className='fill-destructive stroke-destructive-foreground absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
										name='CircleAlert'
										size={18}
									/>
								)}
							</DownloadButton>
							<DownloadButton
								href={
									data?.assets.find((asset) => asset.content_type === 'application/zip')?.browser_download_url
								}>
								<Icon
									className={isLoading && 'animate-spin'}
									name={isLoading ? 'LoaderCircle' : 'FolderArchive'}
								/>{' '}
								Portable Version (.rar)
								{isError && (
									<Icon
										className='fill-destructive stroke-destructive-foreground absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
										name='CircleAlert'
										size={18}
									/>
								)}
							</DownloadButton>
						</Div>
					</Div>
				</ListItem>
				<ListItem>
					<Typography as='span'>Run the installer and follow the on-screen instructions.</Typography>
					<UnorderedList className='my-6 list-inside list-disc space-y-2 pl-8'>
						<ListItem>
							Run{' '}
							<Badge className='translate-y-0.5 gap-x-1' variant='secondary'>
								<Icon name='AppWindow' /> rfid-agent.exe
							</Badge>{' '}
							in case you use download Window installer
						</ListItem>
						<ListItem>
							Extract{' '}
							<Badge className='translate-y-0.5 gap-x-1' variant='secondary'>
								<Icon name='FolderArchive' /> rfid-agent.rar
							</Badge>{' '}
							{`if you download "Portable Version"`}
						</ListItem>
					</UnorderedList>
				</ListItem>
				<ListItem>Once installed, launch the application and configure your UHF reader settings.</ListItem>
				<ListItem>
					<Typography as='span'>
						Ping RFID Reader TCP/IP to check if communication between your computer and RFID Reader is available
					</Typography>
					<Terminal className='my-4' command='ping <your_reader_ip_address>'>
						ping &lt;your_reader_ip_address&gt;
					</Terminal>
				</ListItem>
				<ListItem>
					Connect your UHF reader to your computer using the appropriate interface (Wifi, LAN, etc.).
				</ListItem>
				<ListItem>Ensure that the RFID Agent is running and properly communicating with your UHF reader.</ListItem>
			</OrderedList>
		</Section>
	)
}

export default RFIDAgentInstallation
