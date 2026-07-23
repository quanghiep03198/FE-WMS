import type { AutoCompleteFieldControlProps } from '@components/ui'
import { AutoCompleteFieldControl } from '@components/ui'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { DefectiveGoodsCombinationFormValues } from '../../../schemas/defective-goods.schema'

const FactoryShoeStyleFieldControl: React.FC<
	Partial<
		AutoCompleteFieldControlProps<
			DefectiveGoodsCombinationFormValues,
			Record<'factory_shoes_style' | 'cust_shoes_style', string>
		>
	>
> = ({ loading, readOnly, disabled, ...props }) => {
	const { t } = useTranslation()
	const { reset, setValue, getValues, control, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()

	const productSpecification = Array.isArray(ctx['productSpecification']) ? ctx['productSpecification'] : []
	const currentBrand = useWatch({ name: 'brand_name', control })

	// Memoized options for shoe style select
	const factoryShoeStyleOptions = useMemo(() => {
		if (!productSpecification.length) return []
		if (!currentBrand)
			return productSpecification
				.flatMap((item) =>
					item.product_variants.map(({ factory_shoes_style, cust_shoes_style }) => ({
						factory_shoes_style,
						cust_shoes_style
					}))
				)
				.sort((a, b) => b.factory_shoes_style?.localeCompare(a.factory_shoes_style))
		const brand = productSpecification.find((item) => item.brand_name === currentBrand)
		if (!brand?.product_variants) return []
		return brand.product_variants
			.map(({ factory_shoes_style, cust_shoes_style }) => ({
				factory_shoes_style,
				cust_shoes_style
			}))
			.sort((a, b) => b.factory_shoes_style?.localeCompare(a.factory_shoes_style))
	}, [productSpecification, currentBrand])

	const handleValueChange = (value) => {
		reset({
			...getValues(),
			...value,
			color_sn: '',
			size_code: ''
		})
	}

	return (
		<AutoCompleteFieldControl
			{...props}
			name='factory_shoes_style'
			label={t('ns_erp:fields.factory_shoes_style')}
			placeholder={t('ns_common:form_placeholder.fill', {
				object: String(t('ns_erp:fields.factory_shoes_style')).toLowerCase(),
				defaultValue: null
			})}
			loading={loading}
			datalist={factoryShoeStyleOptions}
			labelField='factory_shoes_style'
			valueField='factory_shoes_style'
			readOnly={readOnly}
			disabled={disabled}
			onInput={(value) => setValue('factory_shoes_style', value.toUpperCase())}
			onItemClick={handleValueChange}
		/>
	)
}

export default FactoryShoeStyleFieldControl
