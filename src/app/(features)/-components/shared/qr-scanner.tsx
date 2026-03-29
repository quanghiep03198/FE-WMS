import type { IScannerProps } from '@yudiel/react-qr-scanner'
import { Scanner } from '@yudiel/react-qr-scanner'

export const QRScanner: React.FC<IScannerProps> = (props) => {
	const highlightCodeOnCanvas = (detectedCodes, ctx) => {
		detectedCodes.forEach((detectedCode) => {
			const { boundingBox, cornerPoints } = detectedCode

			// Draw bounding box
			ctx.strokeStyle = '#22c55e'
			ctx.lineWidth = 4
			ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height)

			// Draw corner points
			ctx.fillStyle = '#22c55e'
			cornerPoints.forEach((point) => {
				ctx.beginPath()
				ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
				ctx.fill()
			})
		})
	}

	return (
		<Scanner
			classNames={{
				container: '[&_svg]:!stroke-foreground'
			}}
			components={{
				finder: true,
				zoom: true,
				tracker: highlightCodeOnCanvas
			}}
			{...props}
		/>
	)
}
