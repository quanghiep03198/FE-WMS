/**
 * Classifies percentage changes into descriptive categories for dashboard display
 * @param percent - The percentage change (can be positive or negative)
 * @returns i18n key for the appropriate change level description
 */
export function classifyPercentageChange(percent: number | null): string {
	if (percent === null || percent === undefined) return 'pct_flat'

	const abs = Math.abs(percent)

	// Flat/minimal change
	if (abs < 1) return 'pct_flat'

	// Determine direction and magnitude
	const isIncrease = percent > 0

	if (abs < 3) return isIncrease ? 'increase_minimal' : 'decrease_minimal'
	if (abs < 6) return isIncrease ? 'increase_slight' : 'decrease_slight'
	if (abs < 10) return isIncrease ? 'increase_moderate' : 'decrease_moderate'
	if (abs < 15) return isIncrease ? 'increase_notable' : 'decrease_notable'
	if (abs < 25) return isIncrease ? 'increase_strong' : 'decrease_strong'
	if (abs < 40) return isIncrease ? 'increase_sharp' : 'decrease_sharp'
	if (abs < 60) return isIncrease ? 'increase_surge' : 'decrease_drop'

	return isIncrease ? 'increase_exceptional' : 'decrease_exceptional'
}
