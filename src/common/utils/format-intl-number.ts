export default function formatIntlNumber(value: unknown) {
	return typeof value === 'number' ? new Intl.NumberFormat().format(value) : 'Unknown'
}
