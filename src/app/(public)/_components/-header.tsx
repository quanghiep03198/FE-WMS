import AppLogo from '@/app/_components/_shared/-app-logo'
import { LanguageDropdown, LanguageSelect } from '@/app/_components/_shared/-language-selector'
import ThemeDropdownSelect from '@/app/_components/_shared/-theme-dropdown-select'
import ThemeToggle from '@/app/_components/_shared/-theme-toggle'
import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
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
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { navigationConfig, usePageContext } from '../_contexts/-page-context'

const Header: React.FunctionComponent = () => {
	return (
		<Div className='sticky top-0 z-20 h-20 border-b bg-opacity-90 bg-gradient-to-b from-background/90 via-background/60 to-background/30 backdrop-blur-sm'>
			<Div
				as='nav'
				className='mx-auto flex h-full max-w-7xl items-center justify-between p-6 sm:p-4 xxl:max-w-8xl'
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
	const { activeMenu, handleMenuClick } = usePageContext()

	return (
		<Div className='flex flex-1 items-center justify-center gap-x-2 rounded-full text-sm font-medium sm:hidden md:hidden'>
			{navigationConfig.map((item, index) => (
				<Button
					variant='link'
					key={index}
					onClick={() => handleMenuClick(index)}
					className={cn(activeMenu === item.href && 'underline')}>
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
		<Div className='flex items-center justify-end gap-x-1 self-center sm:gap-0 md:gap-0'>
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
	)
}

const NavHeaderDrawerMenu: React.FC = () => {
	const { handleMenuClick } = usePageContext()
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
									handleMenuClick(index)
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
							<Label className='inline-flex items-center gap-x-2 text-sm'>
								<Icon name='Languages' className='size-4' />
								Language
							</Label>
							<LanguageSelect />
						</Div>
						<Div className='grid grid-cols-[35%_auto] items-center gap-x-6'>
							<Label className='inline-flex items-center gap-x-2 text-sm'>
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
