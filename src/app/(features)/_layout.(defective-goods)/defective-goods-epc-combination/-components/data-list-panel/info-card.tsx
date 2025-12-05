import { CommonActions } from '@/common/constants/enums'
import useCopyToClipboard from '@/common/hooks/use-copy-to-clipboard'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import { IDefectiveGoods } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	buttonVariants,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
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
import { useUpdateEffect } from 'ahooks'
import { formatRelative } from 'date-fns'
import { isNil } from 'lodash-es'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { gunzipSync } from 'zlib'
import { useListPanelContext } from '../../-contexts/list-panel-context'
import { DefectiveCategoryI18n, DefectiveLocation } from '../../../-constants'
import { usePageContext } from '../../../-contexts/page-context'
import { useDeleteDefectiveGoodsMutation } from '../../../-hooks/use-defective-goods-asm'
import { useSwitchRFIDDevice } from '../../../-hooks/use-switch-rfid-device'

const InfoCard: React.FC<{
	data: IDefectiveGoods
}> = ({ data }) => {
	const { t } = useTranslation()
	const { isItemSelected, toggleItem, isAllCardExpaned } = useListPanelContext()
	const [isOpen, setIsOpen] = useState<boolean>(isAllCardExpaned)
	const { event$ } = usePageContext()
	const { mutateAsync: deleteAsync } = useDeleteDefectiveGoodsMutation()
	const toastIdRef = useRef<string | number | null>(null)
	const { hash, search } = useLocation()
	const dateLocale = useDateLocale()
	const { setCurrentDevice } = useSwitchRFIDDevice()
	const navigate = useNavigate()

	// Simplified selection handler using new optimized API
	const handleSelect = useCallback(
		(_checked: boolean, id: number) => {
			// Use the new toggleItem method - much simpler!
			toggleItem(id)
		},
		[toggleItem]
	)

	const handleDelete = useCallback(async () => {
		try {
			toastIdRef.current = toast.loading(t('ns_common:notification.processing_request'))
			await deleteAsync(data.id)
			toast.success(t('ns_common:notification.success'), { id: toastIdRef.current })
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastIdRef.current })
		}
	}, [data])

	const handleUpdate = useCallback(() => {
		navigate({ hash: String(data.id), search })
		const payload: IDefectiveGoods = {} as IDefectiveGoods

		for (const prop in data) {
			if (prop === 'defective_description') {
				payload[prop] = gunzipSync(Buffer.from(data.defective_description, 'base64')).toString()
			} else if (isNil(data[prop])) {
				payload[prop] = ''
			} else {
				payload[prop] = data[prop]
			}
		}
		event$.emit({ action: CommonActions.UPDATE, payload })
		setCurrentDevice('usb')
	}, [data])

	const [copyToClipboard, { isCoppied }] = useCopyToClipboard()

	useUpdateEffect(() => {
		setIsOpen(isAllCardExpaned)
	}, [isAllCardExpaned])

	const defectLocation: Map<DefectiveLocation, string> = new Map([
		[DefectiveLocation.ALL, t('ns_common:others.all')],
		[DefectiveLocation.UPPER, t('ns_erp:shoes_parts.upper')],
		[DefectiveLocation.BOTTOM, t('ns_erp:shoes_parts.bottom')],
		[DefectiveLocation.OTHER, t('ns_common:others.other')]
	])

	return (
		<Card
			className={cn(
				'relative min-h-fit overflow-hidden rounded-md border pb-2 shadow-sm transition-colors duration-200 @container/card *:text-left *:text-sm',
				hash === String(data.id) && 'bg-accent/50'
			)}>
			<CardHeader>
				<CardAction className='absolute right-3 top-3'>
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger className='!m-0 aspect-square size-6 place-content-center place-items-center rounded hover:bg-accent'>
							<Icon name='Ellipsis' />
						</DropdownMenuTrigger>
						<DropdownMenuContent align='start' side='left'>
							<DropdownMenu>
								<DropdownMenuItem
									className='gap-x-2'
									onClick={() =>
										event$.emit({ action: CommonActions.READ, payload: data.defective_description })
									}>
									<Icon name='MousePointerClick' size={18} /> {t('ns_common:actions.detail')}
								</DropdownMenuItem>
								<DropdownMenuItem className='gap-x-2' onClick={() => handleUpdate()}>
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
				</CardAction>
				<Div className='!mb-3 flex items-center gap-x-1'>
					<Checkbox checked={isItemSelected(data.id)} onCheckedChange={() => handleSelect(false, data.id)} />
					<Separator orientation='vertical' className='mx-2 h-5 w-0.5' />
					<Badge>{data.brand_name}</Badge>
					<Badge variant='outline' className='w-fit'>
						{t(DefectiveCategoryI18n[data.defective_category], { ns: 'ns_inoutbound' })}
					</Badge>
				</Div>
				<CardTitle className='group/cart-title inline-flex items-center gap-x-1'>
					ID: {data.epc}{' '}
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
				<Collapsible defaultOpen={true} open={isOpen} onOpenChange={setIsOpen}>
					<CollapsibleTrigger className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}>
						<Icon name='ChevronDown' />
					</CollapsibleTrigger>
					<CollapsibleContent className='w-full overflow-auto py-4 pt-2 transition-none !scrollbar-none data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
						<DescriptionList>
							<DescriptionItem>
								<Typography variant='small'>{t('ns_erp:fields.cust_shoes_style')}:</Typography>
								<Typography variant='small'>{data.cust_shoes_style}</Typography>
							</DescriptionItem>
							<DescriptionItem>
								<Typography variant='small'>{t('ns_erp:fields.factory_shoes_style')}:</Typography>
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
									<Typography variant='small' title={data.mo_no}>
										{data.mo_no}
									</Typography>
								</DescriptionItem>
							)}
							<DescriptionItem>
								<Typography variant='small'>{t('ns_erp:fields.sewing_line')} : </Typography>
								<Typography variant='small' className='uppercase' title={data.sewing_line ?? '?'}>
									{data.sewing_line ?? '?'}
								</Typography>
							</DescriptionItem>
							<DescriptionItem>
								<Typography variant='small'>{t('ns_erp:fields.assembly_line')} : </Typography>
								<Typography variant='small' className='uppercase' title={data.assembly_line ?? '?'}>
									{data.assembly_line ?? '?'}
								</Typography>
							</DescriptionItem>
							<DescriptionItem>
								<Typography variant='small'>{t('ns_erp:fields.defective_location')} : </Typography>
								<Typography variant='small' title={defectLocation.get(data.defective_location) ?? '?'}>
									{defectLocation.get(data.defective_location) ?? '?'}
								</Typography>
							</DescriptionItem>
							<DescriptionItem>
								<Typography variant='small'>{t('ns_warehouse:fields.storage_position')} : </Typography>
								<Typography variant='small' className='uppercase' title={data.storage_location ?? '?'}>
									{data.storage_location ?? '?'}
								</Typography>
							</DescriptionItem>
						</DescriptionList>
					</CollapsibleContent>
				</Collapsible>
			</CardContent>
		</Card>
	)
}

const DescriptionList = tw.ul`list-disc grid @lg/card:items-center grid-cols-1 gap-x-6 gap-y-3 @lg/card:grid-cols-2 items-start`
const DescriptionItem = tw.li`flex items-center gap-x-1 *:text-sm [&_*:last-child]:!font-medium [&_*:last-child]:line-clamp-1 whitespace-nowrap [&_svg]:stroke-muted-foreground`

export default InfoCard
