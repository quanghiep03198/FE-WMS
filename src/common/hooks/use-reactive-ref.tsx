import { useReactive } from 'ahooks'
import type { RefObject } from 'react'

/**
 * @description Reactive Ref Hook. Creates a reactive reference to a value, allowing for automatic updates when the value changes.
 * @param {T} value initial value
 * @returns {RefObject<T>} A reactive reference object containing the current value.
 */
export function useReactiveRef<T>(value: T) {
	return useReactive<RefObject<T>>({ current: value })
}
