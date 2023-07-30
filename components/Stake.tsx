import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import nft from '../images/nftPrev.png'
import Image from 'next/image' 
import styles from '../styles/Stake.module.css'; 
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
    
 useEffect(()=>{
        console.log('comeon',mintContractInstance)
    })

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
                <Image src={nft} alt={`token ${tokenId}`} height={100} width={50} />
                <span>{tokenId}</span>
            </div>
        );
    };

    const approveAll = useCallback(async () => {
        if (mintContractInstance) {
          const tx = await mintContractInstance.setApprovalForAll(stakeContractAddress, true);
          await tx.wait(); 
          alert('Approval set for all NFTs');
        }
      }, [mintContractInstance, stakeContractAddress]);
      

    useEffect(() => {
        const checkApproval = async () => {
          if (mintContractInstance) {
            const approvalStatus = await mintContractInstance.isApprovedForAll(connectedAddress, stakeContractAddress);
            setIsApproved(approvalStatus);
          }
        };
      
        checkApproval();
      }, [mintContractInstance, connectedAddress]);

      const stakeTokens = async (selectedTokenIds: number[]) => {
        try {
          if (!Array.isArray(selectedTokenIds) || selectedTokenIds.length === 0) {
            alert('Please select the NFTs you want to stake');
            return;
          }
          if (!stakeContractInstance) {
            console.error('Stake contract instance is null');
            return;
          }
          const transaction = await stakeContractInstance.deposit(selectedTokenIds);
          await transaction.wait();
          console.log('Stake successful for tokens: ', selectedTokenIds);
          onUpdateTokenIds(selectedTokenIds);
       
          
        } catch (error) {
          console.error('Error staking tokens: ', error);
         
        }
      };

      
      
      



    return (
        <div className={styles.boxx}>
        <button className={styles.button} id={styles.selectBtn} onClick={handleSelectDeselectAll}>
            {selectedTokenIds.length === tokenIds.length ? 'Deselect All' : 'Select All'}
        </button>
        <div className={styles.scrollBox} style={{ overflowY: 'scroll', maxHeight: '50%', width:'100%' }}>
            {tokenIds.map(tokenId => renderToken(tokenId))}
        </div>
        {!isApproved && (
        <button className={styles.button} onClick={approveAll}>
          Approve All
        </button>
      )}
      
        <button id={styles.stakeButton} className={styles.button} onClick={() => stakeTokens(selectedTokenIds)}>
            Stake Selected
        </button>
     
    </div>

    );
};

export default Stake;
