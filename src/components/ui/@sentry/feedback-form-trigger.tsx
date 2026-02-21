import * as Sentry from '@sentry/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, ButtonProps } from '../@core/button'
import { Icon } from '../@core/icon'

export default function FeedbackFormTrigger(props: ButtonProps) {
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
		<Button type='button' ref={buttonRef} {...props}>
			{t('ns_common:actions.report_bug')}
			<Icon name='ArrowRight' size={12} />
		</Button>
	)
}
