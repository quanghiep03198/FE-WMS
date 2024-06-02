import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(features)/_layout/dashboard/')({
	component: () => <div>Hello /(features)/_layout/dashboad/!</div>
});
