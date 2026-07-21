import HostCompatibleGuard from '@/components/guards/host-compatible-guard'
import IpPolicyGuard from '@/components/guards/ip-policy-guard'
import { RoleGuard } from '@/components/guards/role-guard'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui'
import DatalistPanel from '@/features/defective-goods/components/defective-goods-combination/data-list-panel'
import DetailDialog from '@/features/defective-goods/components/defective-goods-combination/data-list-panel/detail-dialog'
import DefectiveGoodsForm from '@/features/defective-goods/components/defective-goods-combination/form-playground'
import { UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import { PageContextProvider } from '@features/defective-goods/contexts/page-context'
import { MobileReaderPlayground } from '@features/rfid-agent/components/mobile-playground'
import RFIDReaderPlayground from '@features/rfid-agent/components/playground'
import { ReaderPlaygroundProvider } from '@features/rfid-agent/contexts/rfid-reader-playground.context'
import useMediaQuery from '@hooks/use-media-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useBreadcrumbContext } from '../../../../contexts/breadcrumb-context'
import { useSwitchCombinationStrategy } from '../../../../features/defective-goods/hooks/use-switch-combination-strategy'
import { useToggleListPanel } from '../../../../features/defective-goods/hooks/use-toggle-list-panel'

export const Route = createLazyFileRoute('/(features)/_layout/(defective-goods)/defective-goods-epc-combination')({
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

			<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.DG_WAREHOUSE_STAFF]}>
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
			</RoleGuard>
		</Fragment>
	)
}

const Container = tw.div`
	relative group/container bg-background h-(--outlet-wrapper-height) @container/playground-wrapper overflow-hidden
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
