import { useBreadcrumb } from '@/common/hooks/use-breadcrumb'
import useQueryParams from '@/common/hooks/use-query-params'
import { BreadcrumbContext } from '@/components/providers/breadcrumbs-provider'
import Loading from '@/components/shared/loading'
import { WarehouseService } from '@/services/warehouse.service'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams, useRouter } from '@tanstack/react-router'
import { useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/')({
	component: WarehouseStorageDetail,
	pendingComponent: Loading
})

function WarehouseStorageDetail() {
	const { warehouseNum } = useParams({ strict: false })
	const { searchParams } = useQueryParams({ page: 1, limit: 20 })
	const { t } = useTranslation()

	useBreadcrumb([
		{ href: '/warehouse', title: t('ns_common:navigation.wh_management') },
		{ href: '/warehouse/storage-details/$warehouseNum', title: warehouseNum, params: { warehouseNum } }
	])

	const { data } = useQuery({
		queryKey: ['warehouses', warehouseNum, searchParams],
		queryFn: () => WarehouseService.getWarehouseStorageDetail(warehouseNum)
	})

	const route = useRouter()
	console.log(route.routesByPath)

	return <>{/* <DataTable/> */}</>
}
