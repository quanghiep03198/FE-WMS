import { AutoCompleteFieldControl } from '@/components/ui'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'
import { DefectiveCategory } from '../../../-constants'
import { DefAutoCompleteFieldControlProps } from './type'

const SizeFieldControl: React.FC<DefAutoCompleteFieldControlProps> = ({ loading, disabled, datalist }) => {
	const { t } = useTranslation()
	const { control, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()

	const productSpecification = Array.isArray(ctx['productSpecification']) ? ctx['productSpecification'] : []
	const currentCategory = useWatch({ control: control, name: 'category' })
	const currentBrand = useWatch({ control: control, name: 'brand_name' })
	const currentFactoryShoeStyle = useWatch({ control: control, name: 'factory_shoes_style' })
	const currentColor = useWatch({ control: control, name: 'color_sn' })

	const shouldRequireFullInfo: boolean =
		currentCategory === DefectiveCategory.B_GRADE || currentCategory === DefectiveCategory.C_GRADE

	// Memoized options for size select
	const sizeOptions = useMemo(() => {
		if (!Array.isArray(productSpecification) || !currentBrand || !currentFactoryShoeStyle || !currentColor) return []
		if (shouldRequireFullInfo && Array.isArray(datalist)) return datalist
		const brand = productSpecification.find((item) => item.brand_name === currentBrand)
		const variant = brand?.product_variants?.find((item) => item.factory_shoes_style === currentFactoryShoeStyle)
		const spec = variant?.specs?.find((item) => item.color_sn === currentColor)
		if (!spec?.sizes) return []
		return spec.sizes
			.sort((a, b) => Number(a.size) - Number(b.size))
			.map(({ size }) => ({
				label: size,
				value: size
			}))
	}, [datalist, productSpecification, currentBrand, currentFactoryShoeStyle, currentColor, shouldRequireFullInfo])

	return (
		<AutoCompleteFieldControl
			name='size_code'
			label='Size'
			placeholder={t('ns_common:form_placeholder.fill', {
				object: 'size',
				defaultValue: null
			})}
			disabled={disabled}
			loading={loading}
			datalist={sizeOptions}
			labelField='label'
			valueField='value'
		/>
	)
}

export default SizeFieldControl
