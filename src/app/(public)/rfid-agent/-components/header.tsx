import { cn } from '@/common/utils/cn'
import {
	Div,
	Icon,
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle
} from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DocumentHashNavigation } from '../docs/-constants/document-hash-navigation'

type NavigationGroup = Record<
	'rfidAgent' | 'thirdParty',
	Array<{ title: string; hash?: DocumentHashNavigation; href?: string; description: string }>
>

export const Header: React.FC = () => {
	const { i18n } = useTranslation()

	const navigationGroup: NavigationGroup = useMemo(
		() => ({
			rfidAgent: [
				{
					title: 'About',
					hash: DocumentHashNavigation.RFID_AGENT_INTRODUCTION,
					description: 'RFID Agent makes it easy to connect and manage RFID readers.'
				},
				{
					title: 'Installation',
					hash: DocumentHashNavigation.RFID_AGENT_INSTALLATION,
					description: 'Download the latest version of RFID Agent for your operating system.'
				},
				{
					title: 'Configuration',
					hash: DocumentHashNavigation.RFID_AGENT_CONFIGURATION,
					description: 'Follow our step-by-step guide to get started quickly.'
				}
			],
			thirdParty: [
				{
					title: 'About Mosquitto',
					hash: DocumentHashNavigation.MOSQUITTO_INTRODUCTION,
					description:
						'Lightweight and open-source MQTT broker that facilitates efficient message exchange between IoT devices and applications.'
				},
				{
					title: 'Mosquitto download',
					href: 'https://mosquitto.org/',
					description:
						'Get the latest version of Mosquitto, a lightweight and open-source MQTT broker for efficient message exchange in IoT applications.'
				},
				{
					title: 'Mosquitto installation',
					hash: DocumentHashNavigation.MOSQUITTO_INSTALLATION,
					description:
						'Step-by-step guide to install Mosquitto, a lightweight and open-source MQTT broker, on various operating systems for efficient message exchange in IoT applications.'
				},
				{
					title: 'Mosquitto configuration',
					hash: DocumentHashNavigation.MOSQUITTO_CONFIGURATION,
					description:
						'Instructions to configure Mosquitto, a lightweight and open-source MQTT broker, for secure and efficient message exchange in IoT applications.'
				}
			]
		}),
		[i18n.language]
	)

	return (
		<Div
			as='header'
			className='sticky top-0 z-50 mx-auto max-w-2xl overflow-x-auto bg-transparent p-2 scrollbar-none sm:border-b sm:bg-background'>
			<NavigationMenu className='mx-auto w-fit rounded-lg border bg-background/50 p-1 backdrop-blur-sm sm:rounded-none sm:border-none sm:p-0'>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link to='/'>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className='grid gap-3 p-4 md:w-[400px] xl:w-[500px] xl:grid-cols-[.75fr_1fr]'>
								<li className='row-span-3'>
									<NavigationMenuLink asChild>
										<a
											className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
											href='/'>
											{/* <Icons. className="h-6 w-6" /> */}
											<Icon name='Radio' size={40} strokeWidth={1.5} />
											<div className='mb-2 mt-4 text-lg font-medium'>RFID Agent</div>
											<p className='text-sm leading-tight text-muted-foreground'>
												Connect your RFID reader to our web application with ease.
											</p>
										</a>
									</NavigationMenuLink>
								</li>
								{navigationGroup.rfidAgent.map((externalLink) => (
									<ListItem
										key={externalLink.hash}
										to='/rfid-agent/docs'
										hash={externalLink.hash}
										title={externalLink.title}
										href={externalLink.href}>
										{externalLink.description}
									</ListItem>
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuTrigger>Third-party</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
								{navigationGroup.thirdParty.map((externalLink) => (
									<ListItem
										key={externalLink.hash}
										to='/rfid-agent/docs'
										hash={externalLink.hash}
										title={externalLink.title}
										href={externalLink.href}>
										{externalLink.description}
									</ListItem>
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link to='/rfid-agent/docs'>
							<NavigationMenuLink className={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</Div>
	)
}

const ListItem: React.FC<React.PropsWithChildren & React.ComponentProps<typeof Link>> = ({
	className,
	title,
	children,
	ref,
	...props
}) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					ref={ref}
					className={cn(
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className
					)}
					{...props}>
					<div className='text-sm font-medium leading-none'>{title}</div>
					<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
				</Link>
			</NavigationMenuLink>
		</li>
	)
}

ListItem.displayName = 'ListItem'
