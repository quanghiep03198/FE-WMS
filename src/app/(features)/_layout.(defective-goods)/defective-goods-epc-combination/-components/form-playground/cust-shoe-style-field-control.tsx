import { AutoCompleteFieldControl } from '@/components/ui'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'
import { DefAutoCompleteFieldControlProps } from './type'

const CustShoeStyleFieldControl: React.FC<DefAutoCompleteFieldControlProps> = ({
	loading,
	readOnly,
	disabled,
	...props
}) => {
	const { t } = useTranslation()
	const { reset, getValues, control, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()

	const currentBrand = useWatch({ name: 'brand_name', control })

	const custShoeStyleOptions = useMemo(() => {
		if (!currentBrand || !Array.isArray(ctx['productSpecification'])) return []
		const brand = ctx['productSpecification'].find((item) => item.brand_name === currentBrand)
		if (!brand?.product_variants) return []
		return brand.product_variants.map(({ cust_shoes_style }) => ({
			label: cust_shoes_style,
			value: cust_shoes_style
		}))
	}, [ctx['productSpecification'], currentBrand])

	const handleValueChange = (value) => {
		reset({
			...getValues(),
			factory_shoes_style:
				ctx['productSpecification']
					.find((item) => item.brand_name === currentBrand)
					?.product_variants?.find((item) => item.cust_shoes_style === value)?.factory_shoes_style ?? '',
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
			labelField='label'
			valueField='value'
			readOnly={readOnly}
			disabled={disabled}
			onInput={handleValueChange}
			onSelect={handleValueChange}
		/>
	)
}

export default CustShoeStyleFieldControl
