import * as Sentry from '@sentry/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ButtonProps } from '../ui/button'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'

export default function FeedbackFormTrigger({ children, ...props }: ButtonProps) {
	const { t } = useTranslation()
	const [feedback, setFeedback] = useState<ReturnType<typeof Sentry.feedbackIntegration>>()
	const buttonRef = useRef<HTMLButtonElement>(null)

	// Read `getFeedback` on the client only, to avoid hydration errors during server rendering
	useEffect(() => {
		setFeedback(Sentry.feedbackIntegration())
	}, [])

	useEffect(() => {
		if (feedback) {
			const unsubscribe = feedback.attachTo(buttonRef.current!)
			return unsubscribe
		}
		return () => {}
	}, [feedback])

	return (
		<Button ref={buttonRef} type='button' {...props}>
			{children ? (
				children
			) : (
				<>
					{t('ns_common:actions.report_bug')}
					<Icon name='ArrowRight' size={12} />
				</>
			)}
		</Button>
	)
}
