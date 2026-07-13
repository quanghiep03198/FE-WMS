import { LanguageDropdown } from '@/components/shared/language-selector'
import { Div, Separator } from '@/components/ui'
import useAuth from '@hooks/use-auth'
import { useKeyPress } from 'ahooks'
import React from 'react'
import ThemeToggle from '../../../../components/shared/theme-toggle'
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
			role='menubar'
			className='sticky top-0 z-20 flex h-[var(--header-height)] items-center border-b bg-background md:px-2 md:shadow-sm lg:px-4 lg:shadow-sm xl:px-4 xxl:border-0 xxl:px-6 xxl:py-2 xxl:shadow-none'>
			<Div
				as='nav'
				role='menu'
				className='flex w-full basis-full items-center gap-x-2 rounded-md border-0 py-2 xxl:border xxl:px-3'>
				<NavSidebarToggler />
				<Separator orientation='vertical' className='mx-2 h-5 w-1 sm:hidden md:hidden' />
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
