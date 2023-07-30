import React, { useEffect, useState } from 'react';

import styles from '../styles/Footer.module.css'; 
import footerLogo from '../images/footerLogo.png'
import Image from 'next/image' 
import Web from '../images/website.png'
import Copy from '../images/footerCopy.png'
import Discord from '../images/discord.png'
import Twitter from '../images/twitter.png'
import exp from 'constants';

const Footer: React.FC = () => {
    const webSite = () => {
        window.open('https://nft.kiwitoken.site/', '_blank');
      };
      const twitter = () => {
        window.open('https://twitter.com/_KiwiToken_?s=20', '_blank');
      };
      const discord = () => {
        window.open('https://discord.gg/2mtqGvj2gg', '_blank');
      };



    return(
        <div id='footerBox' className={styles.footerBox}>
            <div id='logo' className={styles.logo}>
                <Image src={footerLogo} alt='logo' id='logoImage' className={styles.logoImage}  />
            </div>
            <div id='copyWrite' >
                <Image src={Copy} alt='copy' className={styles.copyWrite} />
            </div>
            <div id='links' className={styles.links}>
                <Image src={Discord} alt='discord' onClick={discord}  className={styles.link} />
                <Image src={Web} alt='web' onClick={webSite} className={styles.link} />
                <Image src={Twitter} alt='twitter' onClick={twitter} className={styles.link} />
            </div>
        </div>
    )
}

export default Footer