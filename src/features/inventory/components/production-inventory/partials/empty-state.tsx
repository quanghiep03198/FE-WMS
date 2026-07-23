import { Div, Icon, Typography } from '@components/ui'
import useQueryParams from '@hooks/use-query-params'
import { isEmpty } from 'lodash-es'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import DownloadExcelButton from './download-excel-button'

const EmptyState: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { searchParams } = useQueryParams()
	const ref = useRef<HTMLDivElement>(null)

	const shouldRender = isEmpty(searchParams)

	useEffect(() => {
		if (!shouldRender) {
			requestAnimationFrame(() => {
				ref.current.classList.add(
					'animate-out',
					'fade-out-0',
					'slide-out-to-top-2',
					'duration-500',
					'ease-out',
					'hidden'
				)
			})
		}
	}, [shouldRender])

	const inventoryHints: Array<{
		icon: React.ComponentProps<typeof Icon>['name']
		title: string
		description: string
	}> = useMemo(
		() => [
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
		],
		[i18n.language]
	)

	return (
		<Div className='transition-allow-discret xxl:space-y-10 mx-auto w-full max-w-5xl xl:space-y-6'>
			<Div ref={ref} className='flex flex-col items-stretch divide-y'>
				{inventoryHints.map((item, index) => (
					<Div
						key={index.toString()}
						className='grid grid-cols-[3rem_auto] items-center gap-x-2 py-6 [&>svg]:place-self-center'>
						<Icon name={item.icon} size={32} strokeWidth={1} />
						<Div className='space-y-2'>
							<Typography as='h6' className='text-base font-medium'>
								{item.title}
							</Typography>
							<Typography variant='small' color='muted'>
								{item.description}
							</Typography>
						</Div>
					</Div>
				))}
			</Div>
			<Div className='flex w-full justify-center'>
				<DownloadExcelButton size='lg' />
			</Div>
		</Div>
	)
}

export default EmptyState
