import { useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'

type ValueAccessors<T> = {
	key: (datum: T) => string
	value: (datum: T) => number
	withValue: (datum: T, value: number) => T
}

type Presentation<T> = { values: readonly T[]; visibility: number; extent?: readonly [number, number] }

export function useAnimatedChartValues<T>(
	data: readonly T[] | undefined,
	accessors: ValueAccessors<T>,
	duration = 500
): Presentation<T> {
	const [displayed, setDisplayed] = useState<Presentation<T>>({ values: [], visibility: 0 })
	const displayedRef = useRef(displayed)
	const targetRef = useRef<readonly T[] | undefined>(undefined)
	const animationRef = useRef<{ frame: number; media: MediaQueryList; reduceMotion: () => void } | null>(null)

	useEffect(() => {
		if (!data) return

		const previousTarget = targetRef.current
		targetRef.current = data
		const publish = (next: Presentation<T>) => {
			displayedRef.current = next
			setDisplayed(next)
		}

		if (previousTarget && previousTarget.length === data.length) {
			const previousValues = new Map(previousTarget.map((datum) => [accessors.key(datum), accessors.value(datum)]))
			if (data.every((datum) => previousValues.has(accessors.key(datum)) &&
				Object.is(previousValues.get(accessors.key(datum)), accessors.value(datum)))) {
				const currentValues = new Map(displayedRef.current.values.map((datum) => [accessors.key(datum), accessors.value(datum)]))
				const isSettled = currentValues.size === data.length &&
					data.every((datum) => currentValues.has(accessors.key(datum)) &&
						Object.is(currentValues.get(accessors.key(datum)), accessors.value(datum)))
				if (isSettled && !animationRef.current && !isEqual(displayedRef.current.values, data)) {
					publish({ ...displayedRef.current, values: data })
				}
				if (animationRef.current || isSettled) return
			}
		}

		if (animationRef.current) {
			window.cancelAnimationFrame(animationRef.current.frame)
			animationRef.current.media.removeEventListener('change', animationRef.current.reduceMotion)
			animationRef.current = null
		}

		const previous = new Map(displayedRef.current.values.map((datum) => [accessors.key(datum), datum]))
		const nextKeys = new Set(data.map(accessors.key))
		const rows = [...data, ...displayedRef.current.values.filter((datum) => !nextKeys.has(accessors.key(datum)))]
		const start = rows.map((datum) => accessors.value(previous.get(accessors.key(datum)) ?? accessors.withValue(datum, 0)))
		const end = rows.map((datum) => (nextKeys.has(accessors.key(datum)) ? accessors.value(datum) : 0))
		const startVisibility = displayedRef.current.visibility
		const endVisibility = data.some((datum) => accessors.value(datum) !== 0) ? 1 : 0
		const extent = [Math.min(0, ...start, ...end), Math.max(1, ...start, ...end)] as const
		const changed = startVisibility !== endVisibility || start.some((value, index) => !Object.is(value, end[index]))
		const media = window.matchMedia('(prefers-reduced-motion: reduce)')

		if (!changed || media.matches || duration <= 0) {
			publish({ values: data, visibility: endVisibility })
			return
		}

		let started: number | undefined
		const stop = () => {
			if (!animationRef.current) return
			window.cancelAnimationFrame(animationRef.current.frame)
			media.removeEventListener('change', animationRef.current.reduceMotion)
			animationRef.current = null
		}
		const tick = (time: number) => {
			started ??= time
			const progress = Math.min((time - started) / duration, 1)
			const eased = 1 - (1 - progress) ** 3
			if (progress === 1) {
				stop()
				publish({ values: targetRef.current ?? data, visibility: endVisibility })
			} else {
				publish({
					values: rows.map((datum, index) => accessors.withValue(datum, start[index] + (end[index] - start[index]) * eased)),
					visibility: startVisibility + (endVisibility - startVisibility) * eased,
					extent
				})
				if (animationRef.current) animationRef.current.frame = window.requestAnimationFrame(tick)
			}
		}
		const reduceMotion = () => {
			if (!media.matches) return
			stop()
			const target = targetRef.current ?? []
			publish({ values: target, visibility: target.some((datum) => accessors.value(datum) !== 0) ? 1 : 0 })
		}
		media.addEventListener('change', reduceMotion)
		animationRef.current = { frame: window.requestAnimationFrame(tick), media, reduceMotion }
	}, [data, accessors, duration])

	useEffect(() => () => {
		if (!animationRef.current) return
		window.cancelAnimationFrame(animationRef.current.frame)
		animationRef.current.media.removeEventListener('change', animationRef.current.reduceMotion)
		animationRef.current = null
	}, [])

	return displayed
}
