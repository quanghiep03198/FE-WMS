import { UserRole } from '@common/constants/enums'
import { RoleGuard } from '@components/guards/role-guard'
import { Div, Typography } from '@components/ui'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import DataTable from '@features/order/components/purchase-order-seeking/data-table'
import PlaceholderSection from '@features/order/components/purchase-order-seeking/placeholder-section'
import SearchForm from '@features/order/components/purchase-order-seeking/search-form'
import useQueryParams from '@hooks/use-query-params'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/purchase-order-seeking')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	const { setBreadcrumb } = useBreadcrumbContext()
	const { searchParams } = useQueryParams<{ po: string }>()

	useEffect(() => {
		setBreadcrumb([{ to: '/purchase-order-seeking', text: t('ns_common:navigation.purchase_order_search') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.purchase_order_search')}</title>
			<meta name='description' content='Search processing purchase order' />

			<RoleGuard
				authorizedRoles={[
					UserRole.ADMIN,
					UserRole.MANAGER,
					UserRole.FG_WAREHOUSE_STAFF,
					UserRole.IE_STAFF,
					UserRole.INDUSTRIAL_ENGINEERING_STAFF
				]}>
				<Div
					as='section'
					className='xxl:max-w-7xl mx-auto flex min-h-(--outlet-wrapper-height) flex-col place-content-center items-stretch gap-y-6'>
					<Typography variant='h2' className='bg-background z-10 text-center font-medium capitalize'>
						{t('ns_erp:titles.purchase_order_seeking')}
					</Typography>
					<SearchForm />
					{searchParams.po && <DataTable />}
					{!searchParams.po && <PlaceholderSection />}
				</Div>
			</RoleGuard>
		</Fragment>
	)
}
