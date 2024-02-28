import styles from "@/styles/modules/readLayout/readPage.module.scss";

interface PaginatingProp {
    list: Array<string>;
    onClickFunction: Function;
    onClickMoveOneFunction: Function;
    currentSectionIndex: Number;
}

const MAX_ITEMS_PAGING = 6;

function PaginationBlockComponent(prop: PaginatingProp) {
  function PropFuncCall(ev: any) {
    prop.onClickFunction(ev);
  }
  function PropMoveOneFuncCall(isLeft: boolean) {
    prop.onClickMoveOneFunction(isLeft);
  }
  function left() {
    PropMoveOneFuncCall(true);
  }
  function right() {
    PropMoveOneFuncCall(false);
  }
  // Algoritm for pagination, works but sucks.
  const tempArr = [];
  const start = Math.max(0, (prop.currentSectionIndex as number) - Math.floor(MAX_ITEMS_PAGING / 2));
  const end = Math.min(prop.list.length, start + MAX_ITEMS_PAGING);

  tempArr.push(<a onClick={left} href="#">❮</a>);
  for (let i = start; i < end; ++i) {
      tempArr.push(
          <a  key={i}
              className={prop.currentSectionIndex === i ? styles.selectedSection : ""}
              onClick={PropFuncCall}
              href="#">
                {prop.list[i]}
          </a>
      );
  }
  if (end < prop.list.length) {
      tempArr.push(<a>...</a>);
  }
  tempArr.push(<a onClick={right} href="#">❯</a>);
  
  return (
    <>
      <div className={styles.pagination}>{tempArr}</div>
    </>
  );
}
export { PaginationBlockComponent };
