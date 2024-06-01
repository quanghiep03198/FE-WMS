import { Skeleton, TableCell, TableRow } from '../..';

type DataTableLoading = {
	prepareRows: number;
	prepareCols: number;
};

export function TableBodyLoading({ prepareRows, prepareCols }: DataTableLoading) {
	const preRenderCells = Array.apply(null, Array(prepareCols)).map((_, i) => i);
	const preRenderRows = Array.apply(null, Array(prepareRows)).map((_, j) => j);
	return preRenderRows.map((_, i) => (
		<TableRow key={i}>
			{preRenderCells.map((_, j) => (
				<TableCell key={j} className='py-4'>
					<Skeleton className='h-3 w-full bg-muted' />
				</TableCell>
			))}
		</TableRow>
	));
}
