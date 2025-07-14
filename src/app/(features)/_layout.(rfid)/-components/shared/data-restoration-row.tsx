import { IElectronicProductCode } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	Checkbox,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Label,
	TableCell,
	TableRow,
	Typography
} from '@/components/ui'
import { VirtualItem } from '@tanstack/react-virtual'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { RFIDDataType } from '../../-constants'
import { useDataRestorationContext } from '../../-contexts/data-sheet-context'
import { GhostButton, ListDetail, ListDetailItem } from './styled'

type DataRestorationRowProps = {
	data: IElectronicProductCode & { scanned: boolean }
	dataType: RFIDDataType
	virtualItem: VirtualItem
}

const DataRestorationRow: React.FC<DataRestorationRowProps> = ({ data, dataType, virtualItem }) => {
	const { t } = useTranslation()
	const { selectedItems, addItemToSet, removeItemFromSet } = useDataRestorationContext(
		'addItemToSet',
		'removeItemFromSet',
		'selectedItems'
	)
	// const isFetching = useIsFetching({ predicate: (query) => query.queryKey.some((key) => key === 'ARCHIVED_EPCS') })

	const isSelected = selectedItems.some((epc) => epc.epc === data.epc)

	return (
		<TableRow
			key={virtualItem.key}
			data-index={virtualItem.index}
			aria-selected={isSelected}
			className={cn(
				'group/row transition-all duration-200 ease-in-out group-aria-busy/body:opacity-50'
				// isFetching ? 'opacity-50' : 'opacity-100'
			)}
			style={{ height: virtualItem.size }}>
			<TableCell className='group-aria-selected/row:bg-table-row-selected'>
				<Checkbox
					id={virtualItem.key.toString()}
					checked={isSelected}
					onCheckedChange={(checked) => {
						if (checked) {
							addItemToSet(data)
						} else {
							removeItemFromSet(data)
						}
					}}
				/>
			</TableCell>
			<TableCell align='left' className='group-aria-selected/row:bg-table-row-selected'>
				<Label htmlFor={virtualItem.key.toString()} className='cursor-pointer'>
					{data?.epc}
				</Label>
			</TableCell>
			<TableCell align='center' className='group-aria-selected/row:bg-table-row-selected'>
				{dataType === RFIDDataType.OUTBOUND ? (
					<Badge variant='outline' className='justify-center gap-x-2'>
						<Icon
							name={data.scanned ? 'Check' : 'CircleDashed'}
							size={14}
							className={data.scanned ? 'stroke-success' : 'stroke-muted-foreground'}
						/>
						{data.scanned ? t('ns_rfid:status.scanned') : t('ns_rfid:status.unscanned')}
					</Badge>
				) : (
					<Badge variant='outline' className='justify-center gap-x-2'>
						<Icon
							name={data.scannable ? 'Check' : 'X'}
							size={14}
							className={data.scannable ? 'stroke-success' : 'stroke-destructive'}
						/>
						{data.scannable ? t('ns_rfid:status.scannable') : t('ns_rfid:status.unscannable')}
					</Badge>
				)}
			</TableCell>
			<TableCell className='group-aria-selected/row:bg-table-row-selected'>
				<HoverCard openDelay={100} closeDelay={100}>
					<HoverCardTrigger asChild>
						<GhostButton>
							<Icon name='Ellipsis' />
						</GhostButton>
					</HoverCardTrigger>
					<HoverCardContent
						align='start'
						side='left'
						sideOffset={8}
						className='w-full max-w-md rounded-md bg-popover text-popover-foreground'>
						<ListDetail>
							<ListDetailItem>
								{t('ns_erp:fields.mo_no')}: <Typography variant='small'>{data?.mo_no}</Typography>
							</ListDetailItem>
							<ListDetailItem>
								{t('ns_erp:fields.shoestyle_codefactory')}:{' '}
								<Typography variant='small'>{data?.shoes_style_code_factory}</Typography>
							</ListDetailItem>
							<ListDetailItem>
								{t('ns_erp:fields.color_sn')}: <Typography variant='small'>{data?.color_sn}</Typography>
							</ListDetailItem>
							<ListDetailItem>
								Size: <Typography variant='small'>{data?.size_numcode}</Typography>
							</ListDetailItem>
						</ListDetail>
					</HoverCardContent>
				</HoverCard>
			</TableCell>
		</TableRow>
	)
}

const MemoizedDataRestorationRow = memo(DataRestorationRow)

export { DataRestorationRow, MemoizedDataRestorationRow }
