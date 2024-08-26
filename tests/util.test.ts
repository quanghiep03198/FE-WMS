import { Util } from '@/common/utils/util'
import { describe, expect, it } from 'vitest'

describe('Check if value has primitive datatype', () => {
	// Should return null if argument is null
	it('should return "true" when argument is null', () => {
		const result = Util.isPrimitive(null)
		expect(result).toBe(true)
	})
	it('should return "false" when argument is undefined', () => {
		const result = Util.isPrimitive(undefined)
		expect(result).toBe(true)
	})

	it('should return "false" when argument is an object', () => {
		const result = Util.isPrimitive({ name: 'John', age: 20 })
		expect(result).toBe(false)
	})

	it('should return "false" if argument is an array', () => {
		const result = Util.isPrimitive(['Apple', 'Pineaple', 'Orange'])
		expect(result).toBe(false)
	})

	// Should return null if argument is empty string
	it('should return "true" when argument is a string', () => {
		const input = 'Hello World'
		const result = Util.isPrimitive(input)
		expect(result).toBe(true)
	})

	it('should return true when argument is a number', () => {
		const input = 10
		const result = Util.isPrimitive(input)
		expect(result).toBe(true)
	})
})
