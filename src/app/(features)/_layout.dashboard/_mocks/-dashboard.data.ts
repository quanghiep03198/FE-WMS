import { format } from 'date-fns'

const generateRandomPhone = (prefix = '09') => String(prefix + Math.floor(Math.random() * 100000000))
export const generateRandomDealValue = () =>
	new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency: 'VND',
		minimumIntegerDigits: 3
	}).format(Math.floor(Math.random() * 100000000))

export const overalStatistics = new Array(6).fill(null).map(() => ({
	order_number: Math.round(Math.random() * 10000),
	inventory_number: Math.round(Math.random() * 10000),
	import_number: Math.round(Math.random() * 10000),
	export_number: Math.round(Math.random() * 10000)
}))

export const recentExports = [
	{
		sale_representator: {
			name: 'Astole Banne',
			phone: generateRandomPhone()
		},
		company_name: 'Nike',
		amount: Math.floor(Math.random() * 100000000),
		status: 'Completed'
	},
	{
		sale_representator: {
			name: 'Lisa Bee',
			phone: generateRandomPhone()
		},
		company_name: 'New Balance',
		amount: Math.floor(Math.random() * 100000000),
		status: 'Completed'
	},
	{
		sale_representator: {
			name: 'Stuward Canne',
			phone: generateRandomPhone()
		},
		company_name: 'Converse',
		amount: Math.floor(Math.random() * 100000000),
		status: 'Canceled'
	},
	{
		sale_representator: {
			name: 'Stuward Canne',
			phone: generateRandomPhone()
		},
		company_name: 'Ananas',
		amount: Math.floor(Math.random() * 100000000),
		status: 'Pending'
	},
	{
		sale_representator: {
			name: 'Stuward Canne',
			phone: generateRandomPhone()
		},
		company_name: 'Puma',
		amount: Math.floor(Math.random() * 100000000),
		status: 'Canceled'
	},
	{
		sale_representator: {
			name: 'John Wick',
			phone: generateRandomPhone()
		},
		company_name: 'Adidas',
		amount: Math.floor(Math.random() * 100000000),
		status: 'Completed'
	}
]

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
