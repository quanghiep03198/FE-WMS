import RoleBaseAccessControl from '@/app/-components/-guard/role-base-access-control'
import { UserRole } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import type { IconProps, TypographyProps } from '@/components/ui'
import { Badge, Checkbox, Div, Icon, Typography } from '@/components/ui'
import type { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import type { CellContext, ColumnDefBase } from '@tanstack/react-table'
import { format } from 'date-fns'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TruckloadDeliveryStatus } from '../-constants'
import { useUpdateContainerConditionMutation } from '../-hooks/use-truckload-delivery-asm'
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
		<Badge variant='outline' className='rounded-l-full rounded-r-full'>
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
	const isMobile = useMediaQuery('(max-width: 1023px)')

	const value = getValue()
	if (!value)
		return (
			<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
				<Icon name='Truck' className='self-center stroke-muted-foreground' />
				{t('ns_common:titles.unknown')}
			</Typography>
		)
	if (!isMobile)
		return (
			<LicensePlateHoverCard
				licensePlate={row.original.license_plate}
				licensePlateImage={row.original.license_plate_image}
			/>
		)
	return (
		<Div className='flex flex-col space-y-1'>
			<LicensePlateHoverCard
				licensePlate={row.original.license_plate}
				licensePlateImage={row.original.license_plate_image}
			/>
			{row.original.container_number && (
				<Typography
					variant='small'
					color='muted'
					className='col-start-2 inline-grid grid-cols-[auto_1fr] gap-x-2 font-normal'>
					<Icon name='Container' />
					{row.original.container_number}
				</Typography>
			)}
		</Div>
	)
}

export const DepartureTimeCell: React.FC<CellContext<ITruckloadDelivery, Date> & TypographyProps> = (props) => {
	const isMobile = useMediaQuery('(max-width: 1023px)')
	const { t } = useTranslation()

	const value = props.getValue()

	if (isMobile)
		return (
			<Div className='flex flex-col gap-y-1'>
				<Typography
					variant='small'
					color={value ? 'default' : 'muted'}
					className={cn('inline-flex items-center gap-x-2', props.className)}
					aria-invalid={props['aria-invalid']}>
					<Icon name={value ? 'LogOut' : 'ClockAlert'} />
					{value ? format(new Date(value), 'yyyy-MM-dd HH:mm') : t('ns_common:titles.unknown')}
				</Typography>

				{props.row.original.actual_departure_time && (
					<Typography variant='small' className='inline-flex items-center gap-x-2' color='muted'>
						<Icon name='Cctv' />
						{format(new Date(props.row.original.actual_departure_time), 'yyyy-MM-dd HH:mm')}
					</Typography>
				)}
			</Div>
		)

	return <DateTimeCell {...props} />
}

export const ContainerStatusCheckbox: ColumnDefBase<ITruckloadDelivery, boolean>['cell'] = ({
	row,
	column,
	getValue
}) => {
	const { mutateAsync, isPending, isError, variables } = useUpdateContainerConditionMutation()
	const currentValue = isPending ? variables[column.id] : Boolean(getValue())

	return (
		<RoleBaseAccessControl
			mode='mask'
			classNames={{
				innerWrapper: 'grid place-items-center group-hover/rbac:opacity-0'
			}}
			authorizedRoles={[UserRole.FG_WAREHOUSE_STAFF]}>
			<Checkbox
				className={cn(isPending ? 'opacity-50' : 'opacity-100', isError ? 'border-destructive' : 'border-primary')}
				disabled={row.original.approval_status === TruckloadDeliveryStatus.CONFIRMED || isPending}
				defaultChecked={currentValue}
				checked={currentValue}
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
	CellContext<ITruckloadDelivery, Date | null> & { fallbackValue?: Date } & TypographyProps
> = ({ getValue, fallbackValue, className, ...props }) => {
	const { t } = useTranslation()
	const value = getValue() ?? fallbackValue

	if (props['aria-invalid']) console.log('invalid', props['aria-invalid'])

	if (value)
		return (
			<Typography {...props} variant='small' className={className}>
				{format(new Date(value), 'yyyy-MM-dd HH:mm')}
			</Typography>
		)

	return (
		<Typography variant='small' color='muted' className='flex items-center gap-x-2'>
			<Icon name='ClockAlert' stroke='hsl(var(--muted-foreground))' />
			{t('ns_common:titles.unknown')}
		</Typography>
	)
}
