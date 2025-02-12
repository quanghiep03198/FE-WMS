import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
	Dialog,
	Icon,
	Typography
} from '@/components/ui'
import { navigationConfig } from '@/configs/navigation.config'
import { GearIcon, PersonIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { useKeyPress, useResetState } from 'ahooks'
import { debounce } from 'lodash'
import React, { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type SearchDialogProps = Required<Pick<React.ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>>

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange: handleOpenChange }) => {
	const { t } = useTranslation('ns_common')
	const [searchTerm, setSearchTerm, resetSearchTerm] = useResetState<string>('')

	useKeyPress('ctrl.k', (e) => {
		e.preventDefault()
		handleOpenChange(true)
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
		<CommandDialog open={open} onOpenChange={handleOpenChange}>
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
										<Link to={item.path} onClick={() => handleOpenChange(false)}>
											<Icon name={item.icon} />
											{t(item.title, { defaultValue: item.title })}
											<CommandShortcut>{String(item.keybinding).split('.').join('+')}</CommandShortcut>
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
											onClick={() => handleOpenChange(false)}>
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
		</CommandDialog>
	)
}

export default SearchDialog
