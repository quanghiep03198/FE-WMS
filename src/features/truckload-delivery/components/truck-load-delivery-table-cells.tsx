import { UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import type { TypographyProps } from '@components/customs/typography'
import { Typography } from '@components/customs/typography'
import RoleBaseAccessControl from '@components/guards/role-base-access-control'
import { Badge } from '@components/ui/badge'
import { Checkbox } from '@components/ui/checkbox'
import type { IconProps } from '@components/ui/icon'
import { Icon } from '@components/ui/icon'
import type { CellContext, ColumnDefBase } from '@tanstack/react-table'
import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TruckloadDeliveryStatus } from '../constants'
import { useUpdateContainerConditionMutation } from '../hooks/use-truckload-delivery-request'
import type { ITruckloadDelivery } from '../types'
import LicensePlateHoverCard from './license-plate-hover-card'

export const DispatchOrderStatusBadge: ColumnDefBase<ITruckloadDelivery, TruckloadDeliveryStatus>['cell'] = ({
	getValue
}) => {
	const { t } = useTranslation()

	const value = getValue() as TruckloadDeliveryStatus

	const statusIconVariants: Record<TruckloadDeliveryStatus, IconProps['name']> = {
		[TruckloadDeliveryStatus.PENDING]: 'Loader',
		[TruckloadDeliveryStatus.CONFIRMED]: 'CircleCheckBig',
		[TruckloadDeliveryStatus.REQUEST_CHANGE]: 'Undo2'
	}

	return (
		<Badge className='rounded-l-full rounded-r-full' variant='outline'>
			<Icon
				name={statusIconVariants[value] ?? 'CircleDotDashed'}
				size={14}
				className={cn({
					'stroke-muted-foreground': value === TruckloadDeliveryStatus.PENDING,
					'stroke-success': value === TruckloadDeliveryStatus.CONFIRMED,
					'stroke-destructive': value === TruckloadDeliveryStatus.REQUEST_CHANGE
				})}
			/>
			{t(`ns_common:status.${value}`)}
		</Badge>
	)
}

export const LicensePlateColumnCell: React.FC<CellContext<ITruckloadDelivery, string>> = ({ row, getValue }) => {
	const { t } = useTranslation()
	// const isMobile = useMediaQuery('(max-width: 1023px)')

	const value = getValue()
	if (!value)
		return (
			<Typography className='flex items-center gap-x-2' color='muted' variant='small'>
				<Icon className='stroke-muted-foreground self-center' name='Truck' />
				{t('ns_common:titles.unknown')}
			</Typography>
		)

	return (
		<Div className='flex flex-col gap-y-1'>
			<LicensePlateHoverCard
				licensePlate={row.original.license_plate}
				licensePlateImage={row.original.license_plate_image}
			/>
			{row.original.container_number && (
				<Typography
					className='col-start-2 inline-grid grid-cols-[auto_1fr] gap-x-2 font-normal @5xl:hidden'
					color='muted'
					variant='small'>
					<Icon name='Container' />
					{row.original.container_number}
				</Typography>
			)}
		</Div>
	)
}

export const DepartureTimeCell: React.FC<CellContext<ITruckloadDelivery, Date> & TypographyProps> = (props) => {
	// const isMobile = useMediaQuery('(max-width: 1023px)')
	const { t } = useTranslation()

	const value = props.getValue()

	// if (isMobile)
	return (
		<>
			<DateTimeCell {...props} className='hidden @5xl:flex' />
			<Div className='flex flex-col gap-y-1 @5xl:hidden'>
				<Typography
					aria-invalid={props['aria-invalid']}
					className={cn('inline-flex items-center gap-x-2', props.className)}
					color={value ? 'default' : 'muted'}
					variant='small'>
					<Icon name={value ? 'LogOut' : 'ClockAlert'} />
					{value ? format(new Date(value), 'yyyy-MM-dd HH:mm') : t('ns_common:titles.unknown')}
				</Typography>

				{props.row.original.actual_departure_time && (
					<Typography className='inline-flex items-center gap-x-2' color='muted' variant='small'>
						<Icon name='Cctv' />
						{format(new Date(props.row.original.actual_departure_time), 'yyyy-MM-dd HH:mm')}
					</Typography>
				)}
			</Div>
		</>
	)

	return <DateTimeCell {...props} />
}

export const ContainerStatusCheckbox: ColumnDefBase<ITruckloadDelivery, boolean>['cell'] = ({
	row,
	column,
	getValue
}) => {
	const { mutateAsync, isPending, isError, variables } = useUpdateContainerConditionMutation()
	const currentValue = variables?.[column.id] ?? Boolean(getValue())

	return (
		<RoleBaseAccessControl
			authorizedRoles={[UserRole.FG_WAREHOUSE_STAFF]}
			mode='mask'
			classNames={{
				innerWrapper: 'grid place-items-center group-hover/rbac:opacity-0'
			}}>
			<Checkbox
				aria-busy={isPending}
				aria-invalid={isError}
				checked={currentValue}
				className='aria-invalid:border-destructive aria-busy:opacity-50'
				defaultChecked={currentValue}
				disabled={row.original.approval_status === TruckloadDeliveryStatus.CONFIRMED || isPending}
				onCheckedChange={async (value) =>
					await mutateAsync({
						dispatch_order: row.original.dispatch_order,
						[column.id]: Boolean(value)
					})
				}
			/>
		</RoleBaseAccessControl>
	)
}

export const DateTimeCell: React.FC<
	CellContext<ITruckloadDelivery, Nullish<Date>> & { fallbackValue?: Date } & TypographyProps
> = ({ getValue, fallbackValue, className, ...props }) => {
	const { t } = useTranslation()
	const value = getValue() ?? fallbackValue

	if (value)
		return (
			<Typography {...props} className={className} variant='small'>
				{format(new Date(value), 'yyyy-MM-dd HH:mm')}
			</Typography>
		)

	return (
		<Typography className={cn('flex items-center gap-x-2', className)} color='muted' variant='small' {...props}>
			<Icon name='ClockAlert' stroke='var(--muted-foreground)' />
			{t('ns_common:titles.unknown')}
		</Typography>
	)
}
