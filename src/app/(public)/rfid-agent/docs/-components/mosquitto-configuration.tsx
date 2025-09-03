import { Badge, Div, Icon, Typography } from '@/components/ui'

type Props = {}

const MosquittoConfiguration = (props: Props) => {
	return (
		<Div as='section' className='space-y-3'>
			<Typography variant='h2'>Configuration</Typography>
			<Typography>
				To configure Mosquitto, you need to edit the mosquitto.conf file. This file contains various settings that
				control the behavior of the Mosquitto broker. You can find the configuration file in the installation
				directory or in /etc/mosquitto/ on Linux systems. Make sure to set parameters such as listener ports,
				authentication methods, and persistence options according to your requirements.
			</Typography>
			<ol className='list-inside list-decimal space-y-2 pl-4'>
				<li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
				<li>Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
				<li>
					<Typography as='span'>
						Open{' '}
						<Badge variant='secondary' className='gap-x-1'>
							<Icon name='FileCog' /> mosquitto.conf
						</Badge>{' '}
						file and set the following parameters:
					</Typography>
					<code className='relative my-6 block w-full rounded bg-accent p-3 font-jetbrains text-accent-foreground'>
						<code
							dangerouslySetInnerHTML={{
								__html: /* template */ `
									allow_anonymous true
									<br/>
									<br/>
									<code class='text-muted-foreground'># MQTT TCP for publisher/subscriber/backend</code>
									<br/>
									listener 1883 10.30.146.60
									<br/>
									<br/>
									<code class='text-muted-foreground'># MQTT WebSocket for client</code>
									<br/>
									listener 9001 10.30.146.60
									<br/>
									protocol websockets
                  		`
							}}
						/>
						<button className='absolute right-3 top-3'>
							<Icon name='Copy' />
						</button>
					</code>
				</li>
				<li>
					In CMD, type &quot;net stop mosquitto&quot; to stop Mosquitto service, then type &quot;net start
					mosquitto&quot; to start Mosquitto service again
				</li>
			</ol>
		</Div>
	)
}

export default MosquittoConfiguration
