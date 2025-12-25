import { SelectFieldControl } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsSource } from '../../../-constants'

export const ShoeSourceFieldControl: React.FC = () => {
	const { t } = useTranslation()

	return (
		<SelectFieldControl
			name='shoe_source'
			label={t('ns_erp:fields.shoe_source')}
			datalist={Object.values(DefectiveGoodsSource).map((source) => ({
				label: t(`ns_inoutbound:shoes_source.${source}`),
				value: source
			}))}
			labelField='label'
			valueField='value'
		/>
	)
}
