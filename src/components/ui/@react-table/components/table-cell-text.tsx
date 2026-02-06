import { CellContext } from '@tanstack/react-table'
import { isEmpty, isNil } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { Typography } from '../../@custom/typography'

export const TableCellText: React.FC<CellContext<any, any>> = (props) => {
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
