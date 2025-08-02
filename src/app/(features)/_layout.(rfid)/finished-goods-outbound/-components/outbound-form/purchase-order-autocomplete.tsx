import { useSearchPurchaseOrderQuery } from '@/app/(features)/-hooks/use-order-asm'
import { cn } from '@/common/utils/cn'
import { AutoCompleteFieldControl, Div, Icon } from '@/components/ui'
import { useDebounce } from 'ahooks'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const PurchaseOrderAutoComplete: React.FC = () => {
	const { t } = useTranslation()
	const { control, setValue } = useFormContext()
	const value = useWatch({ control, name: 'po' })
	const debouncedSearchTerm = useDebounce(value, { wait: 500 })
	const { data: purchaseOrders, isLoading } = useSearchPurchaseOrderQuery(debouncedSearchTerm)

	return (
		<AutoCompleteFieldControl
			label={t('ns_erp:fields.po')}
			name='po'
			datalist={purchaseOrders}
			shouldFilter={false}
			placeholder={t('ns_common:form_placeholder.fill', { object: 'PO', defaultValue: 'PO' })}
			labelField='po'
			valueField='po'
			loading={isLoading}
			template={({ value }) => (
				<Div
					className={cn(
						'flex h-8 cursor-pointer items-center justify-between rounded-md p-2 text-sm hover:bg-secondary hover:text-secondary-foreground',
						value.is_completed && 'cursor-auto text-muted-foreground opacity-80'
					)}
					onClick={(e) => {
						if (value.is_completed) {
							e.stopPropagation()
							e.preventDefault()
							return
						}
						setValue('po', value.po)
					}}>
					{value.po}
					{value.is_completed && <Icon name='BadgeCheck' size={18} />}
				</Div>
			)}
		/>
	)
}

export default PurchaseOrderAutoComplete
