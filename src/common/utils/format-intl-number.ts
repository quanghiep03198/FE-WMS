import { coalesce } from './common'

export default function formatIntlNumber(value: any) {
	const _value = coalesce(value, 0)
	return new Intl.NumberFormat().format(_value)
}
