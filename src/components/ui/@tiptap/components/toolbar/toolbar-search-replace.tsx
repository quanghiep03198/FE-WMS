/* eslint-disable */
// @ts-nocheck
import { ArrowLeftIcon, ArrowRightIcon, Repeat, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/common/utils/cn'
import {
	Button,
	Checkbox,
	Icon,
	Input,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator,
	Typography
} from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useEditorContext } from '../../context/editor-context'
import { type SearchAndReplaceStorage } from '../../extensions/search-and-replace.extension'

export function SearchAndReplaceToolbar() {
	const { editor } = useEditorContext()
	const { t } = useTranslation()

	const [open, setOpen] = useState(false)
	const [replacing, setReplacing] = useState(false)
	const [searchText, setSearchText] = useState('')
	const [replaceText, setReplaceText] = useState('')
	const [checked, setChecked] = useState(false)

	const results = editor?.storage?.searchAndReplace.results as SearchAndReplaceStorage['results']
	const selectedResult = editor?.storage?.searchAndReplace.selectedResult as SearchAndReplaceStorage['selectedResult']

	const replace = () => editor?.chain().replace().run()
	const replaceAll = () => editor?.chain().replaceAll().run()
	const selectNext = () => editor?.chain().selectNextResult().run()
	const selectPrevious = () => editor?.chain().selectPreviousResult().run()

	useEffect(() => {
		editor?.chain().setSearchTerm(searchText).run()
	}, [searchText, editor])

	useEffect(() => {
		editor?.chain().setReplaceTerm(replaceText).run()
	}, [replaceText, editor])

	useEffect(() => {
		editor?.chain().setCaseSensitive(checked).run()
	}, [checked, editor])

	useEffect(() => {
		if (!open) {
			setReplaceText('')
			setSearchText('')
			setReplacing(false)
		}
	}, [open])

	return (
		<Popover open={open}>
			<PopoverTrigger disabled={!editor} asChild>
				<Button
					variant='ghost'
					size='sm'
					onClick={() => {
						setOpen(!open)
					}}
					className={cn('font-normal')}>
					<Icon name='Search' />
					{t('ns_common:editor.search_and_replace')}
				</Button>
			</PopoverTrigger>

			<PopoverContent
				align='end'
				onCloseAutoFocus={(e) => {
					e.preventDefault()
				}}
				onEscapeKeyDown={() => {
					setOpen(false)
				}}
				className='relative flex w-[400px] px-3 py-2.5'>
				{!replacing ? (
					<div className={cn('relative flex items-center gap-1.5')}>
						<Input
							value={searchText}
							className='w-48'
							onChange={(e) => {
								setSearchText(e.target.value)
							}}
							placeholder={t('ns_common:actions.search') + '...'}
						/>
						<small>
							{results?.length === 0 ? selectedResult : selectedResult + 1}/{results?.length}
						</small>
						<Button onClick={selectPrevious} size='icon' variant='ghost' className='size-7'>
							<ArrowLeftIcon className='size-4' />
						</Button>
						<Button onClick={selectNext} size='icon' className='size-7' variant='ghost'>
							<ArrowRightIcon className='h-4 w-4' />
						</Button>
						<Separator orientation='vertical' className='mx-0.5 h-7' />
						<Button
							onClick={() => {
								setReplacing(true)
							}}
							size='icon'
							className='size-7'
							variant='ghost'>
							<Repeat className='h-4 w-4' />
						</Button>
						<Button
							onClick={() => {
								setOpen(false)
							}}
							size='icon'
							className='size-7'
							variant='ghost'>
							<X className='h-4 w-4' />
						</Button>
					</div>
				) : (
					<div className={cn('relative w-full')}>
						<X
							onClick={() => {
								setOpen(false)
							}}
							className='absolute right-3 top-3 h-4 w-4 cursor-pointer'
						/>
						<div className='flex w-full items-center gap-3'>
							<Button
								size='icon'
								className='size-7 rounded-full'
								variant='ghost'
								onClick={() => {
									setReplacing(false)
								}}>
								<ArrowLeftIcon className='h-4 w-4' />
							</Button>
							<h2 className='text-sm font-medium'>{t('ns_common:editor.search_and_replace')}</h2>
						</div>

						<div className='my-2 w-full'>
							<div className='mb-3'>
								<Label className='text-gray-11 mb-1 text-xs'>{t('ns_common:actions.search')}</Label>
								<Input
									value={searchText}
									onChange={(e) => {
										setSearchText(e.target.value)
									}}
									placeholder={t('ns_common:actions.search') + '...'}
								/>
								<Typography variant='small' className='text-xs'>
									{results?.length === 0 ? selectedResult : selectedResult + 1}/{results?.length}
								</Typography>
							</div>
							<div className='mb-2'>
								<Label className='text-gray-11 mb-1 text-xs'>{t('ns_common:editor.replace_with')}</Label>
								<Input
									className='w-full'
									value={replaceText}
									onChange={(e) => {
										setReplaceText(e.target.value)
									}}
									placeholder={t('ns_common:editor.replace') + '...'}
								/>
							</div>
							<div className='mt-3 flex items-center space-x-2'>
								<Checkbox
									checked={checked}
									onCheckedChange={(checked: boolean) => {
										setChecked(checked)
									}}
									id='match_case'
								/>
								<Label
									htmlFor='match_case'
									className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
									{t('ns_common:editor.match_case')}
								</Label>
							</div>
						</div>

						<div className='actions mt-6 flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<Button onClick={selectPrevious} size='icon' className='h-7 w-7' variant='secondary'>
									<ArrowLeftIcon className='h-4 w-4' />
								</Button>
								<Button onClick={selectNext} size='icon' className='h-7 w-7' variant='secondary'>
									<ArrowRightIcon className='h-4 w-4' />
								</Button>
							</div>

							<div className='main-actions flex items-center gap-2'>
								<Button size='sm' className='h-7 px-3 text-xs' variant='secondary' onClick={replaceAll}>
									{t('ns_common:editor.replace_all')}
								</Button>
								<Button onClick={replace} size='sm' className='h-7 px-3 text-xs'>
									{t('ns_common:editor.replace')}
								</Button>
							</div>
						</div>
					</div>
				)}
			</PopoverContent>
		</Popover>
	)
}
