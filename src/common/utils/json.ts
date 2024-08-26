import { isNil } from 'lodash'
import { Util } from './util'

/**
 * JSON strictify handler
 * @class
 */
export class JSONs {
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
	public static parse<T>(value: any): T | null | string {
		if (!JSONs.isValid(value)) return value
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
}
