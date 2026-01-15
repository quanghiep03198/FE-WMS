import { CommonActions } from '@/common/constants/enums'
import useCopyToClipboard from '@/common/hooks/use-copy-to-clipboard'
import { useDateLocale } from '@/common/hooks/use-date-locale'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox,
	Collapsible,
	CollapsibleContent,
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
import { IDefectiveGoods } from '@/services/defective-goods.service'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useUpdateEffect } from 'ahooks'
import { formatRelative } from 'date-fns'
import { capitalize, isNil, upperCase } from 'lodash-es'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { gunzipSync } from 'zlib'
import { useListPanelContext } from '../../-contexts/list-panel-context'
import { DefectiveCategoryI18n, DefectiveLocation } from '../../../-constants'
import { usePageContext } from '../../../-contexts/page-context'
import { useSwitchCombinationStrategy } from '../../../-hooks/use-switch-combination-strategy'

const InfoCard: React.FC<{
	data: IDefectiveGoods
}> = ({ data }) => {
	const { t } = useTranslation()
	const { isAllCardsExpanded, isTogglingExpand, isItemSelected, toggleItem } = useListPanelContext()
	const [isOpen, setIsOpen] = useState<boolean>(isAllCardsExpanded)
	const { event$ } = usePageContext()

	const { hash, search } = useLocation()
	const dateLocale = useDateLocale()
	const { setStrategy } = useSwitchCombinationStrategy()
	const navigate = useNavigate()

	// Simplified selection handler using new optimized API
	const handleSelect = useCallback(
		(_checked: boolean, id: number) => {
			// Use the new toggleItem method - much simpler!
			toggleItem(id)
		},
		[toggleItem]
	)

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
		setStrategy(null)
	}, [data])

	const [copyToClipboard, { isCoppied }] = useCopyToClipboard()

	useUpdateEffect(() => {
		setIsOpen(isAllCardsExpanded)
	}, [isAllCardsExpanded])

	const defectLocation: Map<DefectiveLocation, string> = new Map([
		[DefectiveLocation.ALL, t('ns_common:others.all')],
		[DefectiveLocation.UPPER, t('ns_erp:shoes_parts.upper')],
		[DefectiveLocation.BOTTOM, t('ns_erp:shoes_parts.bottom')],
		[DefectiveLocation.OTHER, t('ns_common:others.other')]
	])

	return (
		<Card
			className={cn(
				'relative min-h-fit gap-4 overflow-hidden rounded-md border pb-2 pt-4 shadow-sm @container/card *:text-left *:text-sm',
				isTogglingExpand && 'duration-200 animate-out fade-out-50',
				hash === String(data.id) && 'bg-accent/50'
			)}>
			<CardHeader className='px-4' onClick={() => setIsOpen(!isOpen)}>
				<CardAction className='absolute right-3 top-3'>
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger
							onClick={(e) => e.stopPropagation()}
							className='!m-0 aspect-square size-6 place-content-center place-items-center rounded hover:bg-accent'>
							<Icon name='Ellipsis' />
						</DropdownMenuTrigger>
						<DropdownMenuContent align='start' side='left'>
							<DropdownMenu>
								<DropdownMenuItem
									className='gap-x-2'
									onClick={(e) => {
										e.stopPropagation()
										event$.emit({ action: CommonActions.READ, payload: data.defective_description })
									}}>
									<Icon name='MousePointerClick' size={18} /> {t('ns_common:actions.detail')}
								</DropdownMenuItem>
								<DropdownMenuItem
									className='gap-x-2'
									onClick={(e) => {
										e.stopPropagation()
										handleUpdate()
									}}>
									<Icon name='PencilLine' /> {t('ns_common:actions.update')}
								</DropdownMenuItem>
								<DropdownMenuItem
									className='gap-x-2 !text-destructive hover:!bg-destructive/20'
									onClick={(e) => {
										e.stopPropagation()
										event$.emit({ action: CommonActions.DELETE, payload: data.id })
									}}>
									<Icon name='Trash2' /> {t('ns_common:actions.delete')}
								</DropdownMenuItem>
							</DropdownMenu>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardAction>
				<Div className='!mb-3 flex items-center gap-x-1'>
					<Checkbox
						checked={isItemSelected(data.id)}
						onCheckedChange={() => handleSelect(false, data.id)}
						onClick={(e) => e.stopPropagation()}
					/>
					<Separator orientation='vertical' className='mx-2 h-5 w-0.5' />
					<Badge>{data.brand_name}</Badge>
					<Badge variant='outline' className='w-fit'>
						{t(DefectiveCategoryI18n[data.defective_category], { ns: 'ns_inoutbound', defaultValue: null })}
					</Badge>
				</Div>
				<CardTitle className='group/cart-title inline-flex items-center gap-x-1'>
					ID: {data.epc}{' '}
					<Tooltip message='Copy' triggerProps={{ asChild: true }}>
						<button
							onClick={(e) => {
								e.stopPropagation()
								copyToClipboard(data.epc)
							}}
							className={cn('ml-2')}>
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
			<CardContent className='space-y-4 px-4 pb-2'>
				<Collapsible defaultOpen={true} open={isOpen} onOpenChange={setIsOpen}>
					<CollapsibleContent className='w-full overflow-auto transition-none !scrollbar-none data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
						<Separator className='mb-4' />
						<DescriptionList>
							<DescriptionItem title={data.cust_shoes_style}>
								<Typography variant='small'>{t('ns_erp:fields.cust_shoes_style')}:</Typography>
								<Typography variant='small'>{data.cust_shoes_style}</Typography>
							</DescriptionItem>
							<DescriptionItem title={data.factory_shoes_style}>
								<Typography variant='small'>{t('ns_erp:fields.factory_shoes_style')}:</Typography>
								<Typography variant='small'>{data.factory_shoes_style}</Typography>
							</DescriptionItem>
							<DescriptionItem title={data.color_sn}>
								<Typography variant='small'>{t('ns_erp:fields.color_sn')}:</Typography>
								<Typography variant='small'>{data.color_sn}</Typography>
							</DescriptionItem>
							<DescriptionItem title={data.po}>
								<Typography variant='small'>Size: </Typography>
								<Typography variant='small' title={data.size_code}>
									#{data.size_code}
								</Typography>
							</DescriptionItem>
							{data.po && (
								<DescriptionItem title={data.po}>
									<Typography variant='small'>{t('ns_erp:fields.po')}:</Typography>
									<Typography variant='small' title={data.po}>
										{data.po}
									</Typography>
								</DescriptionItem>
							)}
							{data.mo_no && (
								<DescriptionItem title={data.mo_no}>
									<Typography>{t('ns_erp:fields.mo_no')}: </Typography>
									<Typography variant='small'>{data.mo_no}</Typography>
								</DescriptionItem>
							)}
							<DescriptionItem title={data.sewing_line ?? '?'}>
								<Typography variant='small'>{t('ns_erp:fields.sewing_line')} : </Typography>
								<Typography variant='small' className='uppercase'>
									{data.sewing_line ?? '?'}
								</Typography>
							</DescriptionItem>
							<DescriptionItem title={data.assembly_line ?? '?'}>
								<Typography variant='small'>{t('ns_erp:fields.assembly_line')} : </Typography>
								<Typography variant='small' className='uppercase'>
									{data.assembly_line ?? '?'}
								</Typography>
							</DescriptionItem>
							<DescriptionItem title={defectLocation.get(data.defective_location) ?? '?'}>
								<Typography variant='small'>{t('ns_erp:fields.defective_location')} : </Typography>
								<Typography variant='small'>{defectLocation.get(data.defective_location) ?? '?'}</Typography>
							</DescriptionItem>
							<DescriptionItem
								title={
									t(`ns_inoutbound:shoes_source.${data.shoe_source}`, { defaultValue: data.shoe_source }) ??
									'?'
								}>
								<Typography variant='small'>{t('ns_erp:fields.shoe_source')} : </Typography>
								<Typography variant='small'>
									{t(`ns_inoutbound:shoes_source.${data.shoe_source}`, { defaultValue: data.shoe_source }) ??
										'?'}
								</Typography>
							</DescriptionItem>
							<DescriptionItem title={data.ri_type ?? '?'}>
								<Typography variant='small'>{t('ns_erp:fields.ri_type')} : </Typography>
								<Typography variant='small'>
									{data.ri_type === 'manually'
										? capitalize(t('ns_common:titles.manually'))
										: upperCase(data.ri_type)}
								</Typography>
							</DescriptionItem>
							<DescriptionItem title={data.storage_location ?? '?'}>
								<Typography variant='small'>{t('ns_warehouse:fields.storage_position')} : </Typography>
								<Typography variant='small' className='uppercase'>
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
const DescriptionItem = tw.li`flex items-center gap-x-1 *:text-sm [&>:first-child]:text-nowrap [&>:last-child]:font-medium  [&>:last-child]:line-clamp-1 [&>:last-child]:overflow-ellipsis [&_svg]:stroke-muted-foreground`

export default InfoCard
