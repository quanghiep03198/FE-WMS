import { TIconProps } from '@/components/ui';

export type NavigationConfig = Array<{
	id: number;
	icon: TIconProps['name'];
	title: string;
	path: string;
	description: string;
}>;

export const navigationConfig: NavigationConfig = [];
