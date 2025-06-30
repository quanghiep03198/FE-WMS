import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import {
	Badge,
	Button,
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
	Icon,
	Typography
} from '@/components/ui'
import { navigationConfig } from '@/configs/navigation.config'
import { GearIcon, PersonIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { useKeyPress, useResetState } from 'ahooks'
import { debounce } from 'lodash'
import React, { Fragment, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

const SearchDialog: React.FC = () => {
	const { t } = useTranslation('ns_common')
	const [searchTerm, setSearchTerm, resetSearchTerm] = useResetState<string>('')
	const [open, setOpen] = React.useState<boolean>(false)
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

	useKeyPress('ctrl.k', (e) => {
		e.preventDefault()
		setOpen(true)
	})

	const filteredItems = navigationConfig.filter((item) =>
		String(t(item.title, { defaultValue: item.title }))
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	)

	useEffect(() => {
		if (!open) resetSearchTerm()
	}, [open])

	return (
		<Fragment>
			<Button
				variant={isSmallScreen ? 'ghost' : 'outline'}
				size={isSmallScreen ? 'icon' : 'default'}
				className='basis-56 gap-x-2 px-2 sm:basis-auto'
				onClick={() => setOpen(!open)}>
				<Icon name='Search' />
				<Typography variant='small' className='sm:hidden'>
					Search ...
				</Typography>
				<Badge variant='secondary' className='ml-auto font-mono font-normal tracking-widest sm:hidden'>
					ctrl+k
				</Badge>
			</Button>

			{createPortal(
				<CommandDialog open={open} onOpenChange={setOpen}>
					<Command shouldFilter={false}>
						<CommandInput
							placeholder='Type a command or search...'
							className='h-9 items-center'
							onValueChange={debounce((value) => setSearchTerm(value), 200)}
						/>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandList className='scrollbar sm:max-h-full xxl:max-h-none'>
							{!searchTerm ? (
								<Fragment>
									<CommandGroup heading='Suggestions'>
										{navigationConfig.slice(0, 5).map((item) => (
											<CommandItem asChild className='text-sm' key={item.id}>
												<Link to={item.path} onClick={() => setOpen(false)}>
													<Icon name={item.icon} />
													{t(item.title, { defaultValue: item.title })}
													{item.keybinding && (
														<CommandShortcut>
															{String(item.keybinding).split('.').join('+')}
														</CommandShortcut>
													)}
												</Link>
											</CommandItem>
										))}
									</CommandGroup>
									<CommandSeparator />
									<CommandGroup heading='Settings'>
										<CommandItem asChild className=''>
											<Link to='/preferences/account'>
												<PersonIcon />
												<Typography>{t('ns_common:navigation.profile')}</Typography>
												<CommandShortcut>ctrl+alt+P</CommandShortcut>
											</Link>
										</CommandItem>
										<CommandItem asChild className=''>
											<Link to='/preferences/appearance-settings'>
												<GearIcon />
												<Typography>{t('ns_common:navigation.settings')}</Typography>
												<CommandShortcut>ctrl+alt+S</CommandShortcut>
											</Link>
										</CommandItem>
									</CommandGroup>
								</Fragment>
							) : (
								filteredItems.length > 0 && (
									<CommandGroup heading={`${filteredItems.length} results`}>
										{filteredItems.map((item) => (
											<CommandItem className='h-8' key={item.id} asChild>
												<Link
													className='flex items-center gap-x-2'
													to={item.path}
													onClick={() => setOpen(false)}>
													<Icon name={item.icon} />
													{t(item.title, { defaultValue: item.title })}
													<CommandShortcut>{String(item.keybinding).split('.').join('+')}</CommandShortcut>
												</Link>
											</CommandItem>
										))}
									</CommandGroup>
								)
							)}
						</CommandList>
					</Command>
				</CommandDialog>,
				document.body
			)}
		</Fragment>
	)
}

export default SearchDialog
