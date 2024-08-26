export class Util {
	static isPrimitive(value: any) {
		return (typeof value !== 'object' && typeof value !== 'function') || value === null
	}
}
