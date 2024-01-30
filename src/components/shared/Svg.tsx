export const SearchSvg = ({width = 80, height = 80}: {color?: string, width?: number, height?: number}) => {
    return (
        <svg width={`${width}px`} height={`${height}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
            <g id="SVGRepo_iconCarrier">
                <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
        </svg>
    )
};


export const ArrowSvg = ({width = 30, height = 30, isOpen}: {width: number, height: number, isOpen: boolean}) => {

    return (
        <svg data-open={isOpen} width={`${width}px`} height={`${height}px`} viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg" stroke="#ffc9a3" strokeWidth="0.00024000000000000003" transform='rotate(90deg)'>

            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>

            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>

            <g id="SVGRepo_iconCarrier"> <path d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z"/> </g>

        </svg>
    )
};


export const SlideArrowSvg = ({ width = 50, height = 50, direction = "left"}: {
    width: number,
    height: number,
    direction: 'left' | 'right',
}) => {

    return (
        <svg width={`${width}px`} height={`${height}px`} data-direction={direction} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>

            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>

            <g id="SVGRepo_iconCarrier"> <path d="M4 12L10 6M4 12L10 18M4 12H14.5M20 12H17.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </g>

        </svg>
    )
};
