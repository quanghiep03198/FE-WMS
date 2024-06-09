export class JsonHandler {
	/**
	 * @description Check if string is valid JSON
	 * @param arg
	 * @returns
	 */
	public static isValid(arg: string | null) {
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
	public static safeParse<T>(value: any): T | null | undefined | string {
		try {
			if (typeof value !== 'string') {
				throw new Error(`Cannot safe json parse value of type "${typeof value}"`)
			}
			if (!JsonHandler.isValid(value)) return value
			return JSON.parse(value)
		} catch (error) {
			console.log((error as Error).message)
			return null
		}
	}

	/**
	 * @description Safely stringify value
	 * @param value
	 * @returns
	 */
	public static safeStringify(value: any): string {
		return typeof value === 'string'
			? value
			: JSON.stringify(value, (_k: string, value: any) => (typeof value === 'undefined' ? null : value))
	}
}
