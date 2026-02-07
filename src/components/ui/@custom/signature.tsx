import { useEffectOnce, useLayoutEffectOnce } from '@/common/hooks/use-effect-once'
import trimCanvas from '@/common/libs/trim-canvas'
import { type RefObject, useCallback, useRef } from 'react'
import SignaturePad, { type Options, type PointGroup } from 'signature_pad'

export type SignatureCanvasInstance = {
	toDataURL: (options?: {
		type?: 'image/svg+xml' | 'image/png' | 'image/jpg' | 'image/webp' | 'image/jpeg'
		quality?: number
		trim?: boolean
	}) => string
	getTrimmedCanvas: () => HTMLCanvasElement
	isEmpty: () => boolean
	getSignaturePad: () => SignaturePad | null
	getCanvas: () => HTMLCanvasElement | null
	toData: () => PointGroup[]
	clear: () => void
}

export type SignatureCanvasProps = Partial<React.ComponentPropsWithoutRef<'canvas'>> & {
	onBegin?: () => void
	onEnd?: () => void
	ref?: RefObject<SignatureCanvasInstance>
	padOptions?: Partial<Options>
}

/**
 * @author quanghiep03198
 * @createdate 2026-01-23
 * @lastmoddate 2026-01-23
 * @description Signature canvas component using {@link https://github.com/szimek/signature_pad?tab=readme-ov-file signature_pad} library
 * @returns {JSX.Element} - Signature canvas component
 */
export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
	ref,
	onBegin,
	onEnd,
	padOptions = { penColor: 'black', minWidth: 2.5, maxWidth: 2.5 },
	...props
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const signaturePadRef = useRef<SignaturePad>(null)

	useLayoutEffectOnce(() => {
		if (!signaturePadRef.current && canvasRef.current)
			signaturePadRef.current = new SignaturePad(canvasRef.current, padOptions)
	})

	const resizeCanvas = useCallback(() => {
		if (!canvasRef.current || !signaturePadRef.current) return
		const ratio = Math.max(window.devicePixelRatio || 1, 1)
		canvasRef.current.width = canvasRef.current.offsetWidth * ratio
		canvasRef.current.height = canvasRef.current.offsetHeight * ratio
		canvasRef.current.getContext('2d').scale(ratio, ratio)
		signaturePadRef.current.clear() // otherwise isEmpty() might return incorrect value
	}, [])

	useEffectOnce(() => {
		if (!signaturePadRef?.current || !canvasRef?.current) return

		window.addEventListener('resize', resizeCanvas)
		window.screen.orientation.addEventListener('change', resizeCanvas)
		resizeCanvas()

		if (typeof onBegin === 'function') signaturePadRef.current.addEventListener('beginStroke', onBegin)
		if (typeof onEnd === 'function') signaturePadRef.current.addEventListener('endStroke', onEnd)

		return () => {
			if (typeof onBegin === 'function') signaturePadRef.current?.removeEventListener('beginStroke', onBegin)
			if (typeof onEnd === 'function') signaturePadRef.current?.removeEventListener('endStroke', onEnd)
			window.removeEventListener('resize', resizeCanvas)
			window.screen.orientation.removeEventListener('change', resizeCanvas)
		}
	})

	function getTrimmedCanvas() {
		const canvas = canvasRef.current
		if (!canvas) return null
		const copy = document.createElement('canvas')
		copy.width = canvas.width
		copy.height = canvas.height
		copy.getContext('2d').drawImage(canvas, 0, 0)
		return trimCanvas(copy)
	}

	if (ref && 'current' in ref) {
		ref.current = {
			getTrimmedCanvas() {
				return getTrimmedCanvas()
			},
			toDataURL(options = { type: 'image/webp', quality: 1, trim: true }) {
				if (options.trim) {
					const trimmedCanvas = getTrimmedCanvas()
					return trimmedCanvas.toDataURL(options.type, options.quality)
				}
				return canvasRef.current?.toDataURL(options.type, options.quality)
			},
			toData() {
				return signaturePadRef.current?.toData() ?? []
			},
			isEmpty() {
				return signaturePadRef.current?.isEmpty() ?? true
			},
			getSignaturePad() {
				return signaturePadRef.current
			},
			getCanvas() {
				return canvasRef.current
			},
			clear() {
				return signaturePadRef.current?.clear()
			}
		}
	}

	return <canvas ref={canvasRef} {...props} />
}
