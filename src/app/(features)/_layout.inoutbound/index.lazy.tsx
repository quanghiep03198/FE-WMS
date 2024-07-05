import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { CommonActions } from '@/common/constants/enums'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { InOutBoundFormValues, inOutBoundSchema } from '@/schemas/epc-inoutbound.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLazyFileRoute, useBlocker } from '@tanstack/react-router'
import { Fragment, useCallback, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import InOutBoundForm from './_components/-inoutbound-form'
import PageComposition from './_components/-page-composition'
import ScannedEPCsCounter from './_components/-scanned-epc-counter'
import ScannedEPCsList from './_components/-scanned-epc-list'
import ScanningActions from './_components/-scanning-actions'
import { PageContext, PageProvider } from './_context/-page-context'
import { Helmet } from 'react-helmet'

export const Route = createLazyFileRoute('/(features)/_layout/inoutbound/')({
	component: () => (
		<PageProvider>
			<Page />
		</PageProvider>
	)
})

function Page() {
	const { t } = useTranslation()
	const { scanningStatus: readingStatus } = useContext(PageContext)

	// Set page breadcrumb
	useBreadcrumb([{ to: '/inoutbound', text: t('ns_common:navigation.inoutbound_commands') }])

	// Blocking navigation on reading EPC or unsave changes
	const { proceed, reset, status } = useBlocker({
		condition: readingStatus === 'scanning'
	})

	// Prevent counter rerendering
	const handleReset = useCallback(reset, [status])
	const handleProceed = useCallback(proceed, [status])

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.inoutbound_commands')} />

			<PageComposition.Container>
				<ScanningActions />
				<PageComposition.Main>
					{/* Scanned EPCs List */}
					<PageComposition.ListBoxPanel>
						<ScannedEPCsList />
					</PageComposition.ListBoxPanel>
					{/* Scanned EPCs counter */}
					<PageComposition.CounterPanel>
						<ScannedEPCsCounter />
					</PageComposition.CounterPanel>
					{/* In-out-bound Form */}
					<PageComposition.FormPanel>
						<InOutBoundForm />
					</PageComposition.FormPanel>
				</PageComposition.Main>
			</PageComposition.Container>

			<ConfirmDialog
				open={status === 'blocked'}
				onOpenChange={handleReset}
				title='Stop scanning EPC ?'
				description='This page contains unsaved actions. Do you still wish to leave now?'
				onConfirm={handleProceed}
				onCancel={handleReset}
			/>
		</Fragment>
	)
}