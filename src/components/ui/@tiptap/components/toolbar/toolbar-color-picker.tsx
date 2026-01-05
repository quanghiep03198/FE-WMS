'use no memo'

import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { cn } from '@/common/utils/cn'
import {
	ColorPicker,
	ColorPickerAlpha,
	ColorPickerEyeDropper,
	ColorPickerFormat,
	ColorPickerHue,
	ColorPickerOutput,
	ColorPickerSelection
} from '@/components/ui/@custom/color-picker'
import { useDebounceFn } from 'ahooks'
import Color, { ColorLike } from 'color'
import { Activity, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Div, Icon, IconProps, Popover, PopoverContent, PopoverTrigger, Separator, Tooltip } from '../../..'
import { PresetColors } from '../../constants'
import { useEditorContext } from '../../context/editor-context'

type ColorPickerProps = {
	label: string
	icon: IconProps['name']
	type: 'textStyle' | 'highlight'
}

const ToolbarColorPicker: React.FC<ColorPickerProps> = ({ label, icon, type }) => {
	const { t } = useTranslation()
	const { editor } = useEditorContext()
	const { theme } = useTheme()
	const [colorPaletteType, setColorPaletteType] = useState<'preset' | 'custom'>('preset')
	const [currentColor, setCurrentColor] = useState<string | undefined>(editor.getAttributes(type).color)

	useEffect(() => {
		setCurrentColor(editor.getAttributes(type).color)
	}, [type, editor.getAttributes(type).color])

	const fallbackColor = useMemo(() => (theme === Theme.DARK ? 'hsl(0 0% 98%)' : 'hsl(0 0% 3.9%)'), [theme])

	const handleSelectColor = useCallback(
		(color: string) => {
			setCurrentColor(color)
			if (type === 'textStyle') editor.commands.setColor(color)
			if (type === 'highlight') editor.commands.setHighlight({ color })
		},
		[type]
	)

	const handleConvertHexToRgba = useCallback((hex: string, alpha: number) => {
		try {
			return Color(hex).alpha(alpha).rgb().string()
		} catch {
			return hex
		}
	}, [])

	const handleConvertRgbaToHex = useCallback(
		(value: number[]) => {
			try {
				const clampByte = (n: unknown) => {
					if (typeof n !== 'number' || !Number.isFinite(n)) return 0
					return Math.min(255, Math.max(0, Math.round(n)))
				}
				const clampAlpha = (a: unknown) => {
					if (typeof a !== 'number' || !Number.isFinite(a)) return 1
					const normalized = a > 1 ? a / 255 : a
					return Math.min(1, Math.max(0, normalized))
				}

				const r = clampByte(value[0])
				const g = clampByte(value[1])
				const b = clampByte(value[2])
				const alpha = clampAlpha(value.length >= 4 ? value[3] : 1)
				return alpha < 1 ? Color.rgb([r, g, b]).alpha(alpha).hexa() : Color.rgb([r, g, b]).hex()
			} catch {
				return fallbackColor
			}
		},
		[fallbackColor]
	)

	const handleGetPickerValue = useCallback(() => {
		try {
			return Color(currentColor ?? fallbackColor)
				.rgb()
				.string()
		} catch {
			return fallbackColor
		}
	}, [currentColor, fallbackColor])

	const { run: handleSetCustomColor, flush } = useDebounceFn(
		(color: ColorLike) => {
			const rgba = Array.isArray(color) ? (color as number[]) : []
			// const alpha = typeof rgba[3] === 'number' ? rgba[3] : 1
			// const colorValue = type === 'highlight' ? handleConvertHexToRgba(hex, alpha) : hex
			const hex = handleConvertRgbaToHex(rgba)
			handleSelectColor(hex)
		},
		{ wait: 200, trailing: true }
	)

	return (
		<Div className='relative'>
			<Popover modal>
				<Tooltip message={label}>
					<PopoverTrigger asChild>
						<Button
							variant='ghost'
							className='aspect-square h-8 w-8 flex-col gap-x-1.5'
							size='icon'
							type='button'>
							<Icon name={icon} />
							<Div
								className={cn('mt-0.5 h-1.5 w-4/5 self-center rounded-l-full rounded-r-full border-[0.5px]', {
									'!bg-foreground': !currentColor && type === 'textStyle',
									'bg-transparent': !currentColor && type === 'highlight'
								})}
								style={{ backgroundColor: currentColor }}
							/>
						</Button>
					</PopoverTrigger>
				</Tooltip>
				<PopoverContent align='end' className='h-auto p-0'>
					<Activity mode={colorPaletteType === 'preset' ? 'visible' : 'hidden'}>
						<Div className='grid grid-cols-10 gap-2 p-2 transition-allow-discrete animate-in fade-in-0 slide-in-from-right-2'>
							{PresetColors.map((color) => (
								<button
									key={color}
									style={{
										border: 'none',
										backgroundColor: color,
										width: 18,
										height: 18,
										aspectRatio: '1 / 1',
										borderRadius: 2,
										...(editor.isActive('textStyle', {
											color: color
										}) && { outlineColor: color, outlineOffset: 2, outlineWidth: 1, outlineStyle: 'solid' })
									}}
									onClick={() => handleSelectColor(color)}
								/>
							))}
						</Div>
					</Activity>
					<Activity mode={colorPaletteType === 'custom' ? 'visible' : 'hidden'}>
						<Div className='h-80 max-w-sm p-4 transition-allow-discrete animate-in fade-in-0 slide-in-from-left-2'>
							<ColorPicker
								value={handleGetPickerValue()}
								onChange={handleSetCustomColor}
								onMouseUp={() => flush()}>
								<ColorPickerSelection />
								<Div className='flex items-center gap-4'>
									<ColorPickerEyeDropper />
									<Div className='grid w-full gap-1'>
										<ColorPickerHue />
										<ColorPickerAlpha />
									</Div>
								</Div>
								<Div className='flex items-center gap-2'>
									<ColorPickerOutput />
									<ColorPickerFormat />
								</Div>
							</ColorPicker>
						</Div>
					</Activity>
					<Separator />
					<Div className='flex items-center justify-between p-1.5'>
						{colorPaletteType === 'preset' ? (
							<Button size='sm' variant='ghost' onClick={() => setColorPaletteType('custom')}>
								<Icon name='Pipette' /> {t('ns_common:editor.custom_color')}
							</Button>
						) : (
							<Button size='sm' variant='ghost' onClick={() => setColorPaletteType('preset')}>
								<Icon name='Palette' /> {t('ns_common:editor.preset_color')}
							</Button>
						)}
						<Button
							variant='secondary'
							size='sm'
							type='button'
							className='gap-x-2'
							onClick={() => {
								if (type === 'highlight') editor.commands.unsetHighlight()
								if (type === 'textStyle') editor.commands.unsetColor()
							}}>
							<Icon name='Eraser' /> {t('ns_common:editor.unset_color')}
						</Button>
					</Div>
				</PopoverContent>
			</Popover>
			{/* <Input
				id='color-picker'
				type='color'
				className='invisible absolute inset-0 appearance-none border-none outline-none'
				onChange={debounce((e) => handleSelectColor(e.target.value), 500)}
			/> */}
		</Div>
	)
}

export default ToolbarColorPicker
