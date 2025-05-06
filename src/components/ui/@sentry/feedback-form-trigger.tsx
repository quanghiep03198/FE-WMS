import * as Sentry from '@sentry/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../@core/button'
import { Icon } from '../@core/icon'

export default function FeedbackFormTrigger() {
	const { t } = useTranslation()
	const [feedback, setFeedback] = useState<ReturnType<typeof Sentry.feedbackIntegration>>()
	const buttonRef = useRef<HTMLButtonElement>(null)

	// Read `getFeedback` on the client only, to avoid hydration errors during server rendering
	useEffect(() => {
		setFeedback(Sentry.feedbackIntegration())
	}, [])

	useEffect(() => {
		if (feedback) {
			const unsubscribe = feedback.attachTo(buttonRef.current)
			return unsubscribe
		}
		return () => {}
	}, [feedback])

	return (
		<>
			<Button variant='link' type='button' className='p-0' ref={buttonRef}>
				{/* {t('ns_common:actions.report_bug')} */}
				Report bug
				<Icon name='ArrowRight' size={12} role='presentation' />
			</Button>
		</>
	)
}
