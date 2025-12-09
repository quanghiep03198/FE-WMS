import { CellContext } from '@tanstack/react-table'
import { isEmpty, isNil } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { Typography } from '../../@custom/typography'

type TTableCellTextProps<TData = unknown, TValue = unknown> = CellContext<TData, TValue>

export function TableCellText<TData, TValue>(props: TTableCellTextProps<TData, TValue>) {
	const { t } = useTranslation()

	const value = props.getValue()

	if (isNil(value) || isEmpty(value))
		return (
			<Typography variant='small' color='muted' className='line-clamp-1'>
				{t('ns_common:titles.unknown')}
			</Typography>
		)

	return value
}

export default TableCellText
