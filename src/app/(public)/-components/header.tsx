import AppLogo from '@/app/-components/-shared/app-logo'
import { LanguageDropdown, LanguageSelect } from '@/app/-components/-shared/language-selector'
import ThemeDropdownSelect from '@/app/-components/-shared/theme-dropdown-select'
import ThemeToggle from '@/app/-components/-shared/theme-toggle'
import { PresetBreakPoints } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import {
	Button,
	Div,
	Icon,
	Label,
	Separator,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
	buttonVariants
} from '@/components/ui'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { navigationConfig, usePageContext } from '../-contexts/page-context'

const Header: React.FunctionComponent = () => {
	return (
		<Div
			className={cn(
				'sticky top-0 z-50 h-20 border-b bg-background/90 p-6 bg-blend-screen backdrop-blur-2xl sm:p-4'
			)}>
			<Div
				as='nav'
				className='mx-auto flex h-full max-w-7xl items-center justify-between xxl:max-w-8xl'
				aria-label='Global'>
				<Div className='inline-flex items-center gap-x-2'>
					<NavHeaderDrawerMenu />
					<Link to='/' className='group' data-state='expanded'>
						<AppLogo />
					</Link>
				</Div>
				<NavHeaderMenu />
				<NavHeaderActions />
			</Div>
		</Div>
	)
}

const NavHeaderMenu: React.FC = () => {
	const pageContext = usePageContext()

	return (
		<Div className='flex flex-1 items-center justify-center gap-x-1 rounded-full sm:hidden md:hidden'>
			{navigationConfig.map((item, index) => (
				<Button
					variant='link'
					key={index}
					onClick={() => {
						if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(index)
					}}
					className={cn(
						'text-base text-muted-foreground transition-[colors,opacity] duration-500 hover:no-underline hover:opacity-80',
						pageContext?.activeMenu === item.href && 'text-[var(--primary-alt)]'
					)}>
					{item.title}
				</Button>
			))}
		</Div>
	)
}

const NavHeaderActions: React.FC = () => {
	const { isAuthenticated } = useAuth()
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1023px)')

	return (
		<Div className='flex items-center justify-end gap-x-1 self-center *:text-base sm:gap-0 md:gap-0'>
			{!isSmallScreen && <ThemeToggle />}
			{!isSmallScreen && <LanguageDropdown />}
			{isAuthenticated ? (
				<Link
					to='/dashboard'
					className={buttonVariants({
						variant: 'ghost',
						className: 'gap-x-2'
					})}>
					Dashboard
					<ArrowRightIcon />
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
	)
}

const NavHeaderDrawerMenu: React.FC = () => {
	const pageContext = usePageContext()
	const [open, setOpen] = useState(false)
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

	useEffect(() => {
		if (!isSmallScreen) setOpen(false)
	}, [isSmallScreen])

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant='ghost' size='icon' className='hidden sm:inline-flex md:inline-flex'>
					<Icon name='Menu' />
				</Button>
			</SheetTrigger>
			<SheetContent className='max-w-sm'>
				<SheetHeader>
					<Link to='/' className='text-left'>
						<AppLogo />
					</Link>
				</SheetHeader>
				<Div className='space-y-6'>
					<Div className='flex flex-col items-stretch gap-y-1 py-4'>
						{navigationConfig.map((item, index) => (
							<Button
								variant='ghost'
								className='justify-start'
								onClick={() => {
									if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(index)
									setOpen(!open)
								}}
								key={index}>
								{item.title}
							</Button>
						))}
					</Div>
					<Separator />
					<Div className='items-center gap-x-2 space-y-1.5'>
						<Div className='grid grid-cols-[35%_auto] items-center gap-x-6'>
							<Label className='inline-flex items-center gap-x-2'>
								<Icon name='Languages' className='size-4' />
								Language
							</Label>
							<LanguageSelect />
						</Div>
						<Div className='grid grid-cols-[35%_auto] items-center gap-x-6'>
							<Label className='inline-flex items-center gap-x-2'>
								<Icon name='SunMoon' className='size-4' />
								Theme
							</Label>
							<ThemeDropdownSelect />
						</Div>
					</Div>
				</Div>
			</SheetContent>
		</Sheet>
	)
}

export default Header
