import { cn } from '@/common/utils/cn'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import DefectiveGoodList from './-components/data-list-panel'
import DefectiveDetailDialog from './-components/data-list-panel/defective-detail-dialog'
import DefectiveGoodsForm from './-components/form-playground'
import RFIDReaderPlayground from './-components/rfid-reader-playground'
import { PageContextProvider } from './-contexts/page-context'
import { ReaderPlaygroundProvider } from './-contexts/rfid-reader-playground.context'
import { useSwitchRFIDDevice } from './-hooks/use-switch-rfid-device'
import { useToggleListPanel } from './-hooks/use-toggle-list-panel'

export const Route = createLazyFileRoute('/(features)/_layout/b-grade-goods-inbound/')({
	component: RouteComponent
})

function RouteComponent() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/b-grade-goods-inbound', text: t('ns_common:navigation.b_grade_goods_inbound') }])
	}, [i18n.language])

	const { currentDevice } = useSwitchRFIDDevice()
	const { listPanelOpen } = useToggleListPanel()

	const isUsingUHFReader = currentDevice === 'uhf'

	return (
		<Fragment>
			<title>{t('ns_common:navigation.b_grade_goods_inbound')}</title>
			<meta name='description' content='Matching EPCs for defective goods' />

			<Container>
				<PageContextProvider>
					<ResizablePanelGroup direction='horizontal' className='rounded-md border'>
						<ResizablePanel
							minSize={listPanelOpen ? 30 : 0}
							maxSize={listPanelOpen ? 40 : 0}
							defaultSize={listPanelOpen ? 30 : 0}
							className={cn(
								'transtion-max-width linear hidden h-full duration-200 will-change-transform @7xl:block',
								listPanelOpen && 'border-0'
							)}>
							<DefectiveGoodList />
						</ResizablePanel>
						{listPanelOpen && <ResizableHandle withHandle className='hidden @7xl:flex' />}
						<ResizablePanel defaultSize={50} minSize={40}>
							<DefectiveGoodsForm />
						</ResizablePanel>
						{isUsingUHFReader && <ResizableHandle disabled />}
						<ResizablePanel
							minSize={isUsingUHFReader ? 25 : 0}
							maxSize={isUsingUHFReader ? 25 : 0}
							defaultSize={isUsingUHFReader ? 25 : 0}
							className={cn(
								'transtion-max-width linear h-full duration-200 will-change-transform',
								!isUsingUHFReader && 'border-0'
							)}>
							<ReaderPlaygroundProvider>{isUsingUHFReader && <RFIDReaderPlayground />}</ReaderPlaygroundProvider>
						</ResizablePanel>
					</ResizablePanelGroup>
					<DefectiveDetailDialog />
				</PageContextProvider>
			</Container>
		</Fragment>
	)
}

const Container = tw.div`
	bg-background h-[var(--outlet-wrapper-height)] @container
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
	has-[#toggle-fullscreen[data-state=checked]]:animate-in
	has-[#toggle-fullscreen[data-state=checked]]:fade-in-0
	has-[#toggle-fullscreen[data-state=unchecked]]:fade-out-0
	has-[#toggle-fullscreen[data-state=unchecked]]:zoom-out-95
`
