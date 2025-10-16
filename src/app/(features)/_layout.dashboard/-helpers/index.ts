import formatIntlNumber from '@/common/utils/format-intl-number'
import { IconProps } from '@/components/ui'
import { ResourceKeys } from 'i18next'
import { isNil } from 'lodash'

/**
 * Gets detailed change description with quantity for i18n
 * @param percent - The percentage change
 * @param difference - The absolute difference in units
 * @returns i18n key and params for detailed change description
 */
export function getDetailedChangeDescription(
	percent: number | null,
	difference: number | null,
	unit
): { key: string; params: Record<string, any> } {
	if (!difference || difference === 0) {
		return { key: 'maintaining_steady_performance', params: {} }
	}

	const absPercent = Math.abs(percent || 0)
	const absDifference = formatIntlNumber(Math.abs(difference))
	const isIncrease = (percent || 0) > 0

	if (absPercent >= 20) {
		return {
			key: isIncrease ? 'significantly_increased_by' : 'significantly_decreased_by',
			params: { count: absDifference, unit }
		}
	}

	return {
		key: isIncrease ? 'slightly_increased_by' : 'slightly_decreased_by',
		params: { count: absDifference, unit }
	}
}

export function getTrendingPercentageChange(
	percent
): [key: ResourceKeys['ns_dashboard'], params: { [key in string]: any }] {
	if (!percent || percent === 0) {
		return ['comparison.trend_stable', {}]
	}
	const absPercent = Math.abs(percent || 0)

	const isIncrease = percent > 0

	if (absPercent >= 20) {
		return [
			isIncrease ? 'comparison.significant_trend_up_by' : 'comparison.significant_trend_down_by',
			{ percent: absPercent, unit: '%' }
		]
	}

	return [isIncrease ? 'comparison.slight_trend_up_by' : 'comparison.slight_trend_down_by', { percent: absPercent }]
}

/**
 * Gets the appropriate trend description based on percentage change
 * @param percent - The percentage change
 * @returns i18n key for trend description
 */
export function getTrendDescription(percent: number | null): string {
	if (percent === null || percent === undefined || Math.abs(percent) < 1) {
		return 'remained_unchanged'
	}
	return percent > 0 ? 'higher_than_last_month' : 'lower_than_last_month'
}

/**
 * Gets the appropriate trending icon based on percentage change
 * @param percentageChange - The percentage change value
 * @returns Icon name for trending direction
 */
export function getTrendingIcon(percentageChange: number | null): IconProps['name'] {
	return isNil(percentageChange) || percentageChange < 0 ? 'TrendingDown' : 'TrendingUp'
}

/**
 * Formats percentage change with proper sign and decimal places
 * @param percentage - The percentage value to format
 * @returns Formatted percentage string with + or - sign
 */
export function formatPercentageChange(percentage: number | null): string {
	if (isNil(percentage) || percentage === 0) return '0%'

	const formattedPercent = Math.abs(percentage).toFixed(1)
	return percentage > 0 ? `+${formattedPercent}%` : `-${formattedPercent}%`
}

/**
 * Gets the appropriate icon color based on percentage change
 * @param percentage - The percentage change value
 * @returns CSS color value using design system variables
 */
export function getIconColor(percentage: number | null): string {
	if (isNil(percentage) || percentage === 0) return 'hsl(var(--muted-foreground))'
	return percentage > 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'
}

/**
 * Gets analysis sentence i18n key
 * @param percentageChange - The percentage change value
 * @returns i18n key for analysis sentence
 */
export function getAnalysisSentence(percentageChange: number | null): ResourceKeys['ns_dashboard'] {
	const trendKey = getTrendDescription(percentageChange)
	return `comparison.${trendKey}` as ResourceKeys['ns_dashboard']
}

/**
 * Gets detailed description i18n data
 * @param percent - The percentage change value
 * @param difference - The absolute difference in units
 * @returns Object with i18n key and params
 */
export function getDetailDescription(
	percent: number | null,
	difference: number | null,
	unit: string
): [key: string, params: Record<string, any>] {
	const { key, params } = getDetailedChangeDescription(percent, difference, unit)
	return [`ns_dashboard:comparison.${key}`, params]
}
