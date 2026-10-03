import { PresetBreakPoints } from '@common/constants/enums'
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
	Icon,
	Typography
} from '@components/ui'
import useMediaQuery from '@hooks/use-media-query'
import { Link } from '@tanstack/react-router'
import { useKeyPress, useResetState } from 'ahooks'
import { debounce } from 'lodash-es'
import React, { Fragment, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { menuGroups } from './nav-sidebar'

const SearchDialog: React.FC = () => {
	const { t } = useTranslation('ns_common')
	const [searchTerm, setSearchTerm, resetSearchTerm] = useResetState<string>('')
	const [open, setOpen] = React.useState<boolean>(false)
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

	useKeyPress('ctrl.k', (e) => {
		e.preventDefault()
		setOpen(true)
	})

	const filteredItems = Object.values(menuGroups)
		.flat()
		.filter((item) =>
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
				className='bg-background min-w-56 basis-56 gap-x-2 px-2 sm:min-w-fit sm:basis-auto'
				size={isSmallScreen ? 'icon' : 'default'}
				variant={isSmallScreen ? 'ghost' : 'outline'}
				onClick={() => setOpen(!open)}>
				<Icon name='Search' />
				<Typography className='sm:hidden' variant='small'>
					Search ...
				</Typography>
				<Badge className='ml-auto font-mono font-normal tracking-widest sm:hidden' variant='secondary'>
					ctrl+k
				</Badge>
			</Button>

			{createPortal(
				<CommandDialog open={open} onOpenChange={setOpen}>
					<Command shouldFilter={false}>
						<CommandInput
							className='h-9 items-center'
							placeholder='Type a command or search...'
							onValueChange={debounce((value) => setSearchTerm(value), 200)}
						/>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandList className='max-h-none sm:max-h-full'>
							{!searchTerm ? (
								<Fragment>
									<CommandGroup heading='RFID Agent'>
										{menuGroups.rfidAgent.map((item) => (
											<CommandItem asChild className='h-8 text-sm' key={item.hash} value={item.hash}>
												<Link hash={item.hash} onClick={() => setOpen(false)}>
													{t(item.title, { defaultValue: item.title })}
												</Link>
											</CommandItem>
										))}
									</CommandGroup>
									<CommandSeparator />
									<CommandGroup heading='Eclipse Mosquitto'>
										{menuGroups.mosquitto.map((item) => (
											<CommandItem asChild className='h-8 text-sm' key={item.hash} value={item.hash}>
												<Link hash={item.hash} onClick={() => setOpen(false)}>
													{t(item.title, { defaultValue: item.title })}
												</Link>
											</CommandItem>
										))}
									</CommandGroup>
								</Fragment>
							) : (
								filteredItems.length > 0 && (
									<CommandGroup heading={`${filteredItems.length} results`}>
										{filteredItems.map((item) => (
											<CommandItem asChild className='h-8 text-sm' key={item.hash} value={item.hash}>
												<Link hash={item.hash} onClick={() => setOpen(false)}>
													{t(item.title, { defaultValue: item.title })}
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
