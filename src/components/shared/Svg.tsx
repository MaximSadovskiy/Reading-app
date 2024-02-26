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
        <svg width={`${width}px`} height={`${height}px`} 

        data-direction={direction} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>

            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>

            <g id="SVGRepo_iconCarrier"> <path d="M4 12L10 6M4 12L10 18M4 12H14.5M20 12H17.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> </g>

        </svg>
    )
};


export const CheckmarkSvg = ({ width, height, color = '#ffc9a3' }: { width: number, height: number, color?: string }) => {

    return (
        <svg width={`${width}`} height={`${height}`} 

        version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" enableBackground="new 0 0 32 32" xmlSpace="preserve"

        fill={color} stroke={color}>

        <g id="SVGRepo_bgCarrier" strokeWidth="0"/>

        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.064"/>

        <g id="SVGRepo_iconCarrier"> <polyline fill="none" stroke={color} strokeWidth="3.2" strokeMiterlimit="10" points="28,8 16,20 11,15 "/> <polygon points="26,14.2 26,26 6,26 6,6 25.8,6 27.8,4 4,4 4,28 28,28 28,12.2 "/> </g>

        </svg>
    )
};


type CheckV2Props = {
    color?: string;
    isAdded?: boolean;
    width: number;
    height: number;
}
export const CheckMarkSvgV2 = ({ width, height, isAdded }: CheckV2Props) => {
    return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={width}
                height={height}
                viewBox="0 0 24 24"
                data-added={isAdded && true}                
            >
            <path
                d="M22.705 4.954a1 1 0 0 0-1.414 0L8.727 17.518a1 1 0 0 1-1.414 0l-4.599-4.599A1 1 0 1 0 1.3 14.333l4.604 4.596a3 3 0 0 0 4.24-.002l12.56-12.559a1 1 0 0 0 0-1.414Z"
            />
            </svg>
      )
};


export const CrossSvg = ({ width, height }: { width: number, height: number }) => {

    return (
        <svg width={`${width}px`} height={`${height}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

        <g id="SVGRepo_bgCarrier" strokeWidth="0"/>

        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>

        <g id="SVGRepo_iconCarrier"> <path d="M19 5L4.99998 19M5.00001 5L19 19" /* stroke={color} */ strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/> </g>

        </svg>
    )
};


export const WarningSvg = ({ width, height, color }: { width: number, height: number, color: string }) => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            width={`${width}px`}
            height={`${height}px`}
            style={{
                fillRule: "evenodd",
                clipRule: "evenodd",
                strokeLinejoin: "round",
                strokeMiterlimit: 2,
                fill: color
            }}
        >
            <path
            d="M-640-64H640v800H-640z"
            style={{
                fill: "none",
            }}
            />
            <path
            d="M32.427 7.987c2.183.124 4 1.165 5.096 3.281l17.936 36.208c1.739 3.66-.954 8.585-5.373 8.656H13.967c-4.022-.064-7.322-4.631-5.352-8.696l18.271-36.207c.342-.65.498-.838.793-1.179 1.186-1.375 2.483-2.111 4.748-2.063Zm-.295 3.997a2.034 2.034 0 0 0-1.659 1.017C24.161 24.98 18.076 37.082 12.172 49.268c-.546 1.225.391 2.797 1.762 2.863 12.06.195 24.125.195 36.185 0 1.325-.064 2.321-1.584 1.769-2.85-5.793-12.184-11.765-24.286-17.966-36.267-.366-.651-.903-1.042-1.79-1.03Z"
            style={{
                fillRule: "nonzero",
            }}
            />
            <path
            d="M33.631 40.581h-3.348l-.368-16.449h4.1l-.384 16.449Zm-3.828 5.03c0-.609.197-1.113.592-1.514.396-.4.935-.601 1.618-.601.684 0 1.223.201 1.618.601.395.401.593.905.593 1.514 0 .587-.193 1.078-.577 1.473-.385.395-.929.593-1.634.593-.705 0-1.249-.198-1.634-.593-.384-.395-.576-.886-.576-1.473Z"
            style={{
                fillRule: "nonzero",
            }}
            />
        </svg>
    )
};


// STAR SVG
type StarSvgProps = {
    width: number;
    height: number;
    isHoveredItem: boolean;
}



export const StarSvg = ({width, height, isHoveredItem}: StarSvgProps) => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            data-active={isHoveredItem}
        >
            <path
                data-active={isHoveredItem}
                strokeWidth={1.5}
                d="M9.153 5.408C10.42 3.136 11.053 2 12 2c.947 0 1.58 1.136 2.847 3.408l.328.588c.36.646.54.969.82 1.182.28.213.63.292 1.33.45l.636.144c2.46.557 3.689.835 3.982 1.776.292.94-.546 1.921-2.223 3.882l-.434.507c-.476.557-.715.836-.822 1.18-.107.345-.071.717.001 1.46l.066.677c.253 2.617.38 3.925-.386 4.506-.766.582-1.918.051-4.22-1.009l-.597-.274c-.654-.302-.981-.452-1.328-.452-.347 0-.674.15-1.329.452l-.595.274c-2.303 1.06-3.455 1.59-4.22 1.01-.767-.582-.64-1.89-.387-4.507l.066-.676c.072-.744.108-1.116 0-1.46-.106-.345-.345-.624-.821-1.18l-.434-.508c-1.677-1.96-2.515-2.941-2.223-3.882.293-.941 1.523-1.22 3.983-1.776l.636-.144c.699-.158 1.048-.237 1.329-.45.28-.213.46-.536.82-1.182l.328-.588Z"
            />
        </svg>
    )
}


type SlideUpgradeProps = {
    color?: string;
    width: number;
    height: number;
    isAdded?: boolean;
}
export const SlideArrowUpgradeSvg = ({ width, height, isAdded }: SlideUpgradeProps) => {
    return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={width}
                height={height}
                data-added={isAdded && false}
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 12h2.5M20 12l-6-6m6 6-6 6m6-6H9.5"
            />
            </svg>
      )
};


type LikeSvgProps = {
    width: number;
    height: number;
    strokeWidth: number;
    isActive: boolean;
}
export const LikeSvg = ({ width, height, strokeWidth, isActive }: LikeSvgProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            data-active={isActive}
        >
            <path
                d="M4.331 12.047 12 20l7.669-7.953A4.804 4.804 0 0 0 21 8.714C21 6.111 18.965 4 16.454 4a4.465 4.465 0 0 0-3.214 1.38L12 6.668 10.76 5.38A4.465 4.465 0 0 0 7.546 4C5.036 4 3 6.11 3 8.714c0 1.25.479 2.45 1.331 3.333Z"
                opacity={0.15}
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
                d="M4.331 12.047 12 20l7.669-7.953A4.804 4.804 0 0 0 21 8.714C21 6.111 18.965 4 16.454 4a4.465 4.465 0 0 0-3.214 1.38L12 6.668 10.76 5.38A4.465 4.465 0 0 0 7.546 4C5.036 4 3 6.11 3 8.714c0 1.25.479 2.45 1.331 3.333Z"
            />
        </svg>
    )
};