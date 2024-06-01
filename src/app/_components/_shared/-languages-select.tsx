import { useLocalStorage } from '@/common/hooks/use-storage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { locales } from '@/i18n';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguaguesSelect: React.FC = () => {
	const { i18n } = useTranslation();

	const [i18nextLng, setI18nextLng] = useLocalStorage('i18nextLng', i18n.language);

	useEffect(() => {
		setI18nextLng(i18n.language);
	}, [i18n.language]);

	return (
		<Select onValueChange={(value) => i18n.changeLanguage(value)} defaultValue={i18nextLng}>
			<SelectTrigger>
				<SelectValue placeholder='Choose language' />
			</SelectTrigger>
			<SelectContent>
				{locales.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default LanguaguesSelect;
