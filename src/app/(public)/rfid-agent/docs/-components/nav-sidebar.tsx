import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import {
	Icon,
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
	useSidebar
} from '@/components/ui'
import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { DocumentHashNavigation } from '../-constants/document-hash-navigation'
import { usePageContext } from '../-contexts/page-context'

export const menuGroups: Record<
	'rfidAgent' | 'mosquitto' | 'faqs',
	Array<{
		title: string
		hash?: string
		href?: string
	}>
> = {
	mosquitto: [
		{
			title: 'What is Eclipse Mosquitto?',
			hash: DocumentHashNavigation.MOSQUITTO_INTRODUCTION
		},
		{
			title: 'Why Eclipse Mosquitto?',
			hash: DocumentHashNavigation.MOSQUITTO_USAGE_REASON
		},
		{
			title: 'Installation',
			hash: DocumentHashNavigation.MOSQUITTO_INSTALLATION
		},
		{
			title: 'Configuration',
			hash: DocumentHashNavigation.MOSQUITTO_CONFIGURATION
		},
		{
			title: 'Learning Resources',
			href: 'https://mosquitto.org/',
			hash: 'mosquitto-learning-resources'
		},
		{
			title: 'Troubleshooting',
			hash: DocumentHashNavigation.MOSQUITTO_TROUBLESHOOTING
		}
	],
	rfidAgent: [
		{
			title: 'Introduction',
			hash: DocumentHashNavigation.RFID_AGENT_INTRODUCTION
		},
		{
			title: 'Why to use?',
			hash: DocumentHashNavigation.RFID_AGENT_BENEFITS
		},
		{
			title: 'Installation',
			hash: DocumentHashNavigation.RFID_AGENT_INSTALLATION
		},
		{
			title: 'Configuration',
			hash: DocumentHashNavigation.RFID_AGENT_CONFIGURATION
		},
		{
			title: 'Troubleshooting',
			hash: DocumentHashNavigation.RFID_AGENT_TROUBLESHOOTING
		}
	],
	faqs: [
		{
			title: 'Common issues',
			hash: 'faq-common-issues'
		},
		{
			title: 'Miscellaneous',
			hash: 'faq-miscellaneous'
		}
	]
}

const NavSidebar: React.FC = () => {
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

	return (
		<Sidebar variant='sidebar' side='left' collapsible='offcanvas'>
			<SidebarHeader className='p-4'>
				<Link to='/rfid-agent' className='flex items-center gap-x-2 font-bold'>
					<Icon name='Radio' size={36} strokeWidth={1.5} />
					RFID Agent
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className='text-base text-foreground'>Eclipse Mosquitto</SidebarGroupLabel>
					<SidebarMenu role='menu' aria-label='Eclipse Mosquitto'>
						{menuGroups.mosquitto.map((item) => (
							<SidebarMenuLink key={item.hash} {...item} />
						))}
					</SidebarMenu>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupLabel className='text-base text-foreground'>RFID Agent</SidebarGroupLabel>
					<SidebarMenu role='menu' aria-label='Main menu'>
						{menuGroups.rfidAgent.map((item) => (
							<SidebarMenuLink key={item.hash} {...item} />
						))}
					</SidebarMenu>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupLabel className='text-base text-foreground'>FAQ</SidebarGroupLabel>
					<SidebarMenu role='menu' aria-label='Eclipse Mosquitto'>
						{menuGroups.faqs.map((item) => (
							<SidebarMenuLink key={item.hash} {...item} />
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			{/* <SidebarRail /> */}
		</Sidebar>
	)
}

const SidebarMenuLink: React.FC<any> = ({ hash, href, title, viewTransition }) => {
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { openMobile, setOpenMobile } = useSidebar()
	const { hash: $hash } = useLocation()
	const { event$ } = usePageContext()

	const [isInViewport, setIsInViewport] = useState<boolean>(false)

	event$.useSubscription((value) => {
		setIsInViewport(value === hash)
	})

	return (
		<SidebarMenuItem
			role='menuitem'
			onClick={() => {
				if (isSmallScreen) setOpenMobile(!openMobile)
			}}>
			<SidebarMenuButton asChild size='default'>
				{href ? (
					<a
						href={href}
						target='_blank'
						rel='noreferrer'
						className='text-muted-foreground hover:text-primary-foreground'>
						{title} <Icon name='ArrowUpRight' />
					</a>
				) : (
					<Link
						hash={hash}
						preload='intent'
						viewTransition={viewTransition}
						className={cn(
							'transition-colors duration-200 ease-in-out',
							isInViewport
								? 'text-active'
								: hash === $hash
									? 'text-primary underline underline-offset-4'
									: 'text-muted-foreground'
						)}>
						{title}
					</Link>
				)}
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

export default NavSidebar
