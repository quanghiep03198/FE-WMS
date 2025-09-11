import { ComboboxFieldControl } from '@/components/ui'
import { ComboboxFieldControlProps } from '@/components/ui/@field-control/combobox'
import { debounce } from 'lodash'
import React, { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchCommandNumberQuery } from '../../../../-hooks/use-order-asm'

type CommandNumberComboboxFieldControlProps = Partial<ComboboxFieldControlProps<FieldValues, Record<'mo_no', string>>>

const CommandNumberComboboxFieldControl: React.FC<CommandNumberComboboxFieldControlProps> = (props) => {
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
			{...props}
		/>
	)
}

export default CommandNumberComboboxFieldControl
