import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { useContractRead } from 'wagmi'
import nft from '../images/nftPrev.png'
import Image from 'next/image' 
import stakeContractABI from '../components/ABI/stakeContractABI.json'
import mintContractABI from '../components/ABI/mintContractABI.json'
import styles from '../styles/Stake.module.css'; 
import { parseGwei } from 'viem';
interface SectionProps {
    stakeContractInstance: ethers.Contract | null;
    mintContractInstance: ethers.Contract | null;
    tokenIds: number[];
    connectedAddress: string
    onUpdateTokenIds: (stakedTokenIds: number[]) => void;
  }
  const Stake: React.FC<SectionProps> = ({ stakeContractInstance, mintContractInstance, tokenIds, connectedAddress, onUpdateTokenIds, }) => {
    const [selectedTokenIds, setSelectedTokenIds] = useState<number[]>([]);
    const [isApproved, setIsApproved] = useState<boolean>(false); 
    const mintContractAddress = '0x5CD5a6dCf173a4e44CC62dB621C957c4B133E270';
    const stakeContractAddress = '0xe0833Fba47fAEF2Ea12FEB674B8a2ca98658d1FD';
    


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
        if (selectedTokenIds.length === tokenIds.length) {
            setSelectedTokenIds([]);
        } else {
            setSelectedTokenIds(tokenIds);
        }
    };

    useEffect(()=>{
        console.log('okokok',selectedTokenIds)
    },[selectedTokenIds])

    const renderToken = (tokenId: number) => {
        const isSelected = selectedTokenIds.includes(tokenId);
        const tokenClass = isSelected ? `${styles.token} ${styles.selected}` : styles.token;
    
        return (
            <div key={tokenId} className={tokenClass} onClick={() => handleTokenClick(tokenId)}>
                   <div className={styles.imageBox}>
            <Image src={nft} alt={`token ${tokenId}`} fill={true}  />
            </div>
                <span>{tokenId}</span>
            </div>
        );
    };

    

    
    const { data, isError, isLoading } = useContractRead({
        address: '0x5CD5a6dCf173a4e44CC62dB621C957c4B133E270',
        abi: mintContractABI,
        functionName: 'isApprovedForAll',
        args:[connectedAddress, stakeContractAddress],
        enabled: connectedAddress !== null && connectedAddress !== undefined,
        onSuccess(data: Boolean) {
          console.log('SuccessWagmi', data)
          if(data === true){
            setIsApproved(true)
          }
          
        },
      })
      
      const { data: data2, isLoading: isLoading2, isSuccess, write } = useContractWrite({
        address: '0x5CD5a6dCf173a4e44CC62dB621C957c4B133E270',
        abi: mintContractABI,
        functionName: 'setApprovalForAll',
        gas: 600001n,
        
        onSuccess(data2){
            setIsApproved(true)
        }
      })


      const {data: data3, isLoading: isLoading3, isSuccess: isSuccess3, write: write2} = useContractWrite({
address: stakeContractAddress,
abi: stakeContractABI,
functionName: 'deposit',
args:[selectedTokenIds],
gas: BigInt(300000  * selectedTokenIds.length),

      })
      useEffect(() => {
        if(isSuccess3 === true){
            onUpdateTokenIds(selectedTokenIds);
        }
      }, [isSuccess3]);

    return (
       <div className={styles.boxx}>
    {isApproved ? 
        <>
            <button className={styles.button} id={styles.selectBtn} onClick={handleSelectDeselectAll}>
                {selectedTokenIds.length === tokenIds.length ? 'Deselect All' : 'Select All'}
            </button>
            <div className={styles.scrollBox} style={{ overflowY: 'scroll', maxHeight: '50%', width:'100%' }}>
                {tokenIds.map(tokenId => renderToken(tokenId))}
            </div>
            <button id={styles.stakeButton} className={styles.button} disabled={!write} onClick={() => write2()}>
                Stake Selected
            </button>
        </> 
        :
        <button className={styles.button}   disabled={!write}
        onClick={() =>
          write({
            args: [stakeContractAddress, true],
          })
        }
      >
            Approve All
        </button>
    }
    </div>

    );
};

export default Stake;
