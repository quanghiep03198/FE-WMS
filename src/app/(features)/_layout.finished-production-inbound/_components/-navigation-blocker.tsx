import useAuth from '@/common/hooks/use-auth'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { useBlocker } from '@tanstack/react-router'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../_contexts/-page-context'

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
			open={blocker.status === 'blocked'}
			onOpenChange={handleReset}
			title={t('ns_inoutbound:notification.navigation_blocked_message')}
			description={t('ns_inoutbound:notification.navigation_blocked_caption')}
			onConfirm={handleProceed}
			onCancel={handleReset}
		/>
	)
}

export default PageNavigationBlocker
