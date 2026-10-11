import { Div } from '@components/customs/div'
import { LanguageDropdown } from '@components/shared/language-selector'
import { Separator } from '@components/ui/separator'
import useAuth from '@hooks/use-auth'
import { useKeyPress } from 'ahooks'
import React from 'react'
import ThemeToggle from '../../shared/theme-toggle'
import FullScreenToggler from './full-screen-toggler'
import NavBreadcrumb from './nav-breadcrumb'
import NavSidebarToggler from './nav-sidebar-toggler'
import NavUserControl from './nav-user-controller'
import SearchDialog from './search-dialog'

const Navbar: React.FC = () => {
	const { logout } = useAuth()

	useKeyPress('ctrl.q', (e) => {
		e.preventDefault()
		logout()
	})

	return (
		<Div
			as='header'
			className='bg-background xxl:border-0 xxl:px-6 xxl:py-2 xxl:shadow-none sticky top-0 z-20 flex h-(--header-height) items-center border-b md:px-2 md:shadow-sm lg:px-4 lg:shadow-sm xl:px-4'
			role='menubar'>
			<Div
				as='nav'
				className='xxl:border xxl:px-3 flex w-full basis-full items-center gap-x-2 rounded-md border-0 py-2'
				role='menu'>
				<NavSidebarToggler />
				<Separator className='mx-2 h-5 w-1 sm:hidden md:hidden' orientation='vertical' />
				<NavBreadcrumb />
				<SearchDialog />
				<FullScreenToggler />
				<LanguageDropdown triggerProps={{ variant: 'ghost' }} />
				<ThemeToggle />
				<NavUserControl />
			</Div>
		</Div>
	)
}

export default Navbar
