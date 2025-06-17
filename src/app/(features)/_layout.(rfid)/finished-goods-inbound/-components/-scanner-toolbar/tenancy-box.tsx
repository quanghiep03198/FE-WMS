import { useGetTenantByFactory } from '@/app/(features)/-hooks/use-tenacy'
import env from '@/common/utils/env'
import { Div, Icon, Typography } from '@/components/ui'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../-contexts/page-context'

const TenacyBox: React.FC = () => {
	const { t } = useTranslation()
	const { setConnection } = usePageContext('setConnection')
	const { data, isLoading } = useGetTenantByFactory()

	useEffect(() => {
		setConnection(data?.id)
	}, [data])

	return (
		<Div className='inline-flex h-9 w-full basis-1/5 items-center gap-x-2 rounded-md border px-3 py-2 sm:hidden sm:basis-full sm:justify-center md:basis-1/3 lg:basis-1/3'>
			<Icon name='Server' size={18} />
			<Typography variant='small'>
				{isLoading
					? t('ns_common:status.loading')
					: t('ns_common:others.server', {
							alias:
								env('VITE_NODE_ENV') === 'development'
									? 'Local'
									: typeof data?.factory !== 'string'
										? data?.alias
										: t(`ns_common:factory.${data?.factory}`, { defaultValue: data?.factory }),
							defaultValue: data?.alias
						})}
			</Typography>
		</Div>
	)
}

export default TenacyBox
