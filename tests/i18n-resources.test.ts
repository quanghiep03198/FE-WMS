import { describe, expect, it } from 'vitest'
import { LOCALES } from '../src/common/constants/constants'
import { Languages } from '../src/common/constants/enums'
import { DefectDescriptionTemplate } from '../src/features/defective-goods/constants/templates'
import { resources } from '../src/i18n/i18n-resources'

const flattenStrings = (value: unknown, parentKey = ''): Map<string, string> => {
	const result = new Map<string, string>()

	if (typeof value === 'string') {
		result.set(parentKey, value)
	} else if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
		for (const [key, nestedValue] of Object.entries(value)) {
			const path = parentKey ? `${parentKey}.${key}` : key
			for (const [nestedKey, nestedString] of flattenStrings(nestedValue, path)) {
				result.set(nestedKey, nestedString)
			}
		}
	}

	return result
}

const placeholders = (value: string) => [...value.matchAll(/{{(.*?)}}/g)].map((match) => match[1]).sort()

const sortObjectKeys = (keys: string[]) =>
	[...keys].sort((left, right) => {
		const leftIndex = /^(0|[1-9]\d*)$/.test(left) ? Number(left) : Number.POSITIVE_INFINITY
		const rightIndex = /^(0|[1-9]\d*)$/.test(right) ? Number(right) : Number.POSITIVE_INFINITY
		return leftIndex === rightIndex
			? left.localeCompare(right, 'en', { sensitivity: 'base' })
			: leftIndex - rightIndex
	})

const expectSortedKeys = (value: unknown, path = '') => {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) return

	const keys = Object.keys(value)
	expect(keys, path).toEqual(sortObjectKeys(keys))

	for (const key of keys) {
		expectSortedKeys(Reflect.get(value, key), path ? `${path}.${key}` : key)
	}
}

describe('i18n resources', () => {
	it('registers Khmer while preserving the existing locales', () => {
		expect(Reflect.get(Languages, 'KHMER')).toBe('km')
		expect(LOCALES).toContainEqual({ value: 'km', label: 'Khmer' })
		expect(Object.keys(resources)).toEqual(expect.arrayContaining(['vi', 'en', 'cn', 'km']))
	})

	it('matches English namespaces, keys, and interpolation placeholders', () => {
		const khmer = Reflect.get(resources, 'km') as Record<string, unknown>

		expect(khmer).toBeDefined()
		expect(Object.keys(khmer).sort()).toEqual(Object.keys(resources.en).sort())

		for (const [namespace, englishResource] of Object.entries(resources.en)) {
			const englishStrings = flattenStrings(englishResource)
			const khmerStrings = flattenStrings(khmer[namespace])
			const missingKeys = [...englishStrings.keys()].filter((key) => !khmerStrings.has(key))
			const extraKeys = [...khmerStrings.keys()].filter((key) => !englishStrings.has(key))

			expect.soft({ missingKeys, extraKeys }, namespace).toEqual({ missingKeys: [], extraKeys: [] })

			for (const [key, englishValue] of englishStrings) {
				expect(placeholders(khmerStrings.get(key) ?? ''), `${namespace}.${key}`).toEqual(placeholders(englishValue))
			}
		}
	})

	it('provides a Khmer defect description template', () => {
		expect(Reflect.get(DefectDescriptionTemplate, 'km')).toContain('ប្រភេទកំហុសដែលបានរកឃើញ')
	})

	it('sorts keys alphabetically in every locale', () => {
		for (const [locale, resource] of Object.entries(resources)) {
			expectSortedKeys(resource, locale)
		}
	})
})
