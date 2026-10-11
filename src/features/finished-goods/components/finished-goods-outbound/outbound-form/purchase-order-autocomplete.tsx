import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { AutoCompleteFieldControl } from '@components/forms/auto-complete'
import { Icon } from '@components/ui/icon'
import { useSearchPurchaseOrderQuery } from '@features/order/hooks/use-order-request'
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
			datalist={purchaseOrders ?? []}
			label={t('ns_erp:fields.po')}
			labelField='po'
			loading={isLoading}
			name='po'
			placeholder={t('ns_common:form_placeholder.fill', { object: 'PO', defaultValue: 'PO' })}
			shouldFilter={false}
			valueField='po'
			template={({ value }) => (
				<Div
					className={cn(
						'hover:bg-secondary hover:text-secondary-foreground flex h-8 cursor-pointer items-center justify-between rounded-md p-2 text-sm',
						value.is_completed && 'text-muted-foreground cursor-auto opacity-80'
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
