export function isPrimitive(value: any) {
	return (typeof value !== 'object' && typeof value !== 'function') || value === null
}

export function getContentSize(value: any, unit: 'kilobyte' | 'megabyte'): string {
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
