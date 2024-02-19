'use client' // temp

import styles from "@/styles/modules/(protected)/myLibraryPage/myLibraryPage.module.scss";
import { logOutAction } from "@/server_actions/general_actions";

const MyLibraryPage = () => {


    return (
        <main className={styles.main}>
            <button onClick={() => logOutAction()}>Sign Out</button>
        </main>
    )
}

export default MyLibraryPage