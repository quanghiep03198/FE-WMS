import type { ChartValue } from '@tanstack/charts'
import { motion } from '@tanstack/charts/motion'
import type { ChartProps } from '@tanstack/charts/react/core'
import { Chart as TanStackChart } from '@tanstack/charts/react/core'
import * as React from 'react'

import { cn } from '@common/utils/cn'

// resize: true keeps the entrance animation from being cancelled by the initial container measurement
const chartRenderer = motion({
	initial: 'always',
	resize: true,
	transition: { type: 'spring', stiffness: 170, damping: 18, mass: 1 }
})

const THEMES = { light: '', dark: '.dark' } as const

export type ChartConfig = {
	[k in string]: {
		label?: React.ReactNode
		icon?: React.ComponentType
	} & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
}

type ChartContextProps = {
	config: ChartConfig
	height: number
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
	const context = React.use(ChartContext)

	if (!context) {
		throw new Error('Chart elements must be used within a <ChartContainer />')
	}

	return context
}

const ChartContainer: React.FC<
	React.ComponentProps<'div'> & {
		config: ChartConfig
		children: React.ReactNode
	}
> = ({ id, className, children, config, ...props }) => {
	const uniqueId = React.useId()
	const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`
	const containerRef = React.useRef<HTMLDivElement>(null)
	const [height, setHeight] = React.useState(320)

	React.useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const updateHeight = () => {
			const nextHeight = Math.round(container.getBoundingClientRect().height)
			if (nextHeight > 0) setHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight))
		}

		updateHeight()
		if (typeof ResizeObserver === 'undefined') {
			window.addEventListener('resize', updateHeight)
			return () => window.removeEventListener('resize', updateHeight)
		}

		const observer = new ResizeObserver(updateHeight)
		observer.observe(container)

		return () => observer.disconnect()
	}, [])

	return (
		<ChartContext.Provider value={{ config, height }}>
			<div
				data-chart={chartId}
				ref={containerRef}
				className={cn(
					'text-foreground relative aspect-video w-full font-[inherit] text-xs [&_.ts-chart-surface_svg]:outline-none [&_svg]:font-[inherit] [&_svg_text]:fill-muted-foreground [&_svg_text]:text-[10px] [&_svg_text]:font-normal',
					'[--ts-chart-tooltip-background:var(--popover)] [--ts-chart-tooltip-color:var(--popover-foreground)] [--ts-chart-tooltip-border:1px_solid_var(--border)] [--ts-chart-tooltip-font:inherit] [--ts-chart-tooltip-padding:0.6rem_0.75rem] [--ts-chart-tooltip-active-row-font-weight:400] [--ts-chart-tooltip-active-row-background:transparent] [--ts-chart-tooltip-active-row-shadow:none] [&_.ts-chart-tooltip__title]:mb-2! [&_.ts-chart-tooltip__rows]:flex [&_.ts-chart-tooltip__rows]:flex-col [&_.ts-chart-tooltip__rows]:gap-2 [&_.ts-chart-tooltip__row]:gap-x-3! [&_.ts-chart-tooltip__row]:font-normal!',
					className
				)}
				{...props}>
				<ChartStyle config={config} id={chartId} />
				{children}
			</div>
		</ChartContext.Provider>
	)
}
ChartContainer.displayName = 'Chart'

function ChartPlot<TDatum, TXValue extends ChartValue = ChartValue, TYValue extends ChartValue = ChartValue>({
	reveal = false,
	...props
}: Omit<ChartProps<TDatum, TXValue, TYValue>, 'renderer'> & {
	reserveHeight?: number
	/** Reveals the plot from left to right instead of the default motion; replays when the definition changes */
	reveal?: boolean
}) {
	const revealCount = React.useRef(0)
	const revealKey = React.useMemo(() => ++revealCount.current, [props.definition])

	const plot = <TanStackChart {...props} className={cn('h-full w-full', props.className)} renderer={chartRenderer} />

	if (!reveal) return plot

	return (
		<div className='chart-reveal-x h-full w-full' key={revealKey}>
			{plot}
		</div>
	)
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
	const colorConfig = Object.entries(config).filter(([, itemConfig]) => itemConfig.theme || itemConfig.color)

	if (!colorConfig.length) return null

	return (
		<style
			dangerouslySetInnerHTML={{
				__html: Object.entries(THEMES)
					.map(
						([theme, prefix]) => `
							${prefix} [data-chart=${id}] {
							${colorConfig
								.map(([key, itemConfig]) => {
									const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
									return color ? `  --color-${key}: ${color};` : null
								})
								.join('\n')}
							}
						`
					)
					.join('\n')
			}}
		/>
	)
}

const ChartLegendContent: React.FC<React.ComponentProps<'div'> & { hideIcon?: boolean }> = ({
	className,
	hideIcon = false,
	...props
}) => {
	const { config } = useChart()
	const entries = Object.entries(config)

	if (!entries.length) return null

	return (
		<div
			aria-label='Chart legend'
			className={cn(
				'text-foreground absolute inset-x-0 bottom-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2',
				className
			)}
			{...props}>
			{entries.map(([key, item]) => (
				<div className='flex items-center gap-1.5' key={key}>
					{item.icon && !hideIcon ? (
						<item.icon />
					) : (
						<span
							aria-hidden='true'
							className='h-2 w-2 shrink-0 rounded-[2px]'
							style={{ backgroundColor: `var(--color-${key})` }}
						/>
					)}
					<span>{item.label ?? key}</span>
				</div>
			))}
		</div>
	)
}
ChartLegendContent.displayName = 'ChartLegend'

export { ChartContainer, ChartLegendContent, ChartPlot, ChartStyle }
