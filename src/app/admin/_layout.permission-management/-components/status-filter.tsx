import { RecordStatus } from '@/common/constants/enums'
import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui'
import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

type StatusFilterProps = {
	onChange?: (selectedStatuses: RecordStatus[]) => void
}

const StatusFilter: React.FC<StatusFilterProps> = ({ onChange }) => {
	const { t } = useTranslation()
	const [selectedStatuses, setSelectedStatuses] = useState<Set<RecordStatus>>(new Set([]))

	const toggleStatus = (status: RecordStatus) => {
		setSelectedStatuses((prev) => {
			const newSet = new Set(prev)
			if (newSet.has(status)) {
				newSet.delete(status)
			} else {
				newSet.add(status)
			}
			onChange?.(Array.from(newSet))
			return newSet
		})
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					className='flex items-center gap-2 rounded-md border border-dashed border-gray-400 p-2'>
					<CirclePlus className='h-4 w-4' />
					{t('ns_common:common_fields.status')}
					{selectedStatuses.size > 0 && (
						<span className='ml-1 rounded-full bg-gray-600 px-2 py-0.5 text-xs'>{selectedStatuses.size}</span>
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='w-48'>
				<DropdownMenuLabel>{t('ns_common:common_fields.status')}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{Object.values(RecordStatus).map((status) => (
					<DropdownMenuCheckboxItem
						key={status}
						checked={selectedStatuses.has(status)}
						onCheckedChange={() => toggleStatus(status)}>
						<span>{status === 'Y' ? t('ns_common:status.active') : t('ns_common:status.idle')}</span>
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default StatusFilter
