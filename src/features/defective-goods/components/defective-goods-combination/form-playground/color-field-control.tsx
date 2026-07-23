import { AutoCompleteFieldControl } from '@components/ui'
import { uniqBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveCategory } from '../../../constants/enums'
import type { DefectiveGoodsCombinationFormValues } from '../../../schemas/defective-goods.schema'
import type { DefAutoCompleteFieldControlProps } from './type'

const ColorFieldControl: React.FC<DefAutoCompleteFieldControlProps> = ({ loading, readOnly, disabled, ...props }) => {
	const { t } = useTranslation()
	const { control, reset, getValues, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()
	const productSpecification = Array.isArray(ctx['productSpecification']) ? ctx['productSpecification'] : []
	const currentCategory = useWatch({ control: control, name: 'defective_category' })
	const currentBrand = useWatch({ control: control, name: 'brand_name' })
	const currentFactoryShoeStyle = useWatch({ control: control, name: 'factory_shoes_style' })
	const currentStrategy = useWatch({ control: control, name: 'ri_type' })

	// Memoized options for color select
	const colorOptions = useMemo(() => {
		if (!productSpecification.length) return []
		if (
			currentCategory === DefectiveCategory.RESEARCH_DEVELOPMENT ||
			!currentCategory ||
			(!currentBrand && !currentFactoryShoeStyle)
		) {
			return uniqBy(
				productSpecification
					.flatMap((item) =>
						item.product_variants.flatMap((variant) =>
							variant.specs.map(({ color_sn }) => ({
								label: color_sn,
								value: color_sn
							}))
						)
					)
					.sort((a, b) => a.label?.localeCompare(b.label)),
				(color) => color.value
			)
		}
		if (!currentBrand && currentFactoryShoeStyle) {
			return uniqBy(
				productSpecification
					.flatMap((item) =>
						item.product_variants
							.filter((variant) => variant.factory_shoes_style === currentFactoryShoeStyle)
							.flatMap((variant) =>
								variant.specs.map(({ color_sn }) => ({
									label: color_sn,
									value: color_sn
								}))
							)
					)
					.sort((a, b) => a.label?.localeCompare(b.label)),
				(color) => color.value
			)
		}
		const brand = productSpecification.find((item) => item.brand_name === currentBrand)
		const variant = brand?.product_variants?.find((item) => item.factory_shoes_style === currentFactoryShoeStyle)
		if (!variant?.specs) return []
		return variant.specs
			.map(({ color_sn }) => ({
				label: color_sn,
				value: color_sn
			}))
			.sort((a, b) => a.label?.localeCompare(b.label))
	}, [productSpecification, currentCategory, currentBrand, currentFactoryShoeStyle])

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
