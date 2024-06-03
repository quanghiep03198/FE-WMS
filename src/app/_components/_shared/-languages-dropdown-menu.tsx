import { useLocalStorage } from '@/common/hooks/use-storage';
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon
} from '@/components/ui';
import { locales } from '@/i18n';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguaguesDropdownMenu: React.FC = () => {
	const { i18n } = useTranslation();

	const [i18nextLng, setI18nextLng] = useLocalStorage('i18nextLng', i18n.language);

	useEffect(() => {
		setI18nextLng(i18n.language);
	}, [i18n.language]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon' type='button'>
					<Icon name='Languages' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-48' align='end'>
				<DropdownMenuLabel>Languages</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup value={i18nextLng} onValueChange={(value) => i18n.changeLanguage(value)}>
					{locales.map((item) => (
						<DropdownMenuRadioItem value={item.value} key={item.value}>
							{item.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default memo(LanguaguesDropdownMenu);
