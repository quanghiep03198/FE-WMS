import { cn } from '@common/utils/cn'
import type { CellContext } from '@tanstack/react-table'
import { isEmpty, isNil } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { Typography } from '../../@custom/typography'

const TableCellText: React.FC<CellContext<any, any> & React.ComponentProps<'small'>> = (props) => {
	const { t } = useTranslation()

	const value = props.getValue()

	if (isNil(value) || isEmpty(value))
		return (
			<Typography variant='small' color='muted' className={cn('line-clamp-1', props.className)}>
				{t('ns_common:titles.unknown')}
			</Typography>
		)

	return value
}

export default TableCellText
