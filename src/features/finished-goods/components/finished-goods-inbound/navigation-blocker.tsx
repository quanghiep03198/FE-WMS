import ConfirmDialog from '@components/ui/@override/confirm-dialog'
import useAuth from '@hooks/use-auth'
import { useBlocker } from '@tanstack/react-router'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../contexts/finished-goods-inbound/page-context'

const PageNavigationBlocker: React.FC = () => {
	const { isAuthenticated } = useAuth()

	const { t } = useTranslation()
	const { scanningStatus } = usePageContext('scanningStatus')

	// * Blocking navigation on reading EPC or unsave changes
	const blocker = useBlocker({
		condition: typeof scanningStatus !== 'undefined' && isAuthenticated
	})

	const handleReset = useCallback(blocker.reset, [blocker.status])
	const handleProceed = useCallback(blocker.proceed, [blocker.status])

	return (
		<ConfirmDialog
			description={t('ns_inoutbound:notification.navigation_blocked_caption')}
			open={blocker.status === 'blocked'}
			title={t('ns_inoutbound:notification.navigation_blocked_message')}
			onCancel={handleReset}
			onConfirm={handleProceed}
			onOpenChange={handleReset}
		/>
	)
}

export default PageNavigationBlocker
