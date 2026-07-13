import SearchDialog from './search-dialog'

import { GithubIcon } from '@/components/icons'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
import ThemeToggle from '@/components/shared/theme-toggle'
import { Button, Icon, useSidebar } from '@/components/ui'
import useMediaQuery from '@hooks/use-media-query'

const GithubLinkButton: React.FC = () => {
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1023px)')
	return (
		<a href='https://github.com/quanghiep03198/rfid-agent' className='flex h-full items-center gap-x-2 font-medium'>
			<GithubIcon width={24} height={24} />
			{!isSmallScreen && (
				<>
					<span>Github</span>
					<Icon name='ArrowUpRight' />
				</>
			)}
		</a>
	)
}

const NavHeader: React.FC = () => {
	const isLargeScreen = useMediaQuery('(min-width: 1024px)')
	const { toggleSidebar } = useSidebar()

	return (
		<header className='sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background/80 px-6 py-2 backdrop-blur-sm sm:px-4'>
			<nav className='flex items-center gap-x-2'>
				{!isLargeScreen && (
					<Button variant='ghost' size='icon' onClick={() => toggleSidebar()}>
						<Icon name='Menu' />
					</Button>
				)}
				{isLargeScreen && <GithubLinkButton />}
			</nav>

			<nav className='ml-auto'>
				<ul className='flex flex-1 items-center gap-x-3 sm:gap-x-2'>
					<li>
						<SearchDialog />
					</li>
					{/* <li className='min-w-36 basis-36 sm:min-w-fit md:min-w-fit'>
						{!isLargeScreen ? <LanguageDropdown /> : <LanguageSelect />}
					</li> */}
					<li>{!isLargeScreen ? <ThemeToggle /> : <ThemeSwitcher />}</li>
					{!isLargeScreen && (
						<li>
							<GithubLinkButton />
						</li>
					)}
				</ul>
			</nav>
		</header>
	)
}

export default NavHeader
