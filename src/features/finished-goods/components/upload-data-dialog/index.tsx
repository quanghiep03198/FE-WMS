import type { FactoryCode } from '@common/constants/enums'
import { PresetBreakPoints, RequestHeaders } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import env from '@common/utils/env'
import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Button, buttonVariants } from '@components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@components/ui/dialog'
import { Icon } from '@components/ui/icon'
import { Input } from '@components/ui/input'
import axiosInstance from '@configs/axios.config'
import useAuth from '@hooks/use-auth'
import useMediaQuery from '@hooks/use-media-query'
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
	const [isDragActive, setIsDragActive] = useState(false)
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
			formData.append('station', `${STATION_PREFIX}_${env<FactoryCode>('VITE_APP_TENANT')}_${station}`)
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

	const onDrop = useCallback(
		(e: React.DragEvent<HTMLLabelElement>) => {
			e.preventDefault()
			e.stopPropagation()
			if (e.dataTransfer.files.length > maxFiles || files.length > maxFiles) {
				toast.warning(`You can only upload ${maxFiles} files at a time`)
				return
			}
			setIsDragActive(false)
			const shouldAcceptDroppedFile = e.dataTransfer.files.item(0).type === 'text/csv'
			if (!shouldAcceptDroppedFile) {
				toast.warning('Please select a CSV file')
				return
			}

			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)])
				e.dataTransfer.clearData()
			}
		},
		[maxFiles, files]
	)

	const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault()
		e.stopPropagation()
		if (files.length < maxFiles) setIsDragActive(true)
	}, [])

	const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragActive(false)
	}, [])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		if (files.length > maxFiles || e.target.files.length > maxFiles) {
			toast.warning(`You can only upload ${maxFiles} files at a time`)
			return
		}
		if (e.target.files) {
			setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
		}
	}

	return (
		<Dialog>
			<DialogTrigger
				id='epc-data-upload-dialog-trigger'
				className={cn(
					buttonVariants({
						variant: 'secondary',
						size: isExtraLargeScreen ? 'default' : 'lg',
						className: 'w-full'
					})
				)}>
				<Icon name='Upload' size={18} />
				{t('ns_common:actions.upload')}
			</DialogTrigger>
			<DialogContent className='max-w-xl'>
				<DialogHeader>
					<DialogTitle>{t('ns_common:titles.import_data')}</DialogTitle>
					<DialogDescription>{t('ns_common:descriptions.import_data')}</DialogDescription>
				</DialogHeader>
				<DroppableArea
					aria-disabled={files.length >= maxFiles}
					data-drag-active={isDragActive}
					htmlFor={dropFileAreaId}
					onDragLeave={onDragLeave}
					onDragOver={onDragOver}
					onDrop={onDrop}>
					<Input
						multiple
						accept='.csv'
						className='hidden'
						id={dropFileAreaId}
						ref={inputRef}
						type='file'
						onChange={handleFileChange}
					/>
					<Icon name='CloudUpload' size={40} stroke={'var(--active)'} strokeWidth={1} />
					<Typography color='muted'>{t('ns_common:actions.csv_upload')}</Typography>
				</DroppableArea>
				{files.length > 0 && (
					<Div className='scroll-fade max-h-32'>
						{files.map((file, idx) => (
							<FileItem
								disabled={isPending}
								file={file}
								key={file.name + idx}
								onRemove={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
							/>
						))}
					</Div>
				)}
				<Div className='flex items-center justify-between'>
					<Typography color='muted' variant='small'>
						{t('ns_common:descriptions.chosen_files', {
							qty: `${files.length}/${maxFiles}`,
							defaultValue: `${files.length}/${maxFiles}`
						})}
					</Typography>
					<Typography color='muted' variant='small'>
						{filesize(files.map((item) => item.size).reduce<number>((acc, curr) => acc + curr, 0))}
					</Typography>
				</Div>
				<Button disabled={isPending || files.length === 0} size='lg' onClick={() => mutateAsync()}>
					<Icon className={cn({ 'animate-spin': isPending })} name={isPending ? 'LoaderCircle' : 'Upload'} />{' '}
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
			className='group hover:bg-accent flex grow items-center gap-x-2 rounded px-3 py-1.5 transition-colors duration-200 aria-disabled:pointer-events-none aria-disabled:opacity-80'>
			<Icon name='File' />
			<Typography className='line-clamp-1 block flex-1' variant='small'>
				{file.name}
			</Typography>
			<Typography color='muted' variant='small'>
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
