import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useBreadcrumbContext } from '../_contexts/-breadcrumb-context'
import { ConnectionInsight } from './_components/_connection-insight/-index'
import ScannedEpcCounter from './_components/_epc-counter/-index'
import EpcListBox from './_components/_epc-data-list/-index'
import OrderSizeDetailTable from './_components/_manufacturing-order-detail/-order-size-table'
import ScannerToolbar from './_components/_scanner-toolbar/-index'
import { PageProvider } from './_contexts/-page-context'

export const Route = createFileRoute('/(features)/_layout/production-management-inbound/')({
	component: RouteComponent
})

function RouteComponent() {
	const { t, i18n } = useTranslation()

	// * Set page breadcrumb
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/production-management-inbound', text: t('ns_common:navigation.pm_inbound') }])
	}, [i18n.language])

	return (
		<PageProvider>
			<ScannerToolbar />
			<PanelGroup.Container>
				<PanelGroup.CounterPanel>
					<ScannedEpcCounter />
				</PanelGroup.CounterPanel>
				<PanelGroup.InsightPanel>
					<ConnectionInsight />
				</PanelGroup.InsightPanel>
				<PanelGroup.DataPanel>
					<EpcListBox />
				</PanelGroup.DataPanel>
				<PanelGroup.DetailPanel>
					<OrderSizeDetailTable />
				</PanelGroup.DetailPanel>
			</PanelGroup.Container>
		</PageProvider>
	)
}

const PanelGroup = {
	Container: tw.div`grid max-h-[85vh] grid-flow-col grid-cols-12 grid-rows-12 items-stretch gap-x-6 gap-y-3`,
	CounterPanel: tw.div`order-1 col-span-5 row-span-3 xxl:col-span-4`,
	InsightPanel: tw.div`col-span-5 xxl:col-span-4 row-span-1 order-2`,
	DataPanel: tw.div`order-3 col-span-5 row-span-8 xxl:col-span-4`,
	DetailPanel: tw.div`order-4 col-span-7 row-span-full xxl:col-span-8`
}
