import { PresetBreakPoints, RequestHeaders } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
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
import axiosInstance from '@/configs/axios.config'
import { useMutation } from '@tanstack/react-query'
import { useResetState } from 'ahooks'
import { filesize } from 'filesize'
import React, { useCallback, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { v4 as uuid } from 'uuid'

type UploadDataFileDialogProps = {
	station: string
	maxFiles: number
}

const UploadDataFileDialog: React.FC<UploadDataFileDialogProps> = ({ station, maxFiles }) => {
	const { t } = useTranslation()
	const isExtraLargeScreen = useMediaQuery(PresetBreakPoints.ULTIMATE_LARGE)
	const [isDragActive, setDragActive] = useState(false)
	const [files, setFiles, resetFiles] = useResetState<File[]>([])
	const { user } = useAuth()
	const inputRef = useRef<HTMLInputElement>(null)
	const dropFileAreaId = useId()

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async () => {
			const formData = new FormData()
			/**
			 * Station prefix is used to identify the station where the file is uploaded.
			 * 'CUS' prefix represents the customer's EPC data.
			 */
			const STATION_PREFIX = 'CUS'
			formData.append('station', `${STATION_PREFIX}_${user.company_code}_${station}`)
			files.forEach((file) => formData.append('files', file, uuid()))
			return await axiosInstance.post(`/rfid/upload-data`, formData, {
				headers: {
					[RequestHeaders.CONTENT_TYPE]: 'multipart/form-data'
				}
			})
		},
		onMutate: () => {
			return toast.loading(t('ns_common:notification.processing_request'))
		},
		onSuccess: (_data, _variables, id) => {
			resetFiles()
			inputRef.current.value = ''
			toast.success(t('ns_common:notification.success'), { id })
		},
		onError: (_data, _variables, id) => {
			toast.error(t('ns_common:notification.error'), { id })
		}
	})

	const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		if (files.length >= maxFiles) {
			toast.warning(`You can only upload ${maxFiles} files at a time`)
			return
		}
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

	const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault()
		e.stopPropagation()
		if (files.length < maxFiles) setDragActive(true)
	}, [])

	const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)
	}, [])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (files.length >= maxFiles) {
			e.preventDefault()
			return
		}
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
					<DialogTitle>{t('ns_common:titles.import_data')}</DialogTitle>
					<DialogDescription>{t('ns_common:descriptions.import_data')}</DialogDescription>
				</DialogHeader>
				<DroppableArea
					htmlFor={dropFileAreaId}
					data-drag-active={isDragActive}
					aria-disabled={files.length >= maxFiles}
					onDrop={onDrop}
					onDragOver={onDragOver}
					onDragLeave={onDragLeave}>
					<Input
						id={dropFileAreaId}
						ref={inputRef}
						type='file'
						accept='.csv'
						multiple
						className='hidden'
						onChange={handleFileChange}
					/>
					<Icon name='CloudUpload' size={40} strokeWidth={1} stroke={'hsl(var(--active))'} />
					<Typography color='muted'>{t('ns_common:actions.csv_upload')}</Typography>
				</DroppableArea>
				{files.length > 0 && (
					<ScrollShadow className='max-h-32'>
						{files.map((file, idx) => (
							<FileItem
								key={file.name + idx}
								file={file}
								disabled={isPending}
								onRemove={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
							/>
						))}
					</ScrollShadow>
				)}
				<Div className='flex items-center justify-between'>
					<Typography variant='small' color='muted'>
						{t('ns_common:descriptions.chosen_files', {
							qty: `${files.length}/${maxFiles}`,
							defaultValue: `${files.length}/${maxFiles}`
						})}
					</Typography>
					<Typography variant='small' color='muted'>
						{filesize(files.map((item) => item.size).reduce<number>((acc, curr) => acc + curr, 0))}
					</Typography>
				</Div>
				<Button disabled={isPending || files.length === 0} onClick={() => mutateAsync()}>
					<Icon
						name={isPending ? 'LoaderCircle' : 'Upload'}
						className={cn({ 'animate-[spin_1s_linear_infinite]': isPending })}
						role='presentation'
					/>{' '}
					Upload
				</Button>
			</DialogContent>
		</Dialog>
	)
}

const FileItem: React.FC<{ file: File; disabled: boolean; onRemove: () => void }> = ({ file, disabled, onRemove }) => {
	return (
		<Div
			aria-disabled={disabled}
			className='group flex flex-grow items-center gap-x-2 rounded px-3 py-1.5 transition-colors duration-200 aria-disabled:pointer-events-none aria-disabled:opacity-80 hover:bg-accent'>
			<Icon name='File' />
			<Typography variant='small' className='line-clamp-1 block flex-1'>
				{file.name}
			</Typography>
			<Typography variant='small' color='muted'>
				{filesize(file.size, { round: 2 })}
			</Typography>
			<button
				className='opacity-0 group-hover:opacity-100 hover:opacity-80'
				disabled={disabled}
				onClick={() => onRemove()}>
				<Icon name='X' size={14} />
			</button>
		</Div>
	)
}

const DroppableArea = tw.label`mt-6 flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-6 transition-colors h-48 duration-200 data-[drag-active=true]:border-primary aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-80`

export default UploadDataFileDialog
