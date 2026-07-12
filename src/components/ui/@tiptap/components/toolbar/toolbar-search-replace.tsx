import {
	Button,
	Checkbox,
	Div,
	Icon,
	Input,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator,
	Typography
} from '@/components/ui'
import { cn } from '@common/utils/cn'
import { ArrowLeftIcon, ArrowRightIcon, Repeat, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEditorContext } from '../../context/editor-context'

export function SearchAndReplaceToolbar() {
	const { editor } = useEditorContext()
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const [replacing, setReplacing] = useState(false)
	const [searchText, setSearchText] = useState('')
	const [replaceText, setReplaceText] = useState('')
	const [checked, setChecked] = useState(false)

	const results = editor?.storage?.searchAndReplace?.results
	const selectedResult = editor?.storage?.searchAndReplace?.selectedResult

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
		<Popover open={open} onOpenChange={setOpen} modal={false}>
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
				align='start'
				sideOffset={12}
				onCloseAutoFocus={(e) => {
					e.preventDefault()
				}}
				onEscapeKeyDown={() => {
					setOpen(false)
				}}
				className='relative flex w-[400px] px-3 py-2.5'>
				{!replacing ? (
					<Div className={cn('relative flex items-center gap-2')}>
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
					</Div>
				) : (
					<Div className={cn('relative w-full')}>
						<X
							onClick={() => {
								setOpen(false)
							}}
							className='absolute right-3 top-3 h-4 w-4 cursor-pointer'
						/>
						<Div className='flex w-full items-center gap-3'>
							<Button
								size='icon'
								className='size-7 rounded-full'
								variant='ghost'
								onClick={() => {
									setReplacing(false)
								}}>
								<ArrowLeftIcon className='h-4 w-4' />
							</Button>
							<Typography as='h2' className='text-sm font-medium'>
								{t('ns_common:editor.search_and_replace')}
							</Typography>
						</Div>

						<Div className='my-2 w-full'>
							<Div className='mb-3'>
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
							</Div>
							<Div className='mb-2'>
								<Label className='text-gray-11 mb-1 text-xs'>{t('ns_common:editor.replace_with')}</Label>
								<Input
									className='w-full'
									value={replaceText}
									onChange={(e) => {
										setReplaceText(e.target.value)
									}}
									placeholder={t('ns_common:editor.replace') + '...'}
								/>
							</Div>
							<Div className='mt-3 flex items-center space-x-2'>
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
							</Div>
						</Div>

						<Div className='actions mt-6 flex items-center justify-between'>
							<Div className='flex items-center gap-2'>
								<Button onClick={selectPrevious} size='icon' className='h-7 w-7' variant='secondary'>
									<ArrowLeftIcon className='h-4 w-4' />
								</Button>
								<Button onClick={selectNext} size='icon' className='h-7 w-7' variant='secondary'>
									<ArrowRightIcon className='h-4 w-4' />
								</Button>
							</Div>

							<Div className='main-actions flex items-center gap-2'>
								<Button size='sm' className='h-7 px-3 text-xs' variant='secondary' onClick={replaceAll}>
									{t('ns_common:editor.replace_all')}
								</Button>
								<Button onClick={replace} size='sm' className='h-7 px-3 text-xs'>
									{t('ns_common:editor.replace')}
								</Button>
							</Div>
						</Div>
					</Div>
				)}
			</PopoverContent>
		</Popover>
	)
}
