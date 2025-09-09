import { Div, ResizableHandle, ResizablePanel, ResizablePanelGroup, Typography } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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

	useEffect(() => {
		setBreadcrumb([
			{ to: '/defective-goods-epc-combination', text: t('ns_common:navigation.defective_goods_inoutbound') }
		])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.defective_goods_inoutbound')}</title>
			<meta name='description' content='Defective goods inoutbound' />

			<PageContextProvider>
				<Div
					style={
						{
							'--header-height': '64px',
							'--row-height': '48px'
						} as React.CSSProperties
					}
					className='flex h-[var(--outlet-wrapper-height)] border-collapse flex-col divide-y divide-border overflow-hidden rounded-md border *:!box-border'>
					<ReaderPlaygroundProvider>
						<Div className='col-span-full flex h-[var(--header-height)] items-center justify-between px-4 py-2'>
							<Typography variant='h4'>{t('ns_common:navigation.defective_goods_inoutbound')}</Typography>
							<InoutboundForm />
						</Div>
						<ResizablePanelGroup
							direction='horizontal'
							className='h-[calc(var(--outlet-wrapper-height)-var(--header-height))]'>
							<ResizablePanel minSize={70} maxSize={80}>
								<DetailTable />
							</ResizablePanel>
							<ResizableHandle withHandle={true} className='z-20' />
							<ResizablePanel maxSize={30} minSize={20} defaultSize={25}>
								<RfidReaderPlayground
									style={
										{
											'--playground-header-height': 'var(--row-height)',
											'--playground-actions-height': 'var(--row-height)'
										} as React.CSSProperties
									}
								/>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ReaderPlaygroundProvider>
				</Div>
			</PageContextProvider>
		</Fragment>
	)
}
