import { Role } from '@/common/constants/enums'
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

type RoleFilterProps = {
	onChange?: (selectedRoles: Role[]) => void
}

const RoleFilter: React.FC<RoleFilterProps> = ({ onChange }) => {
	// state to manage selected roles
	const [selectedRoles, setSelectedRoles] = useState<Set<Role>>(new Set([]))

	// function to toggle role selection
	const toggleRoles = (Roles: Role) => {
		setSelectedRoles((prev) => {
			const newSet = new Set(prev)
			if (newSet.has(Roles)) {
				newSet.delete(Roles)
			} else {
				newSet.add(Roles)
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
					Roles
					{selectedRoles.size > 0 && (
						<span className='ml-1 rounded-full bg-gray-600 px-2 py-0.5 text-xs'>{selectedRoles.size}</span>
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='w-48'>
				<DropdownMenuLabel>Roles</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{Object.values(Role).map((Roles) => (
					<DropdownMenuCheckboxItem
						key={Roles}
						checked={selectedRoles.has(Roles)}
						onCheckedChange={() => toggleRoles(Roles)}>
						<span>{Roles}</span>
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default RoleFilter
