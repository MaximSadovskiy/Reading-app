import localFont from 'next/font/local';

export const marckScriptFont = localFont({
	src: './MarckScript-Regular.ttf',
	display: 'swap',
	weight: '400',
    variable: '--font-marckscript'
});

export const ptRootRegularFont = localFont({
    src: './PT-Root-UI_Regular.ttf',
    display: 'swap',
    variable: '--font-pt-regular'
});

export const ptRootBoldFont = localFont({
    src: './PT-Root-UI_Bold.ttf',
    display: 'swap',
    variable: '--font-pt-bold'
});