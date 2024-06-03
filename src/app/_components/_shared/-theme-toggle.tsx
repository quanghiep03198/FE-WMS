import { Theme } from '@/common/constants/enums';
import useTheme from '@/common/hooks/use-theme';
import { cn } from '@/common/utils/cn';
import { Button, Icon, Swap } from '@/components/ui';
import { memo, useMemo } from 'react';

const ThemeToggle: React.FC = () => {
	const { theme, setTheme } = useTheme();

	const darkTheme = useMemo<boolean>(() => theme === Theme.DARK, [theme]);

	return (
		<Button
			variant='ghost'
			size='icon'
			className='relative'
			onClick={() => (darkTheme ? setTheme(Theme.LIGHT) : setTheme(Theme.DARK))}>
			<Icon
				name='Sun'
				className={cn(
					'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out',
					!darkTheme ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'
				)}
			/>
			<Icon
				name='Moon'
				className={cn(
					'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out',
					darkTheme ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'
				)}
			/>
		</Button>
	);
};

export default memo(ThemeToggle);
