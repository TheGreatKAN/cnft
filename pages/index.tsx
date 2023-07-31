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
import Footer from '../components/Footer'
import CollectSection from '../components/Collect';
import UnstakeSection from '../components/Unstake';
import nft from '../images/nftPrev.png'
import { useContractRead, useContractInfiniteReads, paginatedIndexesConfig  } from 'wagmi'


import Image from 'next/image' 

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
const[NFTsOwned, SetNFTsOwned] = useState<number | null>(null)
  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  
  


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
    } else {
      setConnectedAddress(undefined);
    }
  }, [address])

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

  const { data, isError, isLoading } = useContractRead({
    address: mintContractAddress,
    abi: mintContractABI,
    functionName: 'balanceOf',
    args:[connectedAddress],
    enabled: connectedAddress !== null && connectedAddress !== undefined,
    onSuccess: (data) => {
      SetNFTsOwned(Number(data)); 
    }
  })
  useEffect(()=>{
    console.log('nftsss', NFTsOwned);
  },[NFTsOwned])

  const { data: tokenIdData, isError: tokenIdIsError, isLoading: tokenIdIsLoading } = useContractRead({
    address: mintContractAddress,
    abi: mintContractABI,
    functionName: 'tokenOfOwnerByIndex',
    args:[connectedAddress, currentIndex],
    enabled: connectedAddress !== null && connectedAddress !== undefined && NFTsOwned !== null && currentIndex < NFTsOwned,
  });
  
  useEffect(() => {
    if (tokenIdData !== undefined && NFTsOwned !== null && currentIndex < NFTsOwned) {
      setTokenIds(prevTokenIds => [...prevTokenIds, Number(tokenIdData)]);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  }, [tokenIdData, NFTsOwned]);




useEffect(()=>{
  console.log('Token IDs', tokenIds);
},[tokenIds]);

  const updateTokenIds = (stakedTokenIds: number[]) => {
   
    setTokenIds((prevTokenIds) => prevTokenIds.filter((tokenId) => !stakedTokenIds.includes(tokenId)));
  };


  return(
    
    <div className={styles.page}>
      <Header  />
    
      <div className={styles.container}>
      <div className={styles.box}>
        <BoxHeader selectedSection={selectedSection} onSectionSelect={handleSectionSelect} />
        <div className={styles.content}>
          
          {connectedAddress ? (
            <>
              {selectedSection === 'Stake' && <StakeSection stakeContractInstance={stakeContractInstance} mintContractInstance={mintContractInstance} tokenIds={tokenIds} connectedAddress={connectedAddress}  onUpdateTokenIds={updateTokenIds} />}
              {selectedSection === 'Collect' && <CollectSection stakeContractInstance={stakeContractInstance} mintContractInstance={mintContractInstance} tokenIds={tokenIds} connectedAddress={connectedAddress} />}
              {selectedSection === 'UnStake' && <UnstakeSection stakeContractInstance={stakeContractInstance} mintContractInstance={mintContractInstance} tokenIds={tokenIds} connectedAddress={connectedAddress} />}
            </>
          ) : (
         
            <div className={styles.notConnected}>
              <Image src={nft} alt="NFTpreview" height={250} width={125} />
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default Home;
