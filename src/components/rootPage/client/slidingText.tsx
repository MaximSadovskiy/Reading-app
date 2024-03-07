'use client'
import styles from "@/styles/modules/rootPage/slidingLogo.module.scss";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";


const SlidingText = () => {

    const [isMouseEnter, setIsMouseEnter] = useState(false);
    // ref to access domNode of circle
    const circleRef = useRef<ForwardedMethods>(null);
    const circleWidth = '50px';
    const circleHeight = '50px';

    // helper - animate to target
    const animateToTarget = (e: React.MouseEvent) => {
        if (!circleRef.current) return;

        const target = (e.currentTarget as HTMLElement).closest('div');
        if (!target) return;

        // coords and width / height
        const coords = target.getBoundingClientRect();

        const mouseXcoord = e.clientX;
        const mouseYcoord = e.clientY;

        const circleWidthNum = parseInt(circleWidth);
        const circleHeightNum = parseInt(circleHeight);

        // translate ranges
        const destX = mouseXcoord - coords.left - circleWidthNum / 2;
        const destY = mouseYcoord - coords.top - circleHeightNum / 2;

        /* maybe need thresholds */
        
        // change values
        circleRef.current.setLeft(destX);
        circleRef.current.setTop(destY);
    };

    // mouseEnter event handler
    const handleMouseEnter = (e: React.MouseEvent) => {
        setIsMouseEnter(true);
        animateToTarget(e);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        animateToTarget(e);
    };
    
    // mouseLeave event
    const handleMouseLeave = () => {
        setIsMouseEnter(false);
    };
    
    return (
        <div className={styles.container1}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <ul className={styles.list1}
            >
                <li>Большая</li>
                <li>Разножанровая</li>
                <li>Удобное</li>
                <li>Функциональное</li>
                <li>Современное</li>
            </ul>
            {isMouseEnter && (
                <Circle 
                    width={circleWidth}
                    height={circleHeight}
                    ref={circleRef}
                />
            )}
        </div>
    )
};

export default SlidingText;

// helper circle component
// maybe add to Shared
interface CircleProps {
    width: string;
    height: string;
}

interface ForwardedMethods {
    setLeft: (val: number) => void | undefined;
    setTop: (val: number) => void | undefined;
}

const Circle = forwardRef(function Circle(
        props: CircleProps, 
        ref: React.ForwardedRef<ForwardedMethods>
    ) {

    const { width, height } = props;

    // innerRef
    const innerCircleRef = useRef<HTMLDivElement>(null);


    // methods to parent to access ref
    useImperativeHandle(ref, () => {
        return {
            setLeft(val) {
                if (innerCircleRef.current) {
                    innerCircleRef.current.style.left = `${val}px`;
                }
            },
            setTop(val) {
                if (innerCircleRef.current) {
                    innerCircleRef.current.style.top = `${val}px`;
                }
            }
        }
    }, []);


    return (
        <div 
            ref={innerCircleRef}
            className={styles.circle}
            style={{
                width,
                height
            }}
        >  
        </div>
    )
});