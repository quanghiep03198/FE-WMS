import { useGetTenantByFactory } from '@/app/(features)/_apis/use-tenacy.api'
import env from '@/common/utils/env'
import { Div, Icon, Typography } from '@/components/ui'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../_contexts/-page-context'

const TenacyBox: React.FC = () => {
	const { t } = useTranslation()
	const { setConnection } = usePageContext('setConnection')
	const { data } = useGetTenantByFactory()

	useEffect(() => {
		setConnection(data?.id)
	}, [data])

	if (!data) return null

	return (
		<Div className='inline-flex h-9 w-full basis-1/5 items-center gap-x-2 rounded-md border px-3 py-1 sm:basis-full sm:justify-center md:basis-1/3 lg:basis-1/3'>
			<Icon name='Server' size={18} stroke='hsl(var(--active))' />
			<Typography>
				{t('ns_common:others.server', {
					alias:
						env('VITE_NODE_ENV') === 'development'
							? 'Local'
							: typeof data.factory !== 'string'
								? data?.alias
								: t(`ns_common:factory.${data.factory}`, { defaultValue: data.factory }),
					defaultValue: data?.alias
				})}
			</Typography>
		</Div>
	)
}

export default TenacyBox
