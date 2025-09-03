import { cn } from '@/common/utils/cn'
import { buttonVariants, Div, Icon, Typography } from '@/components/ui'
import React from 'react'

const MosquittoInstallation: React.FC = () => {
	return (
		<Div as='section' className='space-y-3'>
			<Typography variant='h2'>Installation</Typography>
			<Typography>
				To install Mosquitto on your system, follow the instructions below based on your operating system:
			</Typography>

			<ol className='list-inside list-decimal space-y-2 pl-4' data-level={1}>
				<li>
					<Typography as='span'>
						Download the latest version of Eclipse Mosquitto from official website.
					</Typography>
					<Div className='my-6'>
						<Div className='inline-flex items-center gap-x-2'>
							<a href='https://mosquitto.org/download/' className={cn(buttonVariants())}>
								<Icon name='CloudDownload' /> Mosquitto Windows Installer (.exe)
							</a>
						</Div>
					</Div>
				</li>
				<li>Run the installer and follow the on-screen instructions.</li>
				<li>Once installed, add Eclipse Mosquitto into your Evironment variables</li>
				<li>Open CMD, type "mosquitto -h"</li>
			</ol>
		</Div>
	)
}

export default MosquittoInstallation
