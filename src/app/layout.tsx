import type { Metadata } from 'next'
// styles 
import '@/styles/globals/globalStyles.scss';
// font 
import { marckScriptFont, ptRootVariableFont } from '@/fonts/fonts';
// components
import ContextWrapper from '@/components/rootLayout/ContextWrapper';
// auth session
import { SessionProvider } from 'next-auth/react';
import { auth } from '$/auth';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/rootLayout/Header'), { ssr: false });

export const metadata: Metadata = {
	title: 'БукЛайф',
	description: 'Электронная библиотека Бук-Лайф',
	keywords: 'чтение, библиотека, литература, книги, классика, читать онлайн',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {

	const session = await auth();

	return (
		<html lang="ru" className={`${marckScriptFont.variable} ${ptRootVariableFont.variable}`}>
			<SessionProvider session={session}>
				<ContextWrapper>
					<Header />
					{children}
				</ContextWrapper>
			</SessionProvider>
		</html>
	)
}