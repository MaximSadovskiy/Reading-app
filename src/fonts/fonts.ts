import localFont from 'next/font/local';

export const marckScriptFont = localFont({
	src: './MarckScript-Regular.ttf',
	display: 'swap',
	weight: '400',
    variable: '--font-marckscript'
});

export const ptRootVariableFont = localFont({
    src: './PT-Root-variable.ttf',
    display: 'swap',
    variable: '--font-pt-variable',
});