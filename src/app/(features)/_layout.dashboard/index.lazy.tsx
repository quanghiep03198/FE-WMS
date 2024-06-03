import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(features)/_layout/dashboard/')({
  component: () => <div>Hello /(features)/_layout/dashboard/!</div>
})