import { isNil } from 'lodash-es'
import { isPrimitive } from './common'

/**
 * JSON strictify handler
 * @class
 */
export class Json {
	/**
	 * @description Check if string is valid JSON
	 * @param value
	 * @returns
	 */
	public static isValid(value: string | null) {
		try {
			if (isNil(value)) return false
			return !!JSON.parse(value)
		} catch {
			return false
		}
	}

	/**
	 * @description Safely parse value to JSON
	 * @param value
	 * @returns
	 */
	public static parse<T>(value: any): T {
		if (!Json.isValid(value)) return value
		return JSON.parse(value) as T
	}

	/**
	 * @description Safely stringify value
	 * @param value
	 * @returns
	 */
	public static stringify(value: any): string {
		return isPrimitive(value) ? value : JSON.stringify(value)
	}

	/**
	 * @description Parse raw key-value text format to JSON object
	 * @param rawText - Text with format "key: value" on each line
	 * @param options - Optional configuration
	 * @returns Parsed JSON object
	 * @example
	 * ```typescript
	 * const text = `
	 *   employee_code: s037546
	 *   employee_name_show: TRUONG QUANG HIEP
	 *   sex: M
	 * `
	 * const result = Json.parseRawText(text)
	 * // { employee_code: 's037546', employee_name_show: 'TRUONG QUANG HIEP', sex: 'M' }
	 * ```
	 */
	public static parseRawText<T extends Record<string, any>>(
		rawText: string,
		options?: {
			/** Separator between key and value (default: ':') */
			separator?: string
			/** Convert keys to camelCase (default: false) */
			camelCase?: boolean
			/** Trim whitespace from keys and values (default: true) */
			trim?: boolean
			/** Skip empty lines (default: true) */
			skipEmpty?: boolean
			/** Auto convert numeric values to numbers (default: true) */
			autoConvertNumbers?: boolean
			/** Auto convert boolean-like values to boolean (default: true) */
			autoConvertBooleans?: boolean
		}
	): T {
		const {
			separator = ':',
			camelCase = false,
			trim = true,
			skipEmpty = true,
			autoConvertNumbers = true,
			autoConvertBooleans = true
		} = options ?? {}

		const result: Record<string, any> = {}

		// Split by new lines and process each line
		const lines = rawText.split(/\r?\n/)

		for (const line of lines) {
			// Skip empty lines if configured
			if (skipEmpty && !line.trim()) continue

			// Find separator position
			const separatorIndex = line.indexOf(separator)
			if (separatorIndex === -1) continue

			// Extract key and value
			let key = line.substring(0, separatorIndex)
			let value: any = line.substring(separatorIndex + 1)

			// Trim if configured
			if (trim) {
				key = key.trim()
				value = value.trim()
			}

			// Skip if key is empty
			if (!key) continue

			// Convert key to camelCase if configured
			if (camelCase) {
				key = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
			}

			// Auto-convert values
			if (autoConvertNumbers && /^-?\d+\.?\d*$/.test(value)) {
				value = Number(value)
			} else if (autoConvertBooleans) {
				const lowerValue = value.toLowerCase()
				if (lowerValue === 'true') value = true
				else if (lowerValue === 'false') value = false
			}

			result[key] = value
		}

		return result as T
	}
}
