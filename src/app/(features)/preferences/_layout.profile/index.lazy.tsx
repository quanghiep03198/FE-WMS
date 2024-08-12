import { useAuth } from '@/common/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage, Button, Div, Icon, Input, Separator, Typography } from '@/components/ui'

import { createLazyFileRoute } from '@tanstack/react-router'
import tw from 'tailwind-styled-components'

export const Route = createLazyFileRoute('/(features)/preferences/_layout/profile/')({
	component: Page
})

function Page() {
	const { user } = useAuth()

	return (
		<Div className='flex flex-col items-stretch gap-y-6'>
			<Div className='grid grid-cols-[128px_auto] gap-x-10 items-center bg-gradient-to-r from-secondary/50 to-secondary/25 p-4 rounded-xl'>
				<Div className='w-full aspect-square relative row-span-full'>
					<Avatar className='w-full h-full inset-0'>
						<AvatarImage src={user.picture} />
						<AvatarFallback>Unknown</AvatarFallback>
					</Avatar>
					<Icon
						name='BadgeCheck'
						size={24}
						className='absolute bottom-1 -translate-x-1/2 right-0 fill-blue-500 stroke-primary-foreground'
					/>
				</Div>
				<Div className='flex flex-col gap-y-1'>
					<Typography variant='h5' className='row-span-1'>
						{user.display_name}
					</Typography>
					<Typography color='muted' className='row-span-1 block'>
						{user.email ?? 'example@email.com'}
					</Typography>
				</Div>
			</Div>
			<Form>
				{/*  */}
				<Div as='fieldset' className='flex items-center justify-between'>
					<Div className='space-y-1'>
						<Typography variant='h6'>Company profile</Typography>
						<Typography variant='small' color='muted'>
							Update your personal photo and details here.
						</Typography>
					</Div>
					<Div className='inline-flex items-center gap-x-1'>
						<Button variant='outline'>Cancel</Button>
						<Button>Save changes</Button>
					</Div>
				</Div>
				<Separator />
				{/* Public profile */}
				<Fieldset>
					<Div className='space-y-1'>
						<Legend>Public profile</Legend>
						<Typography variant='small' color='muted'>
							This will be displayed on your profile
						</Typography>
					</Div>
					<Div className='space-y-6'>
						<Input value={user.display_name} />
						<Input value={user.email ?? 'example@email.com'} />
					</Div>
				</Fieldset>
				{/*  */}
			</Form>
		</Div>
	)
}

const Form = tw.form`flex flex-col items-stretch gap-y-6`
const Fieldset = tw.fieldset`grid grid-cols-[2fr_3fr]`
const Legend = tw.legend`text-base font-medium`
const Description = tw
