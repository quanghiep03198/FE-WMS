import { AutoCompleteFieldControl } from '@/components/ui'
import { ComboboxFieldControlProps } from '@/components/ui/@field-control/combobox'
import { debounce } from 'lodash'
import React, { useState } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchCommandNumberQuery } from '../../../../-hooks/use-order-asm'

type CommandNumberFieldControlProps = Partial<ComboboxFieldControlProps<FieldValues, Record<'mo_no', string>>>

const CommandNumberFieldControl: React.FC<CommandNumberFieldControlProps> = (props) => {
	const { getValues } = useFormContext()
	const [searchTerm, setSearchTerm] = useState<string>(getValues('mo_no') || '')
	const { t } = useTranslation()
	const { data } = useSearchCommandNumberQuery(searchTerm)

	return (
		<AutoCompleteFieldControl
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

export default CommandNumberFieldControl
