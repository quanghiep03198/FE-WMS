import { cn } from '@/common/utils/cn'
import { useUpdateEffect } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type TypewriterProps = {
	text: string
	typeSpeed?: number
	delay?: number
	playState?: 'running' | 'paused'
	className?: string
}

export const Typewriter = ({
	text = '',
	typeSpeed = 32,
	delay = 0,
	playState = 'running',
	className
}: TypewriterProps) => {
	const { i18n } = useTranslation()
	const [displayedText, setDisplayedText] = useState('')
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

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
	}, [text, typeSpeed, playState, delay, i18n.language])

	useUpdateEffect(() => {
		setDisplayedText(text)
	}, [i18n.language])

	return <span className={cn('whitespace-pre-wrap leading-7', className)}>{displayedText}</span>
}
