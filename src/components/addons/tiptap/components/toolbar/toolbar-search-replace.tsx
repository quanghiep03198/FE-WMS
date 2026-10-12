import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { Icon } from '@components/ui/icon'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { Separator } from '@components/ui/separator'
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
		<Popover modal={false} open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild disabled={!editor}>
				<Button
					className={cn('font-normal')}
					size='sm'
					variant='ghost'
					onClick={() => {
						setOpen(!open)
					}}>
					<Icon name='Search' />
					{t('ns_common:editor.search_and_replace')}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align='start'
				className='relative flex w-100 px-3 py-2.5'
				sideOffset={12}
				onCloseAutoFocus={(e) => {
					e.preventDefault()
				}}
				onEscapeKeyDown={() => {
					setOpen(false)
				}}>
				{!replacing ? (
					<Div className={cn('relative flex items-center gap-2')}>
						<Input
							className='w-48'
							placeholder={t('ns_common:actions.search') + '...'}
							value={searchText}
							onChange={(e) => {
								setSearchText(e.target.value)
							}}
						/>
						<small>
							{results?.length === 0 ? selectedResult : selectedResult + 1}/{results?.length}
						</small>
						<Button className='size-7' size='icon' variant='ghost' onClick={selectPrevious}>
							<ArrowLeftIcon className='size-4' />
						</Button>
						<Button className='size-7' size='icon' variant='ghost' onClick={selectNext}>
							<ArrowRightIcon className='h-4 w-4' />
						</Button>
						<Separator className='mx-0.5 h-7' orientation='vertical' />
						<Button
							className='size-7'
							size='icon'
							variant='ghost'
							onClick={() => {
								setReplacing(true)
							}}>
							<Repeat className='h-4 w-4' />
						</Button>
						<Button
							className='size-7'
							size='icon'
							variant='ghost'
							onClick={() => {
								setOpen(false)
							}}>
							<X className='h-4 w-4' />
						</Button>
					</Div>
				) : (
					<Div className={cn('relative w-full')}>
						<X
							className='absolute top-3 right-3 h-4 w-4 cursor-pointer'
							onClick={() => {
								setOpen(false)
							}}
						/>
						<Div className='flex w-full items-center gap-3'>
							<Button
								className='size-7 rounded-full'
								size='icon'
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
									placeholder={t('ns_common:actions.search') + '...'}
									value={searchText}
									onChange={(e) => {
										setSearchText(e.target.value)
									}}
								/>
								<Typography className='text-xs' variant='small'>
									{results?.length === 0 ? selectedResult : selectedResult + 1}/{results?.length}
								</Typography>
							</Div>
							<Div className='mb-2'>
								<Label className='text-gray-11 mb-1 text-xs'>{t('ns_common:editor.replace_with')}</Label>
								<Input
									className='w-full'
									placeholder={t('ns_common:editor.replace') + '...'}
									value={replaceText}
									onChange={(e) => {
										setReplaceText(e.target.value)
									}}
								/>
							</Div>
							<Div className='mt-3 flex items-center space-x-2'>
								<Checkbox
									checked={checked}
									id='match_case'
									onCheckedChange={(checked: boolean) => {
										setChecked(checked)
									}}
								/>
								<Label
									className='text-xs leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
									htmlFor='match_case'>
									{t('ns_common:editor.match_case')}
								</Label>
							</Div>
						</Div>

						<Div className='actions mt-6 flex items-center justify-between'>
							<Div className='flex items-center gap-2'>
								<Button className='h-7 w-7' size='icon' variant='secondary' onClick={selectPrevious}>
									<ArrowLeftIcon className='h-4 w-4' />
								</Button>
								<Button className='h-7 w-7' size='icon' variant='secondary' onClick={selectNext}>
									<ArrowRightIcon className='h-4 w-4' />
								</Button>
							</Div>

							<Div className='main-actions flex items-center gap-2'>
								<Button className='h-7 px-3 text-xs' size='sm' variant='secondary' onClick={replaceAll}>
									{t('ns_common:editor.replace_all')}
								</Button>
								<Button className='h-7 px-3 text-xs' size='sm' onClick={replace}>
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
