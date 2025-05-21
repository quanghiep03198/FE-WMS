import { useGetRFIDDevices } from '@/app/(features)/_apis/use-device.api'
import { PresetBreakPoints, RequestHeaders } from '@/common/constants/enums'
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
	// FormField,
	// Form as FormProvider,
	Icon,
	Input,
	Typography
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import axiosInstance from '@/configs/axios.config'
import { useResetState } from 'ahooks'
import { filesize } from 'filesize'
import { debounce } from 'lodash'
import React, { useCallback, useId, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'twin.macro'
import { v4 as uuid } from 'uuid'

const MAX_FILES: number = 10

const UploadDataFileDialog: React.FC = () => {
	const { t } = useTranslation()
	const isExtraLargeScreen = useMediaQuery(PresetBreakPoints.ULTIMATE_LARGE)
	const [isDragActive, setDragActive] = useState(false)
	const [files, setFiles, resetFiles] = useResetState<File[]>([])
	const [isPending, setIsPending] = useState<boolean>(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const selectId = useId()
	const dropFileAreaId = useId()
	const form = useForm()

	const { data: devices } = useGetRFIDDevices()

	console.log('isPending :>> ', isPending)

	const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		if (files.length >= MAX_FILES) {
			toast.warning('You can only upload 10 files at a time')
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
		setDragActive(true)
	}, [])

	const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)
	}, [])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (files.length >= MAX_FILES) {
			e.preventDefault()
			return
		}
		if (e.target.files) {
			setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
		}
	}

	const handleUploadFile = async () => {
		const formData = new FormData()
		files.forEach((file) => formData.append('files', file, uuid()))
		setIsPending(true)
		const toastId = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await axiosInstance.post('/rfid/outbound/upload-data', formData, {
				headers: {
					[RequestHeaders.CONTENT_TYPE]: 'multipart/form-data'
				}
			})
			toast.success(t('ns_common:notification.success'), { id: toastId })
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastId })
		}

		toast.promise(
			axiosInstance.post('/rfid/outbound/upload-data', formData, {
				headers: {
					[RequestHeaders.CONTENT_TYPE]: 'multipart/form-data'
				}
			}),
			{
				loading: 'Uploading file ...',
				success: (response) => {
					if (inputRef.current) {
						inputRef.current.value = ''
						resetFiles()
					}
					console.log('response :>>', response)
					return 'File uploaded successfully'
				},
				error: (error) => {
					console.log('error :>>', error)
					return 'Failed to upload file'
				}
			}
		)
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

				<DroppableArea
					htmlFor={dropFileAreaId}
					data-active={isDragActive}
					onDrop={onDrop}
					onDragOver={onDragOver}
					onDragLeave={onDragLeave}>
					<Input
						ref={(e) => {
							inputRef.current = e
						}}
						id={dropFileAreaId}
						type='file'
						accept='.csv'
						multiple
						className='hidden'
						onChange={handleFileChange}
					/>
					<Icon name='CloudUpload' size={48} strokeWidth={1.25} stroke='hsl(var(--muted-foreground))' />
					<Typography color='muted'>Click to upload or drag and drop CSV files</Typography>
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
				<Typography variant='small' color='muted'>
					{files.length}/{MAX_FILES} chosen file(s)
				</Typography>
				<Button
					// disabled={isPending || files.length === 0}
					onClick={debounce(() => toast.info('Upload data'), 500)}>
					<Icon name='Upload' role='presentation' /> Upload
				</Button>
			</DialogContent>
		</Dialog>
	)
}

const FileItem: React.FC<{ file: File; disabled: boolean; onRemove: () => void }> = ({ file, disabled, onRemove }) => {
	return (
		<Div
			aria-disabled={disabled}
			className='flex flex-grow items-center gap-x-2 rounded px-3 py-1.5 transition-colors duration-200 aria-disabled:pointer-events-none aria-disabled:opacity-80 hover:bg-accent'>
			<Icon name='File' />
			<Typography variant='small'>{file.name}</Typography>
			<Typography variant='small' color='muted'>
				{filesize(file.size, { round: 2 })}
			</Typography>
			<button className='ml-auto hover:opacity-80' disabled={disabled} onClick={() => onRemove()}>
				<Icon name='X' size={14} />
			</button>
		</Div>
	)
}

export default UploadDataFileDialog

const DroppableArea = tw.label`mt-6 flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed p-6 transition-colors duration-200 data-[active=true]:border-primary`
const Form = tw.form`flex flex-col items-stretch gap-y-6`
