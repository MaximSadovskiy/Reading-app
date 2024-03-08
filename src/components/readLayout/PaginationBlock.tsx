import styles from "@/styles/modules/readLayout/readPage.module.scss";

interface PaginatingProp {
    list: Array<string>;
    onClickFunction: Function;
    onClickMoveOneFunction: Function;
    currentSectionIndex: Number;
}

const MAX_ITEMS_PAGING = 6;

function PaginationBlockComponent(prop: PaginatingProp) {
    function onClickPropFuncCall(ev: any) {
        prop.onClickFunction(ev);
    }
    function PropMoveOneFuncCall(isLeft: boolean) {
        prop.onClickMoveOneFunction(isLeft);
    }
    function movePageLeft() {
        PropMoveOneFuncCall(true);
    }
    function movePageRight() {
        PropMoveOneFuncCall(false);
    }
    // Algoritm for pagination, works but sucks.
    const start = Math.max(0, (prop.currentSectionIndex as number) - Math.floor(MAX_ITEMS_PAGING / 2));
    const end = Math.min(prop.list.length, start + MAX_ITEMS_PAGING);

    const PagingButtons = [];
    PagingButtons.push(
        <a key={"<"} onClick={movePageLeft} href="#">
            ❮
        </a>
    );
    for (let i = start; i < end; ++i) {
        PagingButtons.push(
            <a
                key={"paging_" + i}
                data-selected={prop.currentSectionIndex === i ? true : false}
                onClick={onClickPropFuncCall}
                href="#"
            >
                {prop.list[i]}
            </a>
        );
    }
    PagingButtons.push(
        <a key={">"} onClick={movePageRight} href="#">
            ❯
        </a>
    );

    return (
        <div key={"paging_div"} className={styles.pagination}>
            {PagingButtons}
        </div>
    );
}
export { PaginationBlockComponent };
