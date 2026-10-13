import { AutoCompleteFieldControl } from '@components/forms/auto-complete'
import { DefectiveCategory } from '@features/defective-goods/constants/enums'
import { useGetProductSpecsQuery } from '@features/product-specification/hooks/use-product-specs-request'
import { uniqBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { DefAutoCompleteFieldControlProps } from './type'

const ColorFieldControl: React.FC<DefAutoCompleteFieldControlProps> = ({ loading, readOnly, disabled, ...props }) => {
	const { t } = useTranslation()
	const { control, reset, getValues } = useFormContext()
	const { data: productSpecification } = useGetProductSpecsQuery()
	const currentCategory = useWatch({ control: control, name: 'defective_category' })
	const currentBrand = useWatch({ control: control, name: 'brand_name' })
	const currentFactoryShoeStyle = useWatch({ control: control, name: 'factory_shoes_style' })
	const currentStrategy = useWatch({ control: control, name: 'ri_type' })

	const shouldFilterAllSizes: boolean = currentCategory === DefectiveCategory.RESEARCH_DEVELOPMENT

	// Memoized options for color select
	const colorOptions = useMemo(() => {
		if (!Array.isArray(productSpecification)) return []

		return uniqBy(
			productSpecification
				.filter((item) => {
					if (!currentFactoryShoeStyle || shouldFilterAllSizes) return true
					return item.factory_shoes_style === currentFactoryShoeStyle
				})
				.flatMap((item) => item.product_variants.map((item) => ({ label: item.color_sn, value: item.color_sn }))),
			(item) => item.value
		)
	}, [productSpecification, currentCategory, currentBrand, currentFactoryShoeStyle])

	return (
		<AutoCompleteFieldControl
			{...props}
			datalist={colorOptions}
			disabled={disabled}
			label={t('ns_erp:fields.color_sn')}
			labelField='label'
			loading={loading}
			name='color_sn'
			readOnly={readOnly}
			valueField='value'
			placeholder={t('ns_common:form_placeholder.fill', {
				object: String(t('ns_erp:fields.color_sn')).toLowerCase(),
				defaultValue: null
			})}
			onInput={(value) =>
				reset({
					...getValues(),
					...(currentStrategy === 'manually' ? { sizes: [] } : { size_code: '' }),
					color_sn: value.toUpperCase()
				})
			}
		/>
	)
}

export default ColorFieldControl
