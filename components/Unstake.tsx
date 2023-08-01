import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/UnStake.module.css'; 
import nft from '../images/nftPrev.png'
import Image from 'next/image' 
import stakeContractABI from '../components/ABI/stakeContractABI.json'
import mintContractABI from '../components/ABI/mintContractABI.json'
import { useContractRead, useContractWrite } from 'wagmi';
import { parseGwei } from 'viem';

interface SectionProps {
    stakeContractInstance: ethers.Contract | null;
    mintContractInstance: ethers.Contract | null;
    tokenIds: number[];
    connectedAddress: string
  }

const Unstake: React.FC<SectionProps> = ({ stakeContractInstance, mintContractInstance, tokenIds, connectedAddress }) => {
    
    const [numberOfStakedNFTs, setNumberOfStakedNFTs] = useState<number>(0);
    const[stakedNFT_Ids, setStakedNFT_Ids] = useState<number[]>([]);
    
    const mintContractAddress = '0x5CD5a6dCf173a4e44CC62dB621C957c4B133E270';
    const stakeContractAddress = '0xe0833Fba47fAEF2Ea12FEB674B8a2ca98658d1FD';
    const [selectedTokenIds, setSelectedTokenIds] = useState<number[]>([]);
    

    const handleTokenClick = (tokenId: number) => {
        setSelectedTokenIds(prevTokenIds => {
          if (prevTokenIds.includes(tokenId)) {
            return prevTokenIds.filter(id => id !== tokenId);
          } else {
            return [...prevTokenIds, tokenId];
          }
        });
    };
      
    const handleSelectDeselectAll = () => {
        if (selectedTokenIds.length === stakedNFT_Ids.length) {
            setSelectedTokenIds([]);
        } else {
            setSelectedTokenIds(stakedNFT_Ids);
        }
    };

    const renderToken = (tokenId: number) => {
        const isSelected = selectedTokenIds.includes(tokenId);
        const tokenClass = isSelected ? `${styles.token} ${styles.selected}` : styles.token;
    
        return (
            <div key={tokenId} className={tokenClass} onClick={() => handleTokenClick(tokenId)}>
            <Image src={nft} alt={`token ${tokenId}`} height={100} width={50} />
            <span>{tokenId}</span>
        </div>
        );
    };

    const { data, isError, isLoading } = useContractRead({
        address: stakeContractAddress,
        abi: stakeContractABI,
        functionName: 'depositsOf',
        args:[connectedAddress],
        enabled: connectedAddress !== null && connectedAddress !== undefined,
       
      })
      useEffect(() => {
        if (data && Array.isArray(data)) {
          const numbers = data.map((bigNumber: BigInt) => Number(bigNumber));
          setStakedNFT_Ids(numbers);
        }
        
      }, [data]);

      const {data: data3, isLoading: isLoading3, isSuccess: isSuccess3, write: write2} = useContractWrite({
        address: stakeContractAddress,
        abi: stakeContractABI,
        functionName: 'withdraw',
        args:[stakedNFT_Ids],
        gasPrice: BigInt(Math.ceil(5 * 1e9 * selectedTokenIds.length)),
        
    })

    useEffect(()=>{
        if(isSuccess3 === true){
        setStakedNFT_Ids(prevNFTIds => prevNFTIds.filter(id => !selectedTokenIds.includes(id)));
    }
    },[data3, isSuccess3])
      

   
    
  return (
    <div className={styles.boxx}>
    <button className={styles.button} id={styles.selectBtn} onClick={handleSelectDeselectAll}>
    {selectedTokenIds.length === stakedNFT_Ids.length ? 'Deselect All' : 'Select All'}
</button>

    <div className={styles.scrollBox} style={{ overflowY: 'scroll', maxHeight: '50%', width:'100%' }}>
        {stakedNFT_Ids.map(tokenId => renderToken(tokenId))}
    </div>
    <button id={styles.stakeButton} className={styles.button}  disabled={!write2} onClick={() => write2()}>
            UnStake Selected
        </button>

    </div>
  );
};

export default Unstake;
