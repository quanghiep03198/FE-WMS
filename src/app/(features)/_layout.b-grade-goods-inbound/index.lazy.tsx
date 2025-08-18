import { Div, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import ActionsGroup from './-components/actions-group'
import DefectiveGoodsForm from './-components/defective-goods-form'
import DefectiveGoodList from './-components/defective-goods-list'
import { PageContextProvider } from './-contexts/page-context'

export const Route = createLazyFileRoute('/(features)/_layout/b-grade-goods-inbound/')({
	component: RouteComponent
})

function RouteComponent() {
	const { t, i18n } = useTranslation()

	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/b-grade-goods-inbound', text: t('ns_common:navigation.b_grade_goods_inbound') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.b_grade_goods_inbound')}</title>
			<meta name='description' content='Matching EPC for defective goods' />
			<Div className='h-[var(--outlet-wrapper-height)]'>
				<PageContextProvider>
					<ResizablePanelGroup direction='horizontal' className='h-full rounded-md border'>
						<ResizablePanel maxSize={40}>
							<DefectiveGoodList />
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel minSize={50} maxSize={70} defaultSize={60}>
							<ActionsGroup />
							<DefectiveGoodsForm />
						</ResizablePanel>
					</ResizablePanelGroup>
				</PageContextProvider>
			</Div>
		</Fragment>
	)
}
