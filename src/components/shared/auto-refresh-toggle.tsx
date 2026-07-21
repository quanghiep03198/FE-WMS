import {
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Label,
	Slider,
	Switch,
	Typography
} from '@/components/ui'
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
			<HoverCardTrigger className='inline-flex items-center justify-center gap-x-3 rounded-md bg-accent/60 px-4 py-2 shadow'>
				<Label htmlFor={id}>{t('ns_common:table.auto_refresh')}</Label>
				<Switch
					id={id}
					checked={Boolean(refetchInterval)}
					onCheckedChange={(checked) => {
						if (checked) setRefetchInterval(previousRefetchInterval ?? 5000)
						else setRefetchInterval(false)
					}}
				/>
			</HoverCardTrigger>
			<HoverCardPortal>
				<HoverCardContent hidden={!refetchInterval} side='right' sideOffset={8} className='w-80'>
					<Div className='space-y-4'>
						<Typography variant='small'>{t('ns_common:table.refetch_interval')}</Typography>
						<Div className='flex items-start justify-between gap-2'>
							<Icon name='Zap' size={20} className='-translate-y-2' />
							<Div className='flex-1 basis-full space-y-3'>
								<Slider
									min={5000}
									max={30000}
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
										<Typography key={i} variant='small' className='text-center text-[10px]!'>
											{(i + 1) * 5}
										</Typography>
									))}
								</Div>
							</Div>
							<Icon name='Leaf' size={20} className='-translate-y-2' />
						</Div>
					</Div>
				</HoverCardContent>
			</HoverCardPortal>
		</HoverCard>
	)
}

AutoRefreshToggle.displayName = 'AutoRefreshToggle'

export default AutoRefreshToggle
