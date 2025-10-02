export default function formatIntlNumber(value: any) {
	return new Intl.NumberFormat().format(value)
}
