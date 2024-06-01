import { ResizablePanelGroup } from '@/components/ui';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout')({
	component: RootLayout
});

function RootLayout() {
	return (
		<ResizablePanelGroup direction='horizontal'>
			<Outlet />
		</ResizablePanelGroup>
	);
}
