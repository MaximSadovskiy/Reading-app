'use client';

import styles from '@/styles/modules/rootLayout/header.module.scss';
// components
import Navbar from './Navbar';
import ThemeChanger from './ThemeChanger';
import AccountEnter from './AccountEnter';
import Logo from './Logo';
import { MenuList } from './MenuList';
import { useOrientation } from '@/hooks/useOrientation';


const Header = () => {

    const orientation = useOrientation();

    return (
        <header className={styles.header}>
            {orientation === 'mobile' && (
                <>
                    <Logo />
                    <MenuList isTextPresented={false} orientation='mobile' />
                </>
            )}
            {orientation === 'tablet' && (
                <>
                    <Logo />
                    <MenuList isTextPresented={true} orientation='tablet' />
                    <ThemeChanger styleMode='desktop' />
                    <AccountEnter styleMode='desktop' />
                </>
            )}
            {orientation === 'desktop' && (
                <>
                    <Logo />
                    <Navbar />
                    <ThemeChanger styleMode='desktop' />
                    <AccountEnter styleMode='desktop' />
                </>
            )}
        </header>
    )
};

export default Header;