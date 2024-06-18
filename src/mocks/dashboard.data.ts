import { format } from 'date-fns'

const generateRandomPhone = (prefix = '09') => String(prefix + Math.floor(Math.random() * 100000000))
const generateRandomDealValue = () =>
	new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency: 'VND',
		minimumIntegerDigits: 3
	}).format(Math.floor(Math.random() * 100000000))

export const recentExports = [
	{
		sale_representator: {
			name: 'Astole Banne',
			phone: generateRandomPhone()
		},
		company_name: 'Nike',
		amount: generateRandomDealValue(),
		status: 'Completed'
	},
	{
		sale_representator: {
			name: 'Lisa Bee',
			phone: generateRandomPhone()
		},
		company_name: 'New Balance',
		amount: generateRandomDealValue(),
		status: 'Completed'
	},
	{
		sale_representator: {
			name: 'Stuward Canne',
			phone: generateRandomPhone()
		},
		company_name: 'Converse',
		amount: generateRandomDealValue(),
		status: 'Canceled'
	},
	{
		sale_representator: {
			name: 'Stuward Canne',
			phone: generateRandomPhone()
		},
		company_name: 'Ananas',
		amount: generateRandomDealValue(),
		status: 'Pending'
	},
	{
		sale_representator: {
			name: 'Stuward Canne',
			phone: generateRandomPhone()
		},
		company_name: 'Puma',
		amount: generateRandomDealValue(),
		status: 'Canceled'
	},
	{
		sale_representator: {
			name: 'John Wick',
			phone: generateRandomPhone()
		},
		company_name: 'Adidas',
		amount: generateRandomDealValue(),
		status: 'Completed'
	}
]
export const transactionOverview = [
	{ name: 'Pending', value: 150, color: 'hsl(var(--accent))' },
	{ name: 'Completed', value: 400, color: 'hsl(var(--primary))' },
	{ name: 'Cancelled', value: 100, color: 'hsl(var(--destructive))' }
]

export const annuallIPStatistics = new Array(12).fill(null).map((_, i) => ({
	name: format(new Date(new Date().getFullYear(), i), 'MMM'),
	import: Math.round(Math.random() * 10000),
	export: Math.round(Math.random() * 10000)
}))
