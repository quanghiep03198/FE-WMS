import { CommonActions } from '@/common/constants/enums'
import useCopyToClipboard from '@/common/hooks/use-copy-to-clipboard'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import { IDefectiveGoods } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Icon,
	Separator,
	Tooltip,
	Typography
} from '@/components/ui'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { formatRelative } from 'date-fns'
import React, { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { DefectiveCategoryI18n, DefectiveLocation } from '../../../-constants'
import { usePageContext } from '../../../-contexts/page-context'
import { useDeleteDefectiveGoodsMutation } from '../../../-hooks/use-defective-goods-asm'
import { useSwitchRFIDDevice } from '../../../-hooks/use-switch-rfid-device'

const DefectiveGoodInfoCard: React.FC<{
	data: IDefectiveGoods
	selected: boolean
	onSelect: (checked: boolean, id: number) => void
}> = ({ data, selected, onSelect }) => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const { mutateAsync: deleteAsync } = useDeleteDefectiveGoodsMutation()
	const toastIdRef = useRef<string | number | null>(null)
	const { hash, search } = useLocation()
	const dateLocale = useDateLocale()
	const { setCurrentDevice } = useSwitchRFIDDevice()
	const navigate = useNavigate()

	const handleDelete = useCallback(async () => {
		try {
			toastIdRef.current = toast.loading(t('ns_common:notification.processing_request'))
			await deleteAsync(data.id)
			toast.success(t('ns_common:notification.success'), { id: toastIdRef.current })
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastIdRef.current })
		}
	}, [data])

	const [copyToClipboard, { isCoppied }] = useCopyToClipboard()

	const defectLocation: Map<DefectiveLocation, string> = new Map([
		[DefectiveLocation.ALL, t('ns_common:others.all')],
		[DefectiveLocation.UPPER, t('ns_erp:shoes_parts.upper')],
		[DefectiveLocation.BOTTOM, t('ns_erp:shoes_parts.bottom')],
		[DefectiveLocation.OTHER, t('ns_common:others.other')]
	])

	return (
		<Card
			className={cn(
				'relative min-h-fit overflow-hidden rounded-md border shadow-sm transition-colors duration-200 @container/card *:text-left *:text-sm has-[data-state=checked]:bg-red-500',
				hash === String(data.id) && 'bg-accent/50'
			)}>
			<CardHeader className='p-[var(--indent-space)]'>
				<DropdownMenu>
					<DropdownMenuTrigger className='absolute right-3 top-3 !m-0 aspect-square size-6 place-content-center place-items-center rounded hover:bg-accent'>
						<Icon name='Ellipsis' />
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenu>
							<DropdownMenuItem
								className='gap-x-2'
								onClick={() => event$.emit({ action: CommonActions.READ, payload: data.defect_description })}>
								<Icon name='MousePointerClick' /> {t('ns_common:actions.detail')}
							</DropdownMenuItem>
							<DropdownMenuItem
								className='gap-x-2'
								onClick={() => {
									navigate({ hash: String(data.id), search })
									console.log('data :>>>', data)
									event$.emit({ action: CommonActions.UPDATE, payload: data })
									setCurrentDevice('usb')
								}}>
								<Icon name='PencilLine' /> {t('ns_common:actions.update')}
							</DropdownMenuItem>
							<DropdownMenuItem
								className='gap-x-2 !text-destructive hover:!bg-destructive/20'
								onClick={() => handleDelete()}>
								<Icon name='Trash2' /> {t('ns_common:actions.delete')}
							</DropdownMenuItem>
						</DropdownMenu>
					</DropdownMenuContent>
				</DropdownMenu>
				<Div className='!mb-3 flex items-center gap-x-1'>
					<Checkbox
						checked={selected}
						onCheckedChange={(checked) => {
							onSelect(Boolean(checked), data.id)
						}}
					/>
					<Separator orientation='vertical' className='mx-2 h-5 w-0.5' />
					<Badge>{data.brand_name}</Badge>
					<Badge variant='outline' className='w-fit'>
						{t(DefectiveCategoryI18n[data.category], { ns: 'ns_inoutbound' })}
					</Badge>
				</Div>
				<CardTitle className='group/cart-title inline-flex items-center gap-x-1'>
					#ID: {data.epc}{' '}
					<Tooltip message='Copy' triggerProps={{ asChild: true }}>
						<button onClick={() => copyToClipboard(data.epc)} className={cn('ml-2')}>
							<Icon name={isCoppied ? 'CopyCheck' : 'Copy'} />
						</button>
					</Tooltip>
				</CardTitle>
				<CardDescription className='first-letter:uppercase'>
					{t('ns_common:timestamps.created_at', {
						timestamp: formatRelative(new Date(data.created), new Date(), { locale: dateLocale }),
						defaultValue: formatRelative(new Date(data.created), new Date(), { locale: dateLocale })
					})}
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<DescriptionList>
					<DescriptionItem>
						<Typography variant='small'>{t('ns_erp:fields.cust_shoes_style')}:</Typography>
						<Typography variant='small'>{data.cust_shoes_style}</Typography>
					</DescriptionItem>
					<DescriptionItem>
						<Typography variant='small'>{t('ns_erp:fields.shoestyle_codefactory')}:</Typography>
						<Typography variant='small'>{data.factory_shoes_style}</Typography>
					</DescriptionItem>
					<DescriptionItem>
						<Typography variant='small'>{t('ns_erp:fields.color_sn')}:</Typography>
						<Typography variant='small'>{data.color_sn}</Typography>
					</DescriptionItem>
					<DescriptionItem>
						<Typography variant='small'>Size: </Typography>
						<Typography variant='small'>#{data.size_code}</Typography>
					</DescriptionItem>
					{data.po && (
						<DescriptionItem>
							<Typography variant='small'>{t('ns_erp:fields.po')}:</Typography>
							<Typography variant='small'>{data.po}</Typography>
						</DescriptionItem>
					)}
					{data.mo_no && (
						<DescriptionItem>
							<Typography>{t('ns_erp:fields.mo_no')}: </Typography>
							<Typography>{data.mo_no}</Typography>
						</DescriptionItem>
					)}
					<DescriptionItem>
						<Typography variant='small'>{t('ns_erp:fields.defect_location')} : </Typography>
						<Typography>{defectLocation.get(data.defect_location) ?? '?'}</Typography>
					</DescriptionItem>
					<DescriptionItem>
						<Typography variant='small'>{t('ns_warehouse:fields.storage_position')} : </Typography>
						<Typography className='uppercase'>{data.storage_location ?? '?'}</Typography>
					</DescriptionItem>
				</DescriptionList>
			</CardContent>
		</Card>
	)
}

const DescriptionList = tw.ul`list-disc grid @lg/card:items-center grid-cols-1 gap-x-6 gap-y-3 @lg/card:grid-cols-2 items-start`
const DescriptionItem = tw.li`flex items-center gap-x-1 *:text-sm [&_*:last-child]:!font-medium whitespace-nowrap [&_svg]:stroke-muted-foreground`

export default DefectiveGoodInfoCard
