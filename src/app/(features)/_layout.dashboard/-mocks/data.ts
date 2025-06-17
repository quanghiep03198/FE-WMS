import { format } from 'date-fns'

export const overalStatistics = new Array(6).fill(null).map(() => ({
	order_number: Math.round(Math.random() * 10000),
	inventory_number: Math.round(Math.random() * 10000),
	import_number: Math.round(Math.random() * 10000),
	export_number: Math.round(Math.random() * 10000)
}))

export const transactionOverview = [
	{ status: 'pending', quantity: 275, fill: 'var(--color-pending)' },
	{ status: 'completed', quantity: 200, fill: 'var(--color-completed)' },
	{ status: 'cancelled', quantity: 287, fill: 'var(--color-cancelled)' }
]

export const annuallInOutBoundStatistics = new Array(12).fill(null).map((_, i) => ({
	month: format(new Date(new Date().getFullYear(), i), 'MMM'),
	import: Math.round(Math.random() * 10000),
	export: Math.round(Math.random() * 10000)
}))
