import { AutoCompleteFieldControl } from '@/components/ui'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'
import { DefAutoCompleteFieldControlProps } from './type'

const ColorFieldControl: React.FC<DefAutoCompleteFieldControlProps> = ({ loading, readOnly, disabled, ...props }) => {
	const { t } = useTranslation()
	const { control, reset, getValues, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()
	const currentBrand = useWatch({ control: control, name: 'brand_name' })
	const currentFactoryShoeStyle = useWatch({ control: control, name: 'factory_shoes_style' })

	// Memoized options for color select
	const colorOptions = useMemo(() => {
		if (!currentBrand || !currentFactoryShoeStyle || !Array.isArray(ctx['productSpecification'])) return []
		const brand = ctx['productSpecification'].find((item) => item.brand_name === currentBrand)
		const variant = brand?.product_variants?.find((item) => item.factory_shoes_style === currentFactoryShoeStyle)
		if (!variant?.specs) return []
		return variant.specs.map(({ color_sn }) => ({
			label: color_sn,
			value: color_sn
		}))
	}, [ctx['productSpecification'], currentBrand, currentFactoryShoeStyle])

	return (
		<AutoCompleteFieldControl
			{...props}
			name='color_sn'
			label={t('ns_erp:fields.color_sn')}
			placeholder={t('ns_common:form_placeholder.fill', {
				object: String(t('ns_erp:fields.color_sn')).toLowerCase(),
				defaultValue: null
			})}
			disabled={disabled}
			loading={loading}
			readOnly={readOnly}
			datalist={colorOptions}
			labelField='label'
			valueField='value'
			onInput={() => {
				reset({ ...getValues(), size_code: '' })
			}}
		/>
	)
}

export default ColorFieldControl
