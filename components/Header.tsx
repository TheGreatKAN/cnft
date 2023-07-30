import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/Header.module.css';
import logo from '../images/logo4Head.png'

import Image from 'next/image' 

const Header: React.FC = () => {

    const mint = (): void => {
        window.open('https://community-nft-minting-app.vercel.app/', '_blank');
    };

    return(
        <div className={styles.headerBox}>
            <Image src={logo} className={styles.myImage} alt='logo4Header' height={125} width={350}/>
            <div className={styles.buttons}>
                <ConnectButton />
                <button onClick={mint} className={styles.mintButton}>Mint</button>
            </div>
        </div>
    )
}

export default Header;
