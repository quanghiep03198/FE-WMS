import type { AutoCompleteFieldControlProps } from '@/components/forms/auto-complete'
import type { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'

export type DefAutoCompleteFieldControlProps = Partial<
	AutoCompleteFieldControlProps<DefectiveGoodsCombinationFormValues, Record<'label' | 'value', string>>
>
