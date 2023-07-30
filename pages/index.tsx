import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import  Header  from '../components/Header';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { access } from 'fs';
import stakeContractABI from '../components/ABI/stakeContractABI.json'
import mintContractABI from '../components/ABI/mintContractABI.json'
import BoxHeader from '../components/BoxHeader';
import StakeSection from '../components/Stake';
import CollectSection from '../components/Collect';
import UnstakeSection from '../components/Unstake';

declare global {
  interface Window {
    ethereum: any;
  }
}

const SECTIONS = {
  STAKE: "stake",
  COLLECT: "collect",
  UNSTAKE: "unstake",
};



const Home: NextPage = () => {
  const mintContractAddress = '0x5CD5a6dCf173a4e44CC62dB621C957c4B133E270';
const stakeContractAddress = '0xe0833Fba47fAEF2Ea12FEB674B8a2ca98658d1FD';
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [mintContractInstance, setMintContractInstance] = useState<ethers.Contract | null>(null);
  const [stakeContractInstance, setStakeContractInstance] = useState<ethers.Contract | null>(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [tokenIds, setTokenIds] = useState<number[]>([]);
  const [selectedSection, setSelectedSection] = useState('Stake');

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
  };


  useEffect(() => {
    if (typeof window !== 'undefined' && 'ethereum' in window) {
      setProvider(new ethers.BrowserProvider(window.ethereum));
    }
  }, []);

  useEffect(() => {
    const initializeSigner = async () => {
        if (provider) {
            const signer = await provider.getSigner();
            setSigner(signer);
        }
    };

    initializeSigner();
}, [provider]);

  useEffect(() => {
    if (signer) {
      const mintContractInstance = new ethers.Contract(mintContractAddress, mintContractABI, signer);
      setMintContractInstance(mintContractInstance);

      const stakeContractInstance = new ethers.Contract(stakeContractAddress, stakeContractABI, signer);
      setStakeContractInstance(stakeContractInstance);
    }
  }, [signer]);

  const { address, isConnecting, isDisconnected } = useAccount();
  const [connectedAddress, setConnectedAddress] = useState<string | undefined>(undefined);


  useEffect(() => {
    if (address && address.length > 5) {
      setConnectedAddress(address);
    }
  }, [address]);

  useEffect(()=>{
    console.log(connectedAddress);
  },[connectedAddress]);

  useEffect(() => {
    const fetchTotalSupply = async () => {
      if (signer && mintContractInstance) {
        try{
          const _totalSupply = await mintContractInstance.totalSupply();
          setTotalSupply(_totalSupply.toString());
          console.log('Total Supply:', totalSupply);
        } catch (error) {
          console.error('An error occurred: ', error);
        }
      }
    };

    if(mintContractInstance) {
      fetchTotalSupply();
    }
  }, [signer, mintContractInstance, totalSupply]);

  useEffect(() => {
    const getTokenIds = async () => {
      if(mintContractInstance) {
        try {
          const balance = await mintContractInstance.balanceOf(connectedAddress);
          let ids = [];
          for (let i = 0; i < balance; i++) {
            const tokenId = await mintContractInstance.tokenOfOwnerByIndex(connectedAddress, i);
            ids.push(tokenId.toString());
          }
          setTokenIds(ids);
          console.log('tokenIds', ids) 
        } catch (error) {
          console.error("Error fetching token IDs: ", error);
        }
      }
    };
    if(connectedAddress) {
      getTokenIds();
    }
  }, [connectedAddress, mintContractInstance]);


  return(
    
    <div className={styles.page}>
      <Header  />
    
    <div className={styles.container}>
        <div className={styles.box}>
          <BoxHeader selectedSection={selectedSection} onSectionSelect={handleSectionSelect} />
          <div className={styles.content}>
          {selectedSection === 'Stake' && <StakeSection stakeContractInstance={stakeContractInstance} mintContractInstance={mintContractInstance} tokenIds={tokenIds}/>}

            {selectedSection === 'Collect'  && <CollectSection stakeContractInstance={stakeContractInstance} mintContractInstance={mintContractInstance} tokenIds={tokenIds}/>}

            {selectedSection === 'UnStake'  && <UnstakeSection stakeContractInstance={stakeContractInstance} mintContractInstance={mintContractInstance} tokenIds={tokenIds}/>}
          </div>
        </div>
      </div>
      </div>
  );
};

export default Home;
