export class __JSON__ {
	/**
	 * @description Check if string is valid JSON
	 * @param arg
	 * @returns
	 */
	public static valid(arg: string | null) {
		try {
			if (!arg) return false
			return !!JSON.parse(arg)
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
		try {
			if (typeof value !== 'string') {
				throw new Error(`Cannot safe json parse value of type "${typeof value}"`)
			}
			if (!__JSON__.valid(value)) return value
			return JSON.parse(value)
		} catch (error) {
			return null
		}
	}

	/**
	 * @description Safely stringify value
	 * @param value
	 * @returns
	 */
	public static stringify(value: any): string {
		return typeof value === 'string'
			? value
			: JSON.stringify(value, (_k: string, value: any) => (typeof value === 'undefined' ? null : value))
	}
}
