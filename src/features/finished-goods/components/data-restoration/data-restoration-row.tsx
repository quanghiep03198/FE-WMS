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
} from '@components/ui'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StockFlow } from '../../constants/enums'
import { useDataRestorationContext } from '../../contexts/data-restoration-context'
import type { IElectronicProductCode } from '../../types'
import { GhostButton, ListDetail, ListDetailItem } from '../styled'

type DataRestorationRowProps = {
	data: IElectronicProductCode & { scanned: boolean }
	dataType: StockFlow
	size: number
	// virtualItem: VirtualItem
}

const DataRestorationRow: React.FC<DataRestorationRowProps> = ({ data, dataType, size }) => {
	const { t } = useTranslation()
	const { selectedItems, addItemToSet, removeItemFromSet } = useDataRestorationContext(
		'addItemToSet',
		'removeItemFromSet',
		'selectedItems'
	)

	const isSelected = selectedItems.some((epc) => epc.epc === data.epc)

	return (
		<TableRow
			aria-selected={isSelected}
			className='group/row transition-all duration-200 ease-in-out group-aria-busy/body:opacity-50'
			style={{ height: size }}>
			<TableCell className='group-aria-selected/row:bg-table-row-selected'>
				<Checkbox
					id={data.epc}
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
				<Label htmlFor={data.epc} className='cursor-pointer'>
					{data?.epc}
				</Label>
			</TableCell>
			<TableCell align='center' className='group-aria-selected/row:bg-table-row-selected'>
				{dataType === StockFlow.OUTBOUND ? (
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
						className='bg-popover text-popover-foreground w-full max-w-md rounded-md'>
						<ListDetail>
							<ListDetailItem>
								{t('ns_erp:fields.mo_no')}: <Typography variant='small'>{data?.mo_no}</Typography>
							</ListDetailItem>
							<ListDetailItem>
								{t('ns_erp:fields.factory_shoes_style')}:{' '}
								<Typography variant='small'>{data?.factory_shoes_style}</Typography>
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
