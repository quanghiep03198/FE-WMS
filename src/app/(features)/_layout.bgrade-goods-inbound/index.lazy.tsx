import { Typography } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'

export const Route = createLazyFileRoute('/(features)/_layout/bgrade-goods-inbound/')({
	component: RouteComponent
})

function RouteComponent() {
	const { t, i18n } = useTranslation()

	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/bgrade-goods-inbound', text: t('ns_common:navigation.bgrade_goods_inbound') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.bgrade_goods_inbound')}</title>
			<meta name='description' content='Matching EPC for defective goods' />

			<Typography>Matching EPC for defective goods </Typography>
		</Fragment>
	)
}
