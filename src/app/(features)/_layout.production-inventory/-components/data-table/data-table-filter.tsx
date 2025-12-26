import { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import { Div, Icon } from '@/components/ui'
import { DebouncedInput } from '@/components/ui/@custom/debounced-input'
import { Updater } from '@tanstack/react-table'
import { capitalize } from 'lodash-es'
import { useTranslation } from 'react-i18next'

type DataTableGlobalFilterProps = {
	globalFilter: any
	onGlobalFilterChange: (updater: Updater<any>) => void
	dataType: RFIDDataType
}

const DataTableGlobalFilter: React.FC<DataTableGlobalFilterProps> = ({
	globalFilter,
	onGlobalFilterChange,
	dataType
}) => {
	const { t } = useTranslation()

	return (
		<Div className='flex h-9 w-full max-w-[280px] items-center space-x-2 rounded-md border px-2 py-1 transition-colors duration-200 focus-within:border-primary'>
			<Icon name='Search' size={18} />
			<DebouncedInput
				type='search'
				value={globalFilter}
				onChange={(value) => onGlobalFilterChange(String(value))}
				className='font-lg border bg-transparent px-0 text-sm placeholder:text-sm'
				placeholder={capitalize(
					t('ns_common:form_placeholder.search', {
						object: dataType === 'inbound' ? t('ns_erp:fields.mo_no') : t('ns_erp:fields.po'),
						defaultValue: 'Search ...'
					})
				)}
			/>
		</Div>
	)
}

DataTableGlobalFilter.displayName = 'DataTableGlobalFilter'

export default DataTableGlobalFilter
