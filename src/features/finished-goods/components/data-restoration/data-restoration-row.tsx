import { Typography } from '@components/customs/typography'
import { Badge } from '@components/ui/badge'
import { Checkbox } from '@components/ui/checkbox'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@components/ui/hover-card'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { TableCell, TableRow } from '@components/ui/table'
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
					checked={isSelected}
					id={data.epc}
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
				<Label className='cursor-pointer' htmlFor={data.epc}>
					{data?.epc}
				</Label>
			</TableCell>
			<TableCell align='center' className='group-aria-selected/row:bg-table-row-selected'>
				{dataType === StockFlow.OUTBOUND ? (
					<Badge className='justify-center gap-x-2' variant='outline'>
						<Icon
							className={data.scanned ? 'stroke-success' : 'stroke-muted-foreground'}
							name={data.scanned ? 'Check' : 'CircleDashed'}
							size={14}
						/>
						{data.scanned ? t('ns_rfid:status.scanned') : t('ns_rfid:status.unscanned')}
					</Badge>
				) : (
					<Badge className='justify-center gap-x-2' variant='outline'>
						<Icon
							className={data.scannable ? 'stroke-success' : 'stroke-destructive'}
							name={data.scannable ? 'Check' : 'X'}
							size={14}
						/>
						{data.scannable ? t('ns_rfid:status.scannable') : t('ns_rfid:status.unscannable')}
					</Badge>
				)}
			</TableCell>
			<TableCell className='group-aria-selected/row:bg-table-row-selected'>
				<HoverCard closeDelay={100} openDelay={100}>
					<HoverCardTrigger asChild>
						<GhostButton>
							<Icon name='Ellipsis' />
						</GhostButton>
					</HoverCardTrigger>
					<HoverCardContent
						align='start'
						className='bg-popover text-popover-foreground w-full max-w-md rounded-md'
						side='left'
						sideOffset={8}>
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
