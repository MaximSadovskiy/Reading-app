'use client';

import Link from 'next/link';
import styles from '@/styles/modules/rootPage/textSection.module.scss';
import { textVariants, ulVariants } from '@/animation/variants/textMainPage/textMainPageVariants';
import { m, LazyMotion, domAnimation, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCurrentUserClient } from '@/hooks/useCurrentUser';
import { getCurrentReadBookId } from '@/server_actions/books_actions';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { SlideArrowSvg } from '@/components/shared/Svg';
import { useOrientation } from '@/hooks/useOrientation';


interface TextSectionProps {
    textData: {
        textBeforeLinkToBooks: string;
		textOfLinkToBooks: string;
		textBeforeLinkToLC: string;
		textOfLinkLC: string;
		textBeforeLinkToRead: string;
		textOfLinkToRead: string;
		textBeforeLinkToInfo: string;
		textOfLinkToInfo: string;    
    }
}

// пороги для анимации (height of scroll)
const BREAKPOINTS = {
    mobile: {
        secondH3: 200,
        lastH3: 400,
        secondUl: 550,
        // second pair of links
        links: 680,
    },
    desktop: {
        firstH3: 100,
        firstUl: 250,
        secondH3: 450,
        lastH3: 630,
        secondUl: 700,
        // second pair of links
        links: 800,
    }
}

const TextSection = ({ textData }: TextSectionProps) => {

    // text data
    const { textBeforeLinkToBooks, textBeforeLinkToInfo, textBeforeLinkToLC, textBeforeLinkToRead, textOfLinkLC, textOfLinkToBooks, textOfLinkToInfo, textOfLinkToRead } = textData;

    // access to current scroll value
    const { scrollY } = useScroll();

    const [animationState, setAnimationState] = useState({
        firstH3: false,
        firstUl: false,
        secondH3: false,
        lastH3: false,
        secondUl: false,
        // second pair of links
        links: false,
    });

    // animate welcome text without need to scroll
    const orientation = useOrientation() === 'mobile' ? 'mobile' : 'desktop';
    

    useEffect(() => {
        if (orientation === 'mobile') {
            setAnimationState({
                ...animationState,
                firstH3: true,
                firstUl: true,
            });
        }
    }, [orientation]);

    // manipulating state with scroll
    useMotionValueEvent(scrollY, 'change', (latestValue) => {
        if (orientation !== 'mobile') {
            if (latestValue > BREAKPOINTS[orientation].firstH3 && !animationState.firstH3) {
                setAnimationState({
                    ...animationState,
                    firstH3: true,
                });
            }
            else if (latestValue > BREAKPOINTS[orientation].firstUl && !animationState.firstUl) {
                setAnimationState({
                    ...animationState,
                    firstUl: true,
                });
            }
        }
        if (latestValue > BREAKPOINTS[orientation].secondH3 && !animationState.secondH3) {
            setAnimationState({
                ...animationState,
                secondH3: true,
            });
        }
        if (latestValue > BREAKPOINTS[orientation].secondUl && !animationState.secondUl) {
            setAnimationState({
                ...animationState,
                secondUl: true,
            });
        }
        if (latestValue > BREAKPOINTS[orientation].links && !animationState.links) {
            setAnimationState({
                ...animationState,
                links: true,
            });
        }
        if (latestValue > BREAKPOINTS[orientation].lastH3 && !animationState.lastH3) {
            setAnimationState({
                ...animationState,
                lastH3: true,
            })
        }
    });


    // to current Reading book
    const user = useCurrentUserClient();
	const router = useRouter();

	const handleCurrentBookTransition = async () => {
		if (user?.id) {
			const result = await getCurrentReadBookId(user.id);
			if (result.error) {
				toast(result.error, {
					theme: 'colored',
					type: 'error',
				});
				return;
			}
			else {
				// if have book --> redirect
				router.push(`/read/${result.success}`);
			}
		}
	};

    return (
        <LazyMotion features={domAnimation}>
            <section className={styles.mainSection}>
                <Link className={styles.mainLink}
                    href='/books'
                >
                    К выбору книг
                    <SlideArrowSvg width={60} height={60} direction='right' />
                </Link>
                <m.h3 className={styles.h3}
                    variants={textVariants}
                    initial='initial'
                    animate={animationState.firstH3 ? 'animate' : ''}
                ><strong>БукЛайф</strong> - это сразу два в одном: </m.h3>
                <m.ul className={styles.list}
                    variants={ulVariants}
                    initial='initial'
                    animate={animationState.firstUl ? 'animate' : ''}
                >
                    <m.li className={styles.listItem}
                        variants={textVariants}
                    >
                        <p>Электронная библиотека с широким ассортиментом книг с акцентом на классические произведения</p>
                    </m.li>
                    <m.li className={styles.listItem}
                        variants={textVariants}
                    >
                        <p>Кроссплатформенное приложение для комфортного чтения книг в браузере с удобным интерфейсом</p>
                    </m.li>
                </m.ul>
            </section>
            <section>
                <m.h3 className={styles.h3}
                    variants={textVariants}
                    initial='initial'
                    animate={animationState.secondH3 ? 'animate' : ''}
                >Начать использование:</m.h3>
                <m.ul className={styles.list}
                    variants={ulVariants}
                    initial='initial'
                    animate={animationState.secondUl ? 'animate' : ''}
                >
                    <m.li className={styles.listItem}
                        variants={textVariants}
                    >
                        <TextWithLink
                            href='/books'
                            parText={textBeforeLinkToBooks}
                            linkText={textOfLinkToBooks}
                        />
                    </m.li>
                    <m.li className={styles.listItem}
                        variants={textVariants}
                    >
                        <TextWithLink
                            href='/auth/register'
                            parText={textBeforeLinkToLC}
                            linkText={textOfLinkLC}
                        />
                    </m.li>
                    <m.li className={styles.listItem}
                        variants={textVariants}
                        initial='initial'
                        animate={animationState.links ? 'animate' : ''}
                    >
                        <TextWithLink
                            href='/about'
                            parText={textBeforeLinkToInfo}
                            linkText={textOfLinkToInfo}
                        />
                    </m.li>
                    {user != null && (
                        /* читальный зал только для авторизаванных */
                        <m.li className={styles.listItem}
                            variants={textVariants}
                            initial='initial'
                            animate={animationState.links ? 'animate' : ''}
                        >
                            <BtnWithLink
                                clickHandler={handleCurrentBookTransition}
                                parText={textBeforeLinkToRead}
                                linkText={textOfLinkToRead}
                            />
                        </m.li>
                    )}
                </m.ul>
            </section>
            <m.h3 className={styles.h3}
                    variants={textVariants}
                    initial='initial'
                    animate={animationState.lastH3 ? 'animate' : ''}
            >Мы желаем Вам приятного чтения!
            </m.h3>
        </LazyMotion>
    )
};


export default TextSection;



// link
interface LinkProps {
	href: string;
	parText: string;
	linkText: string;
}

const TextWithLink = (props: LinkProps) => {
	return (
        <>
            <p>{props.parText}</p>
            <Link className={styles.link} href={props.href}>
                {props.linkText}
            </Link>
        </>
	)
}

interface BtnProps {
    parText: string;
	linkText: string;
    clickHandler: () => void;
}

const BtnWithLink = (props: BtnProps) => {
    return (
        <>
            <p>{props.parText}</p>
            <button className={styles.link} onClick={props.clickHandler}>
                {props.linkText}
            </button>
        </>
	)
}