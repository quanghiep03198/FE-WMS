import { createFileRoute } from '@tanstack/react-router';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import tw from 'tailwind-styled-components';
import { PageComposition } from './_components/-page-composition';

export const Route = createFileRoute('/(auth)/login/')({
	component: LoginPage
});

function LoginPage() {
	const { t } = useTranslation();

	return (
		<>
			<Helmet title='Login' meta={[{ name: 'description', content: 'Greenland Warehouse Management System' }]} />
			<Page>
				<PageComposition.ThemeSelector />
				<PageComposition.SideImage />
				<Section>
					{/* Page heading/description */}
					<PageComposition.Heading title={t('ns_auth:login_title')} description={t('ns_auth:login_description')} />
					{/* Form section */}
					<PageComposition.FormSection />
					{/* Language selector */}
					<PageComposition.LanguageSelector />
				</Section>
			</Page>
		</>
	);
}

const Page = tw.div`relative grid min-h-screen w-full grid-cols-1 overflow-y-auto bg-background text-foreground scrollbar-none xl:grid-cols-2`;
const Section = tw.div`mx-auto flex h-full w-full max-w-lg flex-1 flex-grow flex-col items-center justify-center gap-y-6 overflow-y-auto px-2 sm:py-10 md:py-10`;
