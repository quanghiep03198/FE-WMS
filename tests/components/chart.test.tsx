import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { barY, defineChart } from '@tanstack/charts'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import React from 'react'
import { afterEach, expect, it, vi } from 'vitest'

import { ChartContainer, chartMarkRenderer, ChartPlot } from '@components/ui/chart'

afterEach(() => {
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})

function mockCanvas() {
	vi.stubGlobal('Path2D', class Path2D {})
	const context = new Proxy(
		{},
		{
			get: (_, property) =>
				property === 'measureText' ? () => ({ width: 20 }) : () => undefined,
			set: () => true
		}
	) as CanvasRenderingContext2D
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => context)
}

it('renders marks on canvas with SVG axes and preserves keyboard tooltip interaction', async () => {
	mockCanvas()
	const definition = (value: number) => defineChart({
		marks: [barY([{ category: 'A', value }], { x: 'category', y: 'value', renderer: chartMarkRenderer })],
		scales: { x: { scale: scaleBand }, y: { scale: scaleLinear, grid: true } },
		svgAnimation: { duration: 0 },
		tooltip
	})
	const { container, rerender } = render(
		<ChartContainer config={{}}>
			<ChartPlot
				ariaLabel='Hybrid chart'
				definition={definition(10)}
				valueAnimation
				width={600}
				height={320}
			/>
		</ChartContainer>
	)

	const chart = await screen.findByRole('img', { name: 'Hybrid chart' })
	expect(container.querySelector('.ts-chart-canvas__scene')).toBeInTheDocument()
	const canvasLayer = container.querySelector<HTMLElement>('.ts-chart-canvas')
	expect(canvasLayer).toBeInTheDocument()
	expect(container.querySelector('.chart-value-animation')).toBeInTheDocument()
	expect(container.querySelector('svg text')).toBeInTheDocument()
	fireEvent.keyDown(chart, { key: 'ArrowRight' })
	await waitFor(() => expect(container.querySelector('.ts-chart-tooltip')).toHaveTextContent('10'))

	rerender(
		<ChartContainer config={{}}>
			<ChartPlot ariaLabel='Hybrid chart' definition={definition(20)} valueAnimation width={600} height={320} />
		</ChartContainer>
	)
	await waitFor(() => expect(container.querySelector('.ts-chart-tooltip')).toHaveTextContent('20'))
	expect(container.querySelector('.ts-chart-canvas')).toBe(canvasLayer)
})

it('renders nested polar marks on canvas and keeps the chart accessible', async () => {
	mockCanvas()
	const slices = pie([{ category: 'A', value: 10 }], { value: 'value' })
	const definition = defineChart({
		marks: [polar({
			marks: [radialArc(slices, { renderer: chartMarkRenderer, innerRadius: 40 })],
			scales: { angle: null, radius: null }
		})],
		scales: { x: null, y: null },
		tooltip
	})
	const { container } = render(
		<ChartContainer config={{}}>
			<ChartPlot ariaLabel='Hybrid pie' definition={definition} valueAnimation width={320} height={320} />
		</ChartContainer>
	)

	const chart = await screen.findByRole('img', { name: 'Hybrid pie' })
	expect(container.querySelector('.ts-chart-canvas__scene')).toBeInTheDocument()
	fireEvent.keyDown(chart, { key: 'ArrowRight' })
	await waitFor(() => expect(container.querySelector('.ts-chart-tooltip')).toHaveTextContent('10'))
})

it('animates tooltip entry for value-animated charts without animating chart geometry', async () => {
	mockCanvas()
	const animate = vi.fn((frames: Keyframe[]) => ({ frames, cancel: vi.fn(), onfinish: null }))
	const originalAnimate = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'animate')
	Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate })
	try {
		const definition = defineChart({
			marks: [barY([{ category: 'A', value: 10 }], { x: 'category', y: 'value', renderer: chartMarkRenderer })],
			scales: { x: { scale: scaleBand }, y: { scale: scaleLinear } },
			tooltip
		})
		const { container, rerender } = render(
			<ChartContainer config={{}}>
				<ChartPlot valueAnimation ariaLabel='Animated tooltip' definition={definition} width={600} height={320} />
			</ChartContainer>
		)
		const chart = await screen.findByRole('img', { name: 'Animated tooltip' })
		expect(animate).not.toHaveBeenCalled()
		fireEvent.keyDown(chart, { key: 'ArrowRight' })
		await waitFor(() => expect(container.querySelector('.ts-chart-tooltip')).toHaveTextContent('10'))
		expect(animate).toHaveBeenCalled()
		const keyframes = animate.mock.calls[0][0]
		expect(keyframes[0]).toMatchObject({ opacity: 0, transform: 'scale(0.96)' })
		const calls = animate.mock.calls.length
		rerender(
			<ChartContainer config={{}}>
				<ChartPlot valueAnimation ariaLabel='Animated tooltip' definition={definition} width={600} height={320} />
			</ChartContainer>
		)
		expect(animate).toHaveBeenCalledTimes(calls)
	} finally {
		if (originalAnimate) Object.defineProperty(HTMLElement.prototype, 'animate', originalAnimate)
		else Reflect.deleteProperty(HTMLElement.prototype, 'animate')
	}
})
