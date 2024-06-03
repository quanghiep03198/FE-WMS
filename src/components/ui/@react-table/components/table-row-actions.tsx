import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Icon
} from '@/components/ui';

type DataTableRowActionsProps = {
	enableDeleting?: boolean;
	enableEditing?: boolean;
	slot?: React.ReactNode;
	onDelete?: AnonymousFunction;
	onEdit?: AnonymousFunction;
};

export const DataTableRowActions: React.FC<DataTableRowActionsProps> = (props) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon'>
					<Icon name='EllipsisVertical' />
					<span className='sr-only'>Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{props.slot}
				<DropdownMenuItem
					disabled={!props.enableEditing}
					className='flex items-center gap-x-3'
					onClick={() => {
						if (props.onEdit) props.onEdit();
					}}>
					<Icon name='Pencil' />
					Cập nhật
				</DropdownMenuItem>

				<DropdownMenuItem
					disabled={!props.enableDeleting}
					className='flex items-center gap-x-3'
					onClick={() => {
						if (props.onDelete) props.onDelete();
					}}>
					<Icon name='Trash2' />
					Xóa
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
