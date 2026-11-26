import { useCallback, useEffect, useRef } from 'react'

const maxHorizontalScroll = (el) => el.scrollWidth - el.clientWidth
const maxVerticalScroll = (el) => el.scrollHeight - el.clientHeight

export default function useScrollOnDrag(
	target,
	{
		onDragStart = () => {},
		onDragEnd = () => {},
		runScroll = ({ dx, dy }) => {
			const offsetX = Math.min(maxHorizontalScroll(target.current), target.current.scrollLeft + dx)
			target.current.scrollLeft = offsetX

			const offsetY = Math.min(maxVerticalScroll(target.current), target.current.scrollTop + dy)
			target.current.scrollTop = offsetY
		}
	} = {}
) {
	const internalState = useRef({
		lastMouseX: null,
		lastMouseY: null,
		isMouseDown: false,
		isScrolling: false
	})

	const scroll = useCallback(
		({ dx, dy }) => {
			if (!target.current) {
				console.warn('Target element is not available for scrolling.')
				return
			}
			runScroll({ dx, dy })
		},
		[runScroll]
	)

	const onMouseDown = useCallback((e) => {
		internalState.current.isMouseDown = true
		internalState.current.lastMouseX = e.clientX
		internalState.current.lastMouseY = e.clientY
	}, [])

	const onMouseUp = () => {
		internalState.current.isMouseDown = false
		internalState.current.lastMouseX = null
		internalState.current.lastMouseY = null

		if (internalState.current.isScrolling) {
			internalState.current.isScrolling = false
			onDragEnd()
		}
	}

	const onMouseMove = (e) => {
		if (!internalState.current.isMouseDown) {
			return
		}

		if (!internalState.current.isScrolling) {
			internalState.current.isScrolling = true
			onDragStart()
		}

		// diff is negative because we want to scroll in the opposite direction of the movement
		if (!internalState.current.lastMouseX || !internalState.current.lastMouseY) return

		const dx = -(e.clientX - internalState.current.lastMouseX)
		const dy = -(e.clientY - internalState.current.lastMouseY)
		internalState.current.lastMouseX = e.clientX
		internalState.current.lastMouseY = e.clientY

		scroll({ dx, dy })
	}

	useEffect(() => {
		globalThis.addEventListener('mouseup', onMouseUp)
		globalThis.addEventListener('mousemove', onMouseMove)

		return () => {
			globalThis.removeEventListener('mouseup', onMouseUp)
			globalThis.removeEventListener('mousemove', onMouseMove)
		}
	}, [])

	return {
		events: {
			onMouseDown
		}
	}
}
