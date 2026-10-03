import type { SelectFieldControlProps } from '@components/ui'
import { SelectFieldControl } from '@components/ui'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsSource } from '../../../constants/enums'
import type { DefectiveGoodsCombinationFormValues } from '../../../schemas/defective-goods.schema'

export const ShoeSourceFieldControl: React.FC<
	Partial<SelectFieldControlProps<DefectiveGoodsCombinationFormValues, Record<'label' | 'value', string>>>
> = (props) => {
	const { t } = useTranslation()

	return (
		<SelectFieldControl
			label={t('ns_erp:fields.shoe_source')}
			labelField='label'
			name='shoe_source'
			valueField='value'
			datalist={Object.values(DefectiveGoodsSource).map((source) => ({
				label: t(`ns_inoutbound:shoes_source.${source}`),
				value: source
			}))}
			{...props}
		/>
	)
}
