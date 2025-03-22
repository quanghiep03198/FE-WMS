import { appHostRegistry } from '@/common/constants/constants'
import { useAuth } from '@/common/hooks/use-auth'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const HostCompatibleAlert: React.FC = () => {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const { user } = useAuth()
	const currentHostRegistry = appHostRegistry.get(user.company_code)
	const movedPermanentlyURL = `${window.location.protocol}//${currentHostRegistry}:${window.location.port}/${window.location.pathname}`

	useEffect(() => {
		setOpen(window.location.hostname !== currentHostRegistry)
	}, [user.company_code])
	console.log(`${window.location.protocol}`)

	return (
		<ConfirmDialog
			open={open}
			onOpenChange={setOpen}
			title={t('ns_common:errors.503')}
			description={t('ns_common:errors.301_rfid_moved_permanently', {
				url: movedPermanentlyURL,
				factoryCode: t(`ns_common:factory.${user.company_code}`, { defaultValue: user.company_code }),
				defaultValue: null
			})}
			onConfirm={() => window.open(movedPermanentlyURL, '_blank')}
		/>
	)
}

export default HostCompatibleAlert
