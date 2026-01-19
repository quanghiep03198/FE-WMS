import HostCompatibleGuard from '@/app/-components/-guard/host-compatible-guard'
import IpPolicyGuard from '@/app/-components/-guard/ip-policy-guard'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import RFIDReaderPlayground from '../-components/rfid-reader-playground'
import { PageContextProvider } from '../-contexts/page-context'
import { ReaderPlaygroundProvider } from '../-contexts/rfid-reader-playground.context'
import { useSwitchCombinationStrategy } from '../-hooks/use-switch-combination-strategy'
import { useBreadcrumbContext } from '../../-contexts/breadcrumb-context'
import DatalistPanel from './-components/data-list-panel'
import DetailDialog from './-components/data-list-panel/detail-dialog'
import DefectiveGoodsForm from './-components/form-playground'
import { MobileReaderPlayground } from './-components/mobile-rfid-reader-playground'
import { useToggleListPanel } from './-hooks/use-toggle-list-panel'

export const Route = createLazyFileRoute('/(features)/_layout/(defective-goods)/defective-goods-epc-combination/')({
	component: RouteComponent
})

function RouteComponent() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()
	const isMobile = useMediaQuery('(max-width: 1023px)')

	useEffect(() => {
		setBreadcrumb([
			{ to: '/defective-goods-epc-combination', text: t('ns_common:navigation.defective_goods_epc_combination') }
		])
	}, [i18n.language])

	const { currentStrategy } = useSwitchCombinationStrategy()
	const { listPanelOpen } = useToggleListPanel()

	const isUsingUHFReader = currentStrategy === 'uhf'

	return (
		<Fragment>
			<title>{t('ns_common:navigation.defective_goods_epc_combination')}</title>
			<meta name='description' content='Matching EPCs for defective goods' />
			<IpPolicyGuard>
				<HostCompatibleGuard>
					<Container>
						<PageContextProvider>
							<ResizablePanelGroup
								className='relative rounded-md border'
								direction={isMobile ? 'vertical' : 'horizontal'}
								style={
									{
										'--bar-height': '52px'
									} as React.CSSProperties
								}>
								<ResizablePanel
									minSize={listPanelOpen ? 30 : 0}
									maxSize={listPanelOpen ? 40 : 0}
									defaultSize={listPanelOpen ? 30 : 0}
									className={cn(
										'transtion-max-width linear hidden h-full duration-200 will-change-transform @7xl/playground-wrapper:block',
										'group-has-[div[data-resize-handle-state=drag]]/container:transition-none',
										listPanelOpen && 'border-0'
									)}>
									<DatalistPanel />
								</ResizablePanel>
								{listPanelOpen && (
									<ResizableHandle
										withHandle
										className='hidden w-px border-0 shadow-none ring-transparent @7xl/playground-wrapper:flex'
									/>
								)}
								<ResizablePanel defaultSize={50} minSize={isMobile ? 50 : 40} className='h-full'>
									<DefectiveGoodsForm />
								</ResizablePanel>
								{isUsingUHFReader && !isMobile && <ResizableHandle disabled />}
								<ResizablePanel
									minSize={!isUsingUHFReader ? 0 : isMobile ? 0 : 25}
									maxSize={!isUsingUHFReader ? 0 : isMobile ? 0 : 25}
									defaultSize={!isUsingUHFReader ? 0 : isMobile ? 0 : 25}
									className={cn(
										'transtion-max-width linear h-full duration-200 will-change-transform',
										'group-has-[div[data-resize-handle-state=drag]]/container:transition-none',
										!isUsingUHFReader && 'border-0'
									)}>
									<ReaderPlaygroundProvider>
										{isUsingUHFReader && <RFIDReaderPlayground />}
									</ReaderPlaygroundProvider>
								</ResizablePanel>
							</ResizablePanelGroup>
							{createPortal(<DetailDialog />, document.body)}
							<MobileReaderPlayground />
						</PageContextProvider>
					</Container>
				</HostCompatibleGuard>
			</IpPolicyGuard>
		</Fragment>
	)
}

const Container = tw.div`
	relative group/container bg-background h-[var(--outlet-wrapper-height)] @container/playground-wrapper overflow-hidden 
	has-[#toggle-fullscreen[data-state=checked]]:fixed
	has-[#toggle-fullscreen[data-state=checked]]:p-6
	has-[#toggle-fullscreen[data-state=checked]]:z-50
	has-[#toggle-fullscreen[data-state=checked]]:inset-0
   has-[#toggle-fullscreen[data-state=checked]]:w-screen
   has-[#toggle-fullscreen[data-state=checked]]:h-screen
   has-[#toggle-fullscreen[data-state=checked]]:overflow-y-auto
   has-[#toggle-fullscreen[data-state=checked]]:flex
   has-[#toggle-fullscreen[data-state=checked]]:justify-center
   has-[#toggle-fullscreen[data-state=checked]]:items-center
`
