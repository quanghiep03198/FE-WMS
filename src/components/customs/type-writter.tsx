import { cn } from '@common/utils/cn'
import { useRafState, useUpdateEffect } from 'ahooks'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

type TypewriterProps = {
	text: string
	typeSpeed?: number
	delay?: number
	playState?: 'running' | 'paused'
	className?: string
}

function startTyping(text: string, startIndex: number, typeSpeed: number, setDisplayedText: (text: string) => void) {
	let currentIndex = startIndex
	const interval = setInterval(() => {
		if (currentIndex < text.length) {
			setDisplayedText(text.slice(0, currentIndex + 1))
			currentIndex++
		} else {
			clearInterval(interval)
		}
	}, typeSpeed)

	return () => clearInterval(interval)
}

export const Typewriter = ({
	text = '',
	typeSpeed = 32,
	delay = 0,
	playState = 'running',
	className
}: TypewriterProps) => {
	const { i18n } = useTranslation()
	const [displayedText, setDisplayedText] = useRafState('')

	useEffect(() => {
		if (playState === 'paused') return
		let stopTyping: (() => void) | undefined
		let timeout: ReturnType<typeof setTimeout> | undefined
		const start = () => {
			stopTyping = startTyping(text, displayedText.length, typeSpeed, setDisplayedText)
		}

		// If there is new text, start typing animation
		if (text.length > displayedText.length) {
			if (delay > 0) timeout = setTimeout(start, delay)
			else start()
		}
		// If targetText decreases or resets, consider handling it自行處理
		return () => {
			clearTimeout(timeout)
			stopTyping?.()
		}
	}, [text, typeSpeed, playState, delay, i18n.language])

	useUpdateEffect(() => {
		setDisplayedText(text)
	}, [i18n.language])

	return <span className={cn('leading-7 whitespace-pre-wrap', className)}>{displayedText}</span>
}
