import AppLogo from '@/app/_components/_shared/-app-logo'
import { LanguageDropdown } from '@/app/_components/_shared/-language-selector'
import ThemeToggle from '@/app/_components/_shared/-theme-toggle'
import useAuth from '@/common/hooks/use-auth'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	Button,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Tooltip,
	buttonVariants
} from '@/components/ui'
import { Link, useRouteContext } from '@tanstack/react-router'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const navigationLinks = [
	{
		title: 'Features',
		href: 'outstanding-features'
	},
	{
		title: 'Support',
		href: 'support'
	},
	{
		title: 'FAQs',
		href: 'faqs'
	}
]

const Header: React.FunctionComponent = () => {
	const { isAuthenticated } = useAuth()
	const { t } = useTranslation()

	return (
		<Div className='sticky top-0 z-20 h-16 border-b bg-gradient-to-r from-transparent via-background/95 to-transparent backdrop-blur-sm'>
			<Div
				as='nav'
				className='mx-auto flex h-full max-w-6xl items-center justify-between p-6 sm:p-4 xxl:max-w-8xl'
				aria-label='Global'>
				<MenuDropdown />
				<Div className='flex items-center gap-x-2 sm:hidden md:hidden'>
					<Link to='/' className='text-xs font-bold transition-colors duration-200 hover:text-primary'>
						i-WMS
					</Link>
					<Badge variant='default' className='select-none'>
						{import.meta.env.VITE_APP_VERSION}
					</Badge>
				</Div>

				<Div className='flex flex-1 items-center justify-center gap-x-2 rounded-full text-sm font-medium sm:hidden md:hidden'>
					{navigationLinks.map((item, index) => (
						<Link
							resetScroll={false}
							hash={item.href}
							key={index}
							className={cn(
								buttonVariants({
									variant: 'link',
									className: 'text-foreground'
								})
							)}>
							{item.title}
						</Link>
					))}
				</Div>

				<Div className='flex items-center justify-end gap-x-1 self-center'>
					<Tooltip
						message={t('ns_common:actions.toggle_theme')}
						triggerProps={{ className: buttonVariants({ size: 'icon', variant: 'ghost' }) }}>
						<ThemeToggle />
					</Tooltip>

					<LanguageDropdown />

					{isAuthenticated ? (
						<Link
							to='/dashboard'
							className={buttonVariants({
								variant: 'ghost',
								className: 'gap-x-2'
							})}>
							Dashboard
							<Icon name='ArrowRight' size={12} />
						</Link>
					) : (
						<Link
							to='/login'
							className={buttonVariants({
								variant: 'ghost',
								className: 'gap-x-2'
							})}>
							Log in
							<Icon name='ArrowRight' size={12} />
						</Link>
					)}
				</Div>
			</Div>
		</Div>
	)
}

function MenuDropdown() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon' className='hidden sm:inline-flex md:inline-flex'>
					<Icon name='Menu' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start' className='w-60'>
				<DropdownMenuLabel asChild>
					<Link to='/'>
						<AppLogo />
					</Link>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{navigationLinks.map((item, index) => (
					<DropdownMenuItem asChild key={index}>
						<Link hash={item.href}>{item.title}</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default memo(Header)
