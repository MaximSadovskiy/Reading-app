import Link from "next/link";
import Image from "next/image";
import styles from '@/styles/modules/rootLayout/accountEnter.module.scss';

const AccountEnter = () => {

    return (
        <div aria-labelledby="account-info">
            <Link href='/' className={styles.link} >
                <Image src='/account-enter.svg' alt='' role='presentation' width={35} height={35} />
                <p id="account-info">Аккаунт</p>
            </Link>
        </div>
    )
};

export default AccountEnter;