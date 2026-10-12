import { DebouncedInput } from '@components/customs/debounced-input'
import { Div } from '@components/customs/div'
import { Icon } from '@components/ui/icon'
import type { StockFlow } from '@features/finished-goods/constants/enums'
import type { Updater } from '@tanstack/react-table'
import { capitalize } from 'lodash-es'
import { useTranslation } from 'react-i18next'

type DataTableGlobalFilterProps = {
	globalFilter: any
	onGlobalFilterChange: (updater: Updater<any>) => void
	dataType: StockFlow
}

const DataTableGlobalFilter: React.FC<DataTableGlobalFilterProps> = ({
	globalFilter,
	onGlobalFilterChange,
	dataType
}) => {
	const { t } = useTranslation()

	return (
		<Div className='focus-within:border-primary flex h-9 w-full max-w-70 items-center space-x-2 rounded-md border px-2 py-1 transition-colors duration-200'>
			<Icon name='Search' size={18} />
			<DebouncedInput
				className='font-lg border bg-transparent px-0 text-sm placeholder:text-sm'
				type='search'
				value={globalFilter}
				placeholder={capitalize(
					t('ns_common:form_placeholder.search', {
						object: dataType === 'inbound' ? t('ns_erp:fields.mo_no') : t('ns_erp:fields.po'),
						defaultValue: 'Search ...'
					})
				)}
				onChange={(value) => onGlobalFilterChange(String(value))}
			/>
		</Div>
	)
}

DataTableGlobalFilter.displayName = 'DataTableGlobalFilter'

export default DataTableGlobalFilter
