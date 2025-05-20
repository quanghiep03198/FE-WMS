import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	Icon,
	Input,
	Typography
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import React, { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

const UploadDataFileDialog: React.FC = () => {
	const isExtraLargeScreen = useMediaQuery(PresetBreakPoints.ULTIMATE_LARGE)

	const [dragActive, setDragActive] = useState(false)
	const [files, setFiles] = useState<File[]>([])
	const inputRef = useRef<HTMLInputElement>(null)

	const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)
		const shouldAcceptDroppedFile = e.dataTransfer.files.item(0).type === 'text/csv'
		if (!shouldAcceptDroppedFile) {
			toast.warning('Please select a CSV file')
			return
		}

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
			e.dataTransfer.clearData()
		}
	}, [])

	const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(true)
	}, [])

	const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)
	}, [])

	const handleClick = () => {
		inputRef.current?.click()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
		}
	}

	return (
		<Dialog>
			<DialogTrigger
				className={cn(buttonVariants({ size: isExtraLargeScreen ? 'default' : 'lg', className: 'w-full' }))}>
				<Icon name='Upload' role='presentation' size={18} />
				Upload
			</DialogTrigger>
			<DialogContent className='max-w-xl'>
				<DialogHeader>
					<DialogTitle>Upload offline data</DialogTitle>
					<DialogDescription>
						Upload CSV file to import offline data. The file must be in correct format.
					</DialogDescription>
				</DialogHeader>
				<Div
					className={`mt-6 flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed p-6 transition-colors duration-200 ${
						dragActive && 'border-primary bg-accent/30'
					}`}
					onClick={handleClick}
					onDrop={onDrop}
					onDragOver={onDragOver}
					onDragLeave={onDragLeave}>
					<Input
						ref={inputRef}
						type='file'
						accept='.csv'
						multiple
						className='hidden'
						onChange={handleFileChange}
					/>
					<Icon name='CloudUpload' size={48} strokeWidth={1.25} stroke='hsl(var(--muted-foreground))' />
					<Typography color='muted'>
						<Typography as='span' className='font-medium'>
							Click to upload
						</Typography>{' '}
						or drag and drop{' '}
						<Typography as='span' className='font-medium'>
							CSV
						</Typography>{' '}
						file
					</Typography>
				</Div>

				{files.length > 0 && (
					<ScrollShadow className='max-h-32'>
						{files.map((file, idx) => (
							<FileItem
								key={file.name + idx}
								fileName={file.name}
								onRemove={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
							/>
						))}
					</ScrollShadow>
				)}

				<Typography variant='small' color='muted'>
					{files.length} chosen file(s)
				</Typography>
				<Button>
					<Icon name='Upload' role='presentation' /> Upload
				</Button>
			</DialogContent>
		</Dialog>
	)
}

const FileItem: React.FC<{ fileName: string; onRemove: () => void }> = ({ fileName, onRemove }) => {
	return (
		<Div className='flex flex-grow items-center gap-x-2 rounded px-3 py-1.5 transition-colors duration-200 hover:bg-accent'>
			<Icon name='Paperclip' />
			<Typography variant='small' className='flex-1'>
				{fileName}
			</Typography>
			<button className='hover:opacity-80' onClick={() => onRemove()}>
				<Icon name='X' size={14} />
			</button>
		</Div>
	)
}

export default UploadDataFileDialog
