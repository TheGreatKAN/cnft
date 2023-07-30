import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/UnStake.module.css'; 
import nft from '../images/nftPrev.png'
import Image from 'next/image' 

interface SectionProps {
    stakeContractInstance: ethers.Contract | null;
    mintContractInstance: ethers.Contract | null;
    tokenIds: number[];
    connectedAddress: string
  }

const Unstake: React.FC<SectionProps> = ({ stakeContractInstance, mintContractInstance, tokenIds, connectedAddress }) => {
    
    const[stakedNFT_Ids, setStakedNFT_Ids] = useState<number[]>([]);
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

    useEffect(() => {
        async function getDeposits() {
          try {
            if (stakeContractInstance) {
              const deposits = await stakeContractInstance.depositsOf(connectedAddress);
              const depositNumbers = deposits.map((deposit: BigInt) => Number(deposit));

              console.log('staked#s', depositNumbers);
              setStakedNFT_Ids(depositNumbers);
            }
          } catch (error) {
            console.log('An error occurred:', error);
          }
        }
        getDeposits();
      }, [connectedAddress, stakeContractInstance]);
      

      const unstakeTokens = async (selectedTokenIds: number[]) => {
        try {
            if (!Array.isArray(selectedTokenIds) || selectedTokenIds.length === 0) {
                alert('Please select the NFTs you want to unstake');
                return;
            }
            if (!stakeContractInstance) {
                console.error('Stake contract instance not available');
                return;
            }
            const transaction = await stakeContractInstance.withdraw(selectedTokenIds, {
                gasLimit: ethers.toBeHex(600000),
            });
            await transaction.wait();
            console.log('Unstake successful for tokens: ', selectedTokenIds);
            setStakedNFT_Ids(prevNFTIds => prevNFTIds.filter(id => !selectedTokenIds.includes(id)));
        } catch (error) {
            console.error('Error unstaking tokens: ', error);
        }
    };
    

    
  return (
    <div className={styles.boxx}>
    <button className={styles.button} id={styles.selectBtn} onClick={handleSelectDeselectAll}>
    {selectedTokenIds.length === stakedNFT_Ids.length ? 'Deselect All' : 'Select All'}
</button>

    <div className={styles.scrollBox} style={{ overflowY: 'scroll', maxHeight: '50%', width:'100%' }}>
        {stakedNFT_Ids.map(tokenId => renderToken(tokenId))}
    </div>
    <button id={styles.stakeButton} className={styles.button} onClick={() => unstakeTokens(selectedTokenIds)}>
            UnStake Selected
        </button>

    </div>
  );
};

export default Unstake;