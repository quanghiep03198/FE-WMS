import { type SelectFieldControlProps, SelectFieldControl } from '@components/forms/select'

import { useGetProductSpecsQuery } from '@features/product-specification/hooks/use-product-specs-request'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSwitchCombinationStrategy } from '../../../hooks/use-switch-combination-strategy'
import type { DefectiveGoodsCombinationFormValues } from '../../../schemas/defective-goods.schema'

type BrandFieldControl = Partial<
	SelectFieldControlProps<DefectiveGoodsCombinationFormValues, Record<'label' | 'value', string>>
>

const BrandFieldControl: React.FC<BrandFieldControl> = ({ disabled, ...props }) => {
	const { t } = useTranslation()
	const { reset, getValues } = useFormContext()
	const { data: productSpecification } = useGetProductSpecsQuery()
	// Memoized options for brand select
	const { currentStrategy } = useSwitchCombinationStrategy()
	const brandOptions = useMemo(() => {
		if (!Array.isArray(productSpecification)) return []
		return [...new Set(productSpecification.map((item) => item.brand_name))].map((brand) => ({
			label: brand,
			value: brand
		}))
	}, [productSpecification])

	return (
		<SelectFieldControl
			{...props}
			datalist={brandOptions}
			disabled={disabled}
			label={t('ns_erp:fields.brand_name')}
			labelField='label'
			name='brand_name'
			valueField='value'
			placeholder={t('ns_common:form_placeholder.fill', {
				object: String(t('ns_erp:fields.brand_name')).toLowerCase(),
				defaultValue: null
			})}
			onValueChange={() => {
				reset({
					...getValues(),
					factory_shoes_style: '',
					cust_shoes_style: '',
					color_sn: '',
					...(currentStrategy !== 'manually' ? { size_code: '' } : { sizes: [] })
				})
			}}
		/>
	)
}

export default BrandFieldControl
