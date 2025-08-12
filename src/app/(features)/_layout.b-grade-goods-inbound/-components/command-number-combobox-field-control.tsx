import { ComboboxFieldControl } from '@/components/ui'
import { debounce } from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchCommandNumberQuery } from '../../-hooks/use-order-asm'

const CommandNumberComboboxFieldControl: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { t } = useTranslation()
	const { data } = useSearchCommandNumberQuery(searchTerm)

	return (
		<ComboboxFieldControl
			name='mo_no'
			label={t('ns_erp:fields.mo_no')}
			datalist={data}
			labelField='mo_no'
			valueField='mo_no'
			shouldFilter={false}
			onInput={debounce((value) => setSearchTerm(value), 200)}
		/>
	)
}

export default CommandNumberComboboxFieldControl
