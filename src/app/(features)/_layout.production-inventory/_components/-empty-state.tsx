import useQueryParams from '@/common/hooks/use-query-params'
import { Div, Icon, Typography } from '@/components/ui'
import { isEmpty } from 'lodash'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

const EmptyState: React.FC = () => {
	const { t } = useTranslation()
	const { searchParams } = useQueryParams()

	const shouldRender = isEmpty(searchParams)

	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!shouldRender) {
			requestAnimationFrame(() => {
				ref.current.classList.add(
					'animate-out',
					'fade-out-0',
					'slide-out-to-top-2',
					'duration-200',
					'ease-out',
					'hidden'
				)
			})
		}
	}, [shouldRender])

	// 	inventory_by_size
	// inventory_by_size_desc
	// inventory_audit
	// inventory_audit_desc
	// outbound_order_estimation
	// outbound_order_estimation_desc

	const inventoryHints: Array<{
		icon: React.ComponentProps<typeof Icon>['name']
		title: string
		description: string
	}> = [
		{
			icon: 'PackageOpen',
			title: t('ns_inoutbound:description.inventory_by_size'),
			description: t('ns_inoutbound:description.inventory_by_size_desc')
		},
		{
			icon: 'Forklift',
			title: t('ns_inoutbound:description.inventory_audit'),
			description: t('ns_inoutbound:description.inventory_audit_desc')
		},
		{
			icon: 'Ship',
			title: t('ns_inoutbound:description.outbound_order_estimation'),
			description: t('ns_inoutbound:description.outbound_order_estimation_desc')
		}
	]

	return (
		<Div ref={ref} className='order-last flex flex-col items-stretch divide-y transition-allow-discrete'>
			{inventoryHints.map((item, index) => (
				<Div key={index.toString()} className='grid grid-cols-[3rem_auto] items-center py-6'>
					<Icon name={item.icon} size={32} strokeWidth={1} />
					<Div className='space-y-2'>
						<Typography className='font-medium'>{item.title}</Typography>
						<Typography variant='small' color='muted'>
							{item.description}
						</Typography>
					</Div>
				</Div>
			))}
		</Div>
	)
}

export default EmptyState
