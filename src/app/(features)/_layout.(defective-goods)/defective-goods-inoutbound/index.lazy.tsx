import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import { Div, ResizableHandle, ResizablePanel, ResizablePanelGroup, Typography } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useSize } from 'ahooks'
import { Fragment, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import RfidReaderPlayground from '../-components/rfid-reader-playground'
import { PageContextProvider } from '../-contexts/page-context'
import { ReaderPlaygroundProvider } from '../-contexts/rfid-reader-playground.context'
import { useBreadcrumbContext } from '../../-contexts/breadcrumb-context'
import DetailTable from './-components/detail-table'
import InoutboundForm from './-components/inoutbound-form'

export const Route = createLazyFileRoute('/(features)/_layout/(defective-goods)/defective-goods-inoutbound/')({
	component: RouteComponent
})

function RouteComponent() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()
	const isSmallScreen = useMediaQuery('(max-width: 1279px)')

	useEffect(() => {
		setBreadcrumb([
			{ to: '/defective-goods-epc-combination', text: t('ns_common:navigation.defective_goods_inoutbound') }
		])
	}, [i18n.language])

	const detailTablePanelRef = useRef<HTMLDivElement>(null)
	const rfidPlaygroundPanelRef = useRef<HTMLDivElement>(null)
	const rfidPlaygroundPanelSize = useSize(rfidPlaygroundPanelRef)
	const detailTablePanelSize = useSize(detailTablePanelRef)

	return (
		<Fragment>
			<title>{t('ns_common:navigation.defective_goods_inoutbound')}</title>
			<meta name='description' content='Defective goods inoutbound' />

			<PageContextProvider>
				<Div
					style={
						{
							'--header-height': '64px',
							'--bar-height': '48px'
						} as React.CSSProperties
					}
					className={cn(
						'flex h-[var(--outlet-wrapper-height)] border-collapse flex-col divide-y divide-border rounded-md border @container',
						!isSmallScreen && 'overflow-hidden'
					)}>
					<ReaderPlaygroundProvider>
						<Div
							className={cn(
								'col-span-full flex h-[var(--header-height)] items-center bg-background px-4 py-2',
								isSmallScreen ? 'justify-end' : 'justify-between'
							)}>
							<Typography variant='h4' className='hidden @5xl:block'>
								{t('ns_common:navigation.defective_goods_inoutbound')}
							</Typography>
							<InoutboundForm />
						</Div>
						<ResizablePanelGroup
							direction={isSmallScreen ? 'vertical' : 'horizontal'}
							className={cn('h-[calc(var(--outlet-wrapper-height)-var(--header-height))]')}
							style={
								{
									'--rfid-playground-panel-height': rfidPlaygroundPanelSize
										? rfidPlaygroundPanelSize.height + 'px'
										: '100%',
									'--detail-table-panel-height': detailTablePanelSize
										? detailTablePanelSize.height + 'px'
										: '100%'
								} as React.CSSProperties
							}>
							<ResizablePanel
								minSize={isSmallScreen ? 35 : 65}
								maxSize={isSmallScreen ? 50 : 75}
								defaultSize={isSmallScreen ? 30 : 65}>
								<PanelContent ref={detailTablePanelRef}>
									<DetailTable />
								</PanelContent>
							</ResizablePanel>
							<ResizableHandle withHandle={true} className='z-30' />
							<ResizablePanel
								maxSize={isSmallScreen ? 65 : 35}
								minSize={isSmallScreen ? 50 : 25}
								defaultSize={isSmallScreen ? 65 : 30}>
								<PanelContent ref={rfidPlaygroundPanelRef}>
									<RfidReaderPlayground
										style={
											{
												'--playground-header-height': 'var(--bar-height)',
												'--playground-actions-height': 'var(--bar-height)'
											} as React.CSSProperties
										}
									/>
								</PanelContent>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ReaderPlaygroundProvider>
				</Div>
			</PageContextProvider>
		</Fragment>
	)
}

const PanelContent = tw.div`h-full w-full place-content-stretch place-items-stretch`
