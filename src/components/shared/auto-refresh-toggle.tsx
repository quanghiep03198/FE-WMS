import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@components/ui/hover-card'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { Slider } from '@components/ui/slider'
import { Switch } from '@components/ui/switch'
import useQueryParams from '@hooks/use-query-params'
import { HoverCardPortal } from '@radix-ui/react-hover-card'
import { useDebounce, usePrevious } from 'ahooks'
import { useEffect, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

export type UrlQueryParams = {
	'auto-refresh': number | false
	[key: string]: unknown
}

const AutoRefreshToggle: React.FC = () => {
	const { t } = useTranslation()
	const id = useId()
	const { searchParams, setParams } = useQueryParams<UrlQueryParams>()
	const [refetchInterval, setRefetchInterval] = useState<number | false>(searchParams['auto-refresh'])
	const previousRefetchInterval = usePrevious<number | false>(refetchInterval)

	const debouncedValue = useDebounce(refetchInterval, { wait: 1000 })

	useEffect(() => {
		setParams({ ...searchParams, 'auto-refresh': debouncedValue })
	}, [debouncedValue])

	return (
		<HoverCard>
			<HoverCardTrigger className='bg-accent/60 inline-flex items-center justify-center gap-x-3 rounded-md px-4 py-2 shadow'>
				<Label htmlFor={id}>{t('ns_common:table.auto_refresh')}</Label>
				<Switch
					checked={Boolean(refetchInterval)}
					id={id}
					onCheckedChange={(checked) => {
						if (checked) setRefetchInterval(previousRefetchInterval ?? 5000)
						else setRefetchInterval(false)
					}}
				/>
			</HoverCardTrigger>
			<HoverCardPortal>
				<HoverCardContent className='w-80' hidden={!refetchInterval} side='right' sideOffset={8}>
					<Div className='space-y-4'>
						<Typography variant='small'>{t('ns_common:table.refetch_interval')}</Typography>
						<Div className='flex items-start justify-between gap-2'>
							<Icon className='-translate-y-2' name='Zap' size={20} />
							<Div className='flex-1 basis-full space-y-3'>
								<Slider
									max={30000}
									min={5000}
									step={5000}
									value={
										typeof refetchInterval === 'number'
											? [refetchInterval]
											: [previousRefetchInterval || 5000]
									}
									onValueChange={([value]) => setRefetchInterval(value)}
								/>
								<Div className='flex items-baseline justify-between'>
									{Array.from({ length: 6 }, (_, i) => (
										<Typography className='text-center text-[10px]!' key={i} variant='small'>
											{(i + 1) * 5}
										</Typography>
									))}
								</Div>
							</Div>
							<Icon className='-translate-y-2' name='Leaf' size={20} />
						</Div>
					</Div>
				</HoverCardContent>
			</HoverCardPortal>
		</HoverCard>
	)
}

AutoRefreshToggle.displayName = 'AutoRefreshToggle'

export default AutoRefreshToggle
