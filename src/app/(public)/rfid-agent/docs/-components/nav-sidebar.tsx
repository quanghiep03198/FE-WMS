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
import { useTranslation } from 'react-i18next'

const menuGroups: Record<
	'rfidAgent' | 'mosquitto' | 'tutorials' | 'faqs',
	Array<{
		title: string
		hash?: string
		href?: string
	}>
> = {
	mosquitto: [
		{
			title: 'What is Eclipse Mosquitto?',
			hash: 'about-mosquitto'
		},
		{
			title: 'Why Eclipse Mosquitto needed?',
			hash: 'why-mosquitto'
		},
		{
			title: 'Installation',
			hash: 'mosquitto-installation'
		},
		{
			title: 'Configuration',
			hash: 'mosquitto-configuration'
		},
		{
			title: 'Learning Resources',
			href: 'https://mosquitto.org/'
		}
	],
	rfidAgent: [
		{
			title: 'Introduction',
			hash: 'about-rfid-agent'
		},
		{
			title: 'Why to use?',
			hash: 'why-to-rfid-agent'
		},
		{
			title: 'Installation',
			hash: 'rfid-agent-installation'
		},
		{
			title: 'Configuration',
			hash: 'rfid-agent-configuration'
		}
	],

	tutorials: [
		{
			title: 'Common issues',
			hash: 'faq-common-issues'
		},
		{
			title: 'Miscellaneous',
			hash: 'faq-miscellaneous'
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
	return (
		<Sidebar variant='sidebar' side='left' collapsible='none' className='border-r'>
			<SidebarHeader>
				<Link to='/rfid-agent' className='flex items-center gap-x-2 py-4 font-jetbrains'>
					<Icon name='Radio' size={40} strokeWidth={1} />
					<span className='animate-[shimmer_3s_linear_infinite_both] bg-[linear-gradient(75deg,hsl(var(--foreground)),45%,hsl(var(--muted-foreground)),50%,hsl(var(--foreground)))] bg-[length:200%_100%] bg-clip-text font-jetbrains text-base font-semibold leading-normal tracking-widest text-transparent dark:bg-[linear-gradient(75deg,hsl(var(--muted-foreground)),45%,hsl(var(--foreground)),50%,hsl(var(--muted-foreground)))]'>
						RFID Agent
					</span>
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
					<SidebarGroupLabel className='text-base text-foreground'>Tutorials</SidebarGroupLabel>
					<SidebarMenu role='menu' aria-label='Eclipse Mosquitto'>
						{menuGroups.tutorials.map((item) => (
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
	const { t } = useTranslation('ns_common')
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { openMobile, setOpenMobile } = useSidebar()
	const { hash: $hash } = useLocation()

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
						className={cn(hash === $hash ? 'bg-accent text-accent-foreground' : 'text-muted-foreground')}>
						{title}
					</Link>
				)}
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

export default NavSidebar
