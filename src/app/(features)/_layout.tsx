import { Outlet, createFileRoute } from '@tanstack/react-router';
import Navbar from '../_components/_partials/-navbar';
import Sidebar from '../_components/_partials/-sidebar';

export const Route = createFileRoute('/(features)/_layout')({
	component: () => (
		<>
			<Sidebar />
			<Navbar />
			<Outlet />
		</>
	)
});
