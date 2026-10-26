import type { AutoCompleteFieldControlProps } from '@components/forms/auto-complete'
import { AutoCompleteFieldControl } from '@components/forms/auto-complete'

import { useGetProductSpecsQuery } from '@features/product-specification/hooks/use-product-specs-request'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { DefectiveGoodsCombinationFormValues } from '../../../schemas/defective-goods.schema'

const CustShoeStyleFieldControl: React.FC<
	Partial<
		AutoCompleteFieldControlProps<
			DefectiveGoodsCombinationFormValues,
			Record<'factory_shoes_style' | 'cust_shoes_style', string>
		>
	>
> = ({ loading, readOnly, disabled, ...props }) => {
	const { t } = useTranslation()
	const { reset, getValues, control } = useFormContext()
	const { data: productSpecification } = useGetProductSpecsQuery()

	const currentBrand = useWatch({ name: 'brand_name', control })

	const custShoeStyleOptions = useMemo(() => {
		if (!Array.isArray(productSpecification)) return []
		return productSpecification
			.filter((item) => {
				if (!currentBrand) return true
				return item.brand_name === currentBrand
			})
			.toSorted((a, b) => b.cust_shoes_style.localeCompare(a.cust_shoes_style))
	}, [productSpecification, currentBrand])

	const handleValueChange = (value: Record<'factory_shoes_style' | 'cust_shoes_style', string>) => {
		reset({
			...getValues(),
			...value,
			color_sn: '',
			size_numcode: ''
		})
	}

	return (
		<AutoCompleteFieldControl
			{...props}
			datalist={custShoeStyleOptions}
			disabled={disabled}
			label={t('ns_erp:fields.cust_shoes_style')}
			labelField='cust_shoes_style'
			loading={loading}
			name='cust_shoes_style'
			readOnly={readOnly}
			valueField='cust_shoes_style'
			placeholder={t('ns_common:form_placeholder.fill', {
				object: String(t('ns_erp:fields.cust_shoes_style')).toLowerCase(),
				defaultValue: null
			})}
			onItemClick={handleValueChange}
		/>
	)
}

export default CustShoeStyleFieldControl
