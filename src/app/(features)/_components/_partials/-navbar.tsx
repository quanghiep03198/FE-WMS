import { Badge, Button, Div, Icon, Separator, Tooltip, Typography } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageDropdown } from '@/app/_components/_shared/-language-selector'
import NavUserControl from './-nav-user-controller'
import SearchDialog from './-search-dialog'
import ThemeToggle from '../../../_components/_shared/-theme-toggle'
import { NavBreadcrumb } from './-nav-breadcrumb'

type NavbarProps = {
	isCollapsed: boolean
	onCollapseStateChange: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed, onCollapseStateChange }) => {
	const [open, setOpen] = React.useState(false)
	const { t } = useTranslation()

	return (
		<>
			<Div as='header' className='sticky top-0 z-50 h-20 bg-background/80 p-3 backdrop-blur-sm'>
				<Div
					as='nav'
					className='flex items-center justify-between rounded border border-border bg-inherit px-3 py-2'>
					<Div className='flex items-center gap-x-4'>
						<Tooltip content={`${t('ns_common:theme')} (ctrl+b)`} contentProps={{ side: 'right' }}>
							<Button size='icon' variant='outline' onClick={() => onCollapseStateChange(!isCollapsed)}>
								<Icon name='Menu' />
							</Button>
						</Tooltip>
						<Separator orientation='vertical' className='h-5 w-1' />
						<NavBreadcrumb />
					</Div>

					<Div className='flex flex-1 items-center justify-end gap-x-2'>
						<Button variant='outline' className='basis-48 justify-between px-1' onClick={() => setOpen(!open)}>
							<Typography variant='small' className='inline-flex flex-1 items-center gap-x-2 px-2'>
								<Icon name='Search' />
								Search ...
							</Typography>

							<Badge variant='secondary' className='font-mono font-normal tracking-widest'>
								ctrl+k
							</Badge>
						</Button>

						<LanguageDropdown triggerProps={{ variant: 'outline' }} />
						<Tooltip
							content={`${t('ns_common:theme')} (ctrl+alt+t)`}
							triggerProps={{ asChild: false }}
							contentProps={{ side: 'bottom' }}>
							<ThemeToggle variant='outline' />
						</Tooltip>

						<NavUserControl />
					</Div>
				</Div>
			</Div>
			<SearchDialog open={open} onOpenChange={setOpen} />
		</>
	)
}

export default Navbar
