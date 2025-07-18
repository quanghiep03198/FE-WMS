import { cn } from '@/common/utils/cn'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type TypewriterProps = {
	text?: string
	typeSpeed?: number
	delay?: number
	playState?: 'running' | 'paused'
	className?: string
	onComplete?: () => void
}

export const Typewriter = ({
	text = '',
	typeSpeed = 32,
	delay = 0,
	playState = 'running',
	className,
	onComplete
}: TypewriterProps) => {
	const { i18n } = useTranslation()
	const [displayedText, setDisplayedText] = useState('')
	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const onCompleteRef = useRef(onComplete) // Ref to store the latest onComplete

	// Keep onComplete callback reference up-to-date without causing effect re-runs
	useEffect(() => {
		onCompleteRef.current = onComplete
	}, [onComplete])

	useEffect(() => {
		if (playState === 'paused') return
		/**
		 * Each time htmlString changes,
		 * only add new characters from the end of the currently displayed text.
		 */
		const startTyping = () => {
			let currentIndex = displayedText.length
			intervalRef.current = setInterval(() => {
				if (currentIndex < text.length) {
					// Only add new characters, do not reset old text
					setDisplayedText(text.slice(0, currentIndex + 1))
					currentIndex++
				} else {
					if (intervalRef.current) {
						clearInterval(intervalRef.current)
					}
					onCompleteRef.current?.()
				}
			}, typeSpeed)
		}

		// If there is new text, start typing animation
		if (text.length > displayedText.length) {
			if (delay > 0) setTimeout(startTyping, delay)
			else startTyping()
		}
		// If targetText decreases or resets, consider handling it自行處理
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [text, typeSpeed, playState])

	useEffect(() => {
		setDisplayedText(text)
	}, [i18n.language])

	return (
		<span
			className={cn('whitespace-pre-wrap leading-7', className)}
			dangerouslySetInnerHTML={{ __html: displayedText }}
		/>
	)
}
