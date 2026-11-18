import { render } from '@testing-library/react'
import * as THREE from 'three'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LoginMascot from '@features/auth/components/login/login-mascot'

const mocks = vi.hoisted(() => ({
	renderer: {
		setPixelRatio: vi.fn(),
		setSize: vi.fn(),
		setClearColor: vi.fn(),
		render: vi.fn(),
		dispose: vi.fn(),
		shadowMap: { enabled: false }
	}
}))

vi.mock('three', async (importOriginal) => {
	const three = await importOriginal<typeof import('three')>()
	return { ...three, WebGLRenderer: vi.fn(() => mocks.renderer) }
})

describe('LoginMascot', () => {
	beforeEach(() => {
		Object.values(mocks.renderer).forEach((method) => typeof method === 'function' && method.mockReset())
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			}
		)
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	const getEyeScales = () => {
		const renderCalls = mocks.renderer.render.mock.calls
		const scene = renderCalls[renderCalls.length - 1]?.[0]
		if (!(scene instanceof THREE.Scene)) throw new Error('Mascot scene was not rendered.')

		const eyeScales: number[] = []
		scene.traverse((object) => {
			if (object instanceof THREE.Mesh && object.geometry instanceof THREE.ExtrudeGeometry) {
				eyeScales.push(object.scale.y)
			}
		})
		return eyeScales
	}

	it('renders an aria-hidden canvas and disposes its renderer on unmount', () => {
		const { container, unmount } = render(
			<LoginMascot action={null} focusTarget='none' passwordVisible={false} usernameProgress={0} />
		)
		const canvas = container.querySelector('canvas')

		expect(canvas).toHaveAttribute('aria-hidden', 'true')

		unmount()

		expect(mocks.renderer.dispose).toHaveBeenCalledOnce()
	})

	it('winks one eye while revealing the password and closes both while it is hidden', () => {
		vi.stubGlobal(
			'matchMedia',
			vi.fn(() => ({
				matches: true,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn()
			}))
		)
		const { rerender } = render(
			<LoginMascot action={null} focusTarget='password' passwordVisible={false} usernameProgress={0} />
		)

		expect(getEyeScales()).toEqual([0.05, 0.05])

		rerender(<LoginMascot action={null} focusTarget='password' passwordVisible usernameProgress={0} />)

		expect(getEyeScales()).toEqual([0.05, 1])

		rerender(<LoginMascot action={null} focusTarget='username' passwordVisible usernameProgress={0} />)

		expect(getEyeScales()).toEqual([1, 1])

		rerender(<LoginMascot action={null} focusTarget='none' passwordVisible usernameProgress={0} />)

		expect(getEyeScales()).toEqual([1, 1])
	})

	it('does not start a continuous animation loop when reduced motion is enabled', () => {
		vi.stubGlobal(
			'matchMedia',
			vi.fn(() => ({
				matches: true,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn()
			}))
		)
		const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame')

		render(<LoginMascot action={null} focusTarget='none' passwordVisible={false} usernameProgress={0} />)

		expect(requestAnimationFrame).not.toHaveBeenCalled()
	})
})
