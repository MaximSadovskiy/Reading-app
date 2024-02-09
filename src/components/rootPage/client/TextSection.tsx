'use client';

import Link from 'next/link';
import styles from '@/styles/modules/rootPage/textSection.module.scss';
import { textVariants, linkVariants, ulVariants } from '@/animation/variants/textMainPage/textMainPageVariants';
import { m, LazyMotion, domAnimation, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';


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

const TextSection = ({ textData }: TextSectionProps) => {

    // text data
    const { textBeforeLinkToBooks, textBeforeLinkToInfo, textBeforeLinkToLC, textBeforeLinkToRead, textOfLinkLC, textOfLinkToBooks, textOfLinkToInfo, textOfLinkToRead } = textData;

    // access to current scroll value
    const { scrollY } = useScroll();

    const [animationState, setAnimationState] = useState({
        h2: false,
        firstH3: false,
        firstUl: false,
        secondH3: false,
        lastH3: false,
        secondUl: false,
        // second pair of links
        links: false,
    });

    // animate welcome text without need to scroll
    useEffect(() => {
        setAnimationState({
            ...animationState,
            h2: true,
        });
    }, []);

    // manipulating state with scroll
    useMotionValueEvent(scrollY, 'change', (latestValue) => {
        console.log(`changes, latestValue: ${latestValue}`);
        if (latestValue > 100 && !animationState.firstH3) {
            setAnimationState({
                ...animationState,
                firstH3: true,
            });
        }
        else if (latestValue > 200 && !animationState.firstUl) {
            setAnimationState({
                ...animationState,
                firstUl: true,
            });
        }
        else if (latestValue > 350 && !animationState.secondH3) {
            setAnimationState({
                ...animationState,
                secondH3: true,
            });
        }
        else if (latestValue > 600 && !animationState.secondUl) {
            setAnimationState({
                ...animationState,
                secondUl: true,
            });
        }
        else if (latestValue > 700 && !animationState.links) {
            setAnimationState({
                ...animationState,
                links: true,
            });
        }
        else if (latestValue > 800 && !animationState.lastH3) {
            setAnimationState({
                ...animationState,
                lastH3: true,
            })
        }
    });


    return (
        <LazyMotion features={domAnimation}>
            <m.h2 className={styles.h2}
                variants={textVariants}
                initial='initial'
                animate={animationState.h2 ? 'animate' : ''}
            >
                Добро пожаловать на <strong>Бук<span>Лайф</span></strong>!
            </m.h2>
            <section>
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
                        variants={linkVariants}
                    >
                        <TextWithLink
                            href='/books'
                            parText={textBeforeLinkToBooks}
                            linkText={textOfLinkToBooks}
                        />
                    </m.li>
                    <m.li className={styles.listItem}
                        variants={linkVariants}
                    >
                        <TextWithLink
                            href='/lc'
                            parText={textBeforeLinkToLC}
                            linkText={textOfLinkLC}
                        />
                    </m.li>
                    <m.li className={styles.listItem}
                        variants={linkVariants}
                        initial='initial'
                        animate={animationState.links ? 'animate' : ''}
                    >
                        <TextWithLink
                            href='/read'
                            parText={textBeforeLinkToRead}
                            linkText={textOfLinkToRead}
                        />
                    </m.li>
                    <m.li className={styles.listItem}
                        variants={linkVariants}
                        initial='initial'
                        animate={animationState.links ? 'animate' : ''}
                    >
                        <TextWithLink
                            href='/info'
                            parText={textBeforeLinkToInfo}
                            linkText={textOfLinkToInfo}
                        />
                    </m.li>
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