import type { AutoCompleteFieldControlProps } from '@/components/ui'
import { AutoCompleteFieldControl } from '@/components/ui'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'

const CustShoeStyleFieldControl: React.FC<
	Partial<
		AutoCompleteFieldControlProps<
			DefectiveGoodsCombinationFormValues,
			Record<'factory_shoes_style' | 'cust_shoes_style', string>
		>
	>
> = ({ loading, readOnly, disabled, ...props }) => {
	const { t } = useTranslation()
	const { reset, getValues, control, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()

	const productSpecification = Array.isArray(ctx['productSpecification']) ? ctx['productSpecification'] : []
	const currentBrand = useWatch({ name: 'brand_name', control })

	const custShoeStyleOptions = useMemo(() => {
		if (!productSpecification.length) return []
		if (!currentBrand)
			return productSpecification
				.flatMap((item) =>
					item.product_variants.map(({ factory_shoes_style, cust_shoes_style }) => ({
						factory_shoes_style,
						cust_shoes_style
					}))
				)
				.sort((a, b) => b.cust_shoes_style?.localeCompare(a.cust_shoes_style))
		const brand = productSpecification.find((item) => item.brand_name === currentBrand)
		if (!brand?.product_variants) return []
		return brand.product_variants
			.map(({ factory_shoes_style, cust_shoes_style }) => ({
				factory_shoes_style,
				cust_shoes_style
			}))
			.sort((a, b) => b.cust_shoes_style?.localeCompare(a.cust_shoes_style))
	}, [productSpecification, currentBrand])

	const handleValueChange = (value: Record<'factory_shoes_style' | 'cust_shoes_style', string>) => {
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
			name='cust_shoes_style'
			label={t('ns_erp:fields.cust_shoes_style')}
			placeholder={t('ns_common:form_placeholder.fill', {
				object: String(t('ns_erp:fields.cust_shoes_style')).toLowerCase(),
				defaultValue: null
			})}
			loading={loading}
			datalist={custShoeStyleOptions}
			labelField='cust_shoes_style'
			valueField='cust_shoes_style'
			readOnly={readOnly}
			disabled={disabled}
			onItemClick={handleValueChange}
		/>
	)
}

export default CustShoeStyleFieldControl
