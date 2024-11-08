import { createFileRoute } from '@tanstack/react-router'
import { useLocalStorageState } from 'ahooks'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useBreadcrumbContext } from '../_contexts/-breadcrumb-context'
import { ConnectionInsight } from './_components/_connection-insight/-index'
import ScannedEpcCounter from './_components/_epc-counter/-index'
import EpcListBox from './_components/_epc-data-list/-index'
import OrderSizeDetailTable from './_components/_manufacturing-order-detail/-order-size-table'
import ScannerToolbar from './_components/_scanner-toolbar/-index'
import { PM_RFID_SETTINGS_KEY } from './_constants/index.const'
import { PageProvider } from './_contexts/-page-context'

export const Route = createFileRoute('/(features)/_layout/production-management-inbound/')({
	component: Page
})

export type RFIDSettings = {
	pollingDuration: number
	fullscreenMode: boolean
}

export const DEFAULT_PM_RFID_SETTINGS: RFIDSettings = {
	pollingDuration: 750,
	fullscreenMode: false
}

function Page() {
	const { t, i18n } = useTranslation()

	// * Set page breadcrumb
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/production-management-inbound', text: t('ns_common:navigation.pm_inbound') }])
	}, [i18n.language])

	const [settings, setSettings] = useLocalStorageState<RFIDSettings>(PM_RFID_SETTINGS_KEY, {
		defaultValue: DEFAULT_PM_RFID_SETTINGS,
		listenStorageChange: true
	})

	useEffect(() => {
		if (!settings) {
			setSettings(DEFAULT_PM_RFID_SETTINGS)
		}
	}, [settings])

	return (
		<PageProvider>
			<PanelGroup.Container data-screen={settings?.fullscreenMode && 'fullscreen'}>
				<ScannerToolbar />
				<PanelGroup.Wrapper>
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
				</PanelGroup.Wrapper>
			</PanelGroup.Container>
		</PageProvider>
	)
}

const PanelGroup = {
	Container: tw.div`group space-y-3 bg-background
		data-[screen=fullscreen]:fixed
		data-[screen=fullscreen]:p-6
		data-[screen=fullscreen]:z-50
		data-[screen=fullscreen]:inset-0
		data-[screen=fullscreen]:w-screen
		data-[screen=fullscreen]:h-screen
		data-[screen=fullscreen]:overflow-y-auto`,
	Wrapper: tw.div`
		grid grid-cols-12 grid-rows-12 items-stretch gap-x-6 gap-y-3 max-h-none grid-flow-col
		xl:max-h-[85vh]
		xxl:max-h-[90vh]
		group-data-[screen=fullscreen]:max-h-screen
	`,
	CounterPanel: tw.div`
		order-1
		col-span-full
		w-full
		row-span-full
		lg:col-span-5 
		xl:col-span-5 
		xxl:col-span-4 	
		lg:row-span-3
		xl:row-span-3
	`,
	InsightPanel: tw.div`
		order-2
		col-span-full
		lg:col-span-5  
		xl:col-span-5 
		xxl:col-span-4 
		lg:row-span-1
		xl:row-span-1
	`,
	DataPanel: tw.div`
		order-3 
		col-span-full
		row-span-8
		lg:col-span-5
		xl:col-span-5
		xxl:col-span-4
	`,
	DetailPanel: tw.div`
		order-last
		col-span-full 
		row-span-12
		lg:col-span-7 
		xl:col-span-7 
		xxl:col-span-8 
	`
}
