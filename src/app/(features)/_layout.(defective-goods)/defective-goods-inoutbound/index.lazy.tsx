import { Div, Typography } from '@/components/ui'
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
				<Div className='grid h-[var(--outlet-wrapper-height)] border-collapse grid-cols-3 grid-rows-[auto_1fr] overflow-hidden rounded-md border *:!box-border'>
					<Div className='col-span-full flex h-[52px] items-center justify-between border-b p-2'>
						<Typography variant='h4' className='ml-2'>
							Inoutbound
						</Typography>
						<InoutboundForm />
					</Div>
					<Div className='col-span-2 box-border h-[calc(var(--outlet-wrapper-height)-52px)] overflow-y-scroll border-r scrollbar-track-accent/50'>
						<DetailTable />
					</Div>
					<Div className='col-span-1 h-[calc(var(--outlet-wrapper-height)-52px)]'>
						<ReaderPlaygroundProvider>
							<RfidReaderPlayground />
						</ReaderPlaygroundProvider>
					</Div>
				</Div>
			</PageContextProvider>
		</Fragment>
	)
}
