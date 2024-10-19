import { isNil } from 'lodash'
import { Util } from './util'

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
		} catch (error) {
			return false
		}
	}

	/**
	 * @description Safely parse value to JSON
	 * @param value
	 * @returns
	 */
	public static parse<T>(value: any): T | null | any {
		if (!Json.isValid(value)) return value
		return JSON.parse(value)
	}

	/**
	 * @description Safely stringify value
	 * @param value
	 * @returns
	 */
	public static stringify(value: any): string {
		return Util.isPrimitive(value) ? value : JSON.stringify(value)
	}

	public static getContentSize(value: any, unit: 'kilobyte' | 'megabyte'): string {
		const jsonString = JSON.stringify(value)
		const byteLength = new TextEncoder().encode(jsonString).length
		switch (unit) {
			case 'kilobyte': {
				return `${(byteLength / 1024).toFixed(2)} kb`
			}
			case 'megabyte': {
				return `${(byteLength / (1024 * 1024)).toFixed(2)} mb`
			}
		}
	}
}
