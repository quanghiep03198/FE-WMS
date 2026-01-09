import { NestedCell, NestedRow } from '@/app/(features)/-components/shared/horizontal-nested-table'
import {
	Div,
	Icon,
	Separator,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@/components/ui'
import axiosInstance from '@/configs/axios.config'

import { FALLBACK_VALUE } from '@/common/constants/constants'
import { CommonActions } from '@/common/constants/enums'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { debounce } from 'lodash-es'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../../-contexts/page-context'

type DetailTableItem = {
	factory_shoes_style: string
	color_sn: string
	sizes: Array<{ size_code: string; qty: number }>
}

const EpcDetailTable: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const [data, setData] = useState<DetailTableItem[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	event$.useSubscription(
		debounce(
			(e: { action: CommonActions; payload: string[] }) => {
				if (e.action !== CommonActions.IMPORT) return
				setLoading(true)
				axiosInstance
					.post<string[], ResponseBody<DetailTableItem[]>>('/defective-goods/retrieve-size-qty', e.payload)
					.then((response) => setData(response.metadata))
					.finally(() => setLoading(false))
			},
			100,
			{ maxWait: 200, leading: true, trailing: false }
		)
	)

	const totalQty = useMemo(() => {
		if (!Array.isArray(data)) return 0
		return data.reduce((acc, curr) => {
			return acc + curr.sizes.reduce((sizeAcc, sizeCurr) => sizeAcc + sizeCurr.qty, 0)
		}, 0)
	}, [data])

	return (
		<Div className='grid grid-rows-[auto_var(--bar-height)] divide-y divide-border'>
			<Div className='h-[calc(var(--detail-table-panel-height)-var(--bar-height))] flex-1 basis-full overflow-scroll scrollbar-track-accent/50'>
				<Table
					className='table-fixed border-separate border-spacing-0 [&_th]:bg-table-head [&_th]:text-table-head-foreground'
					style={
						{
							'--col-width': '160px'
						} as React.CSSProperties
					}>
					<TableHeader className='sticky top-0 z-20 h-[calc(var(--bar-height)+1px)] [&_th]:sticky [&_th]:top-0 [&_th]:z-20 [&_th]:border-b [&_th]:bg-table-head'>
						<TableRow className='z-20'>
							<TableHead align='left' className='left-[var(--col-width)] top-0 w-[var(--col-width)]'>
								{t('ns_erp:fields.factory_shoes_style')}
							</TableHead>
							<TableHead align='left' className='left-[calc(2*var(--col-width))] top-0 w-[var(--col-width)]'>
								{t('ns_erp:fields.color_sn')}
							</TableHead>
							<TableHead>Size</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!Array.isArray(data) || data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									align='center'
									className='z-0 h-[calc(var(--detail-table-panel-height)-2*var(--bar-height)-2*var(--scrollbar-thickness))]'>
									<Typography color='muted' className='inline-flex items-center gap-x-2'>
										<Icon name='Inbox' size={32} strokeWidth={1} />
										{t('ns_common:table.no_data')}
									</Typography>
								</TableCell>
							</TableRow>
						) : (
							data.map((item) => (
								<TableRow
									key={item.factory_shoes_style + item.color_sn}
									className={cn(
										'duration-500 ease-in-out [&_td]:transition-opacity',
										loading && '[&_td]:opacity-50'
									)}>
									<TableCell align='left'>
										{item.factory_shoes_style === FALLBACK_VALUE
											? t('ns_common:titles.unknown')
											: item.factory_shoes_style}
									</TableCell>
									<TableCell align='left'>
										{item.color_sn === FALLBACK_VALUE ? t('ns_common:titles.unknown') : item.color_sn}
									</TableCell>
									<TableCell className='p-0'>
										<Div className='flex flex-grow border-collapse flex-nowrap divide-x'>
											{item.sizes.map((size) => (
												<NestedRow key={size.size_code}>
													<NestedCell>
														{size.size_code === FALLBACK_VALUE
															? t('ns_common:titles.unknown')
															: size.size_code}
													</NestedCell>
													<NestedCell>{size.qty}</NestedCell>
												</NestedRow>
											))}
										</Div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Div>
			<Div className='bg-table-header flex h-[var(--bar-height)] basis-[var(--bar-height)] items-center justify-between p-4 text-table-head-foreground'>
				<Typography variant='small'>{t('ns_inoutbound:description.inoutbound_table_caption')}</Typography>
				<Typography className='inline-flex items-center gap-x-1.5 font-medium text-foreground'>
					<span>{t('ns_common:common_fields.total')}</span>
					<Separator className='h-px basis-1.5 bg-foreground' />
					<span>{formatIntlNumber(totalQty)}</span>
					<small className='place-self-start self-start text-xs'>prs</small>
				</Typography>
			</Div>
		</Div>
	)
}

export default EpcDetailTable
