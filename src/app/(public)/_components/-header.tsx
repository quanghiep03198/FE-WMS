import AppLogo from '@/app/_components/_shared/-app-logo'
import { LanguageDropdown } from '@/app/_components/_shared/-language-selector'
import ThemeToggle from '@/app/_components/_shared/-theme-toggle'
import { cn } from '@/common/utils/cn'
import { AuthContext } from '@/components/providers/auth-provider'
import {
	Badge,
	Div,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Typography,
	buttonVariants
} from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { memo, useContext } from 'react'

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
	const { user } = useContext(AuthContext)

	return (
		<Div className='sticky top-0 z-10 h-16 border-b border-border bg-background/90 backdrop-blur-sm'>
			<Div
				as='nav'
				className='mx-auto flex h-full max-w-7xl items-center justify-between p-6 sm:p-4 xxl:max-w-8xl'
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
					<ThemeToggle />
					<LanguageDropdown />
					{user ? (
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
