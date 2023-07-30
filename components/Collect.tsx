import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import nft from '../images/nftPrev.png'
import rewardsLogo from '../images/rewardsLogo.png'
import Image from 'next/image' 
import styles from '../styles/Collect.module.css'; 

interface SectionProps {
    stakeContractInstance: ethers.Contract | null;
    mintContractInstance: ethers.Contract | null;
    tokenIds: number[];
    connectedAddress: string
  }
const Collect: React.FC<SectionProps> = ({ stakeContractInstance, mintContractInstance, tokenIds, connectedAddress }) => {
    const [numberOfStakedNFTs, setNumberOfStakedNFTs] = useState<number>(0);
    const[stakedNFT_Ids, setStakedNFT_Ids] = useState<number[]>([]);
    const[accumulatedRewards, setAccumulatedRewards] = useState<number>(0);

   
    const getRewards = useCallback(async (depositNumbers: number[]) => {
        try {
          if (!stakeContractInstance) {
            console.error('Stake contract instance is null');
            return;
          }
    
          const rewardsArray = await stakeContractInstance.calculateRewards(
            connectedAddress,
            depositNumbers
          );
    
          if (rewardsArray && rewardsArray.length > 0) {
            let sum = BigInt(0);
            for (let i = 0; i < rewardsArray.length; i++) {
              sum += BigInt(rewardsArray[i]);
            }
            let sumInEther = ethers.formatEther(sum.toString());
            sumInEther = parseFloat(sumInEther).toFixed(4);
            console.log('Total Rewards: ', sumInEther);
            setAccumulatedRewards(Number(sumInEther)); // Convert to a number
          } else {
            setAccumulatedRewards(0); // Set as a number
          }
        } catch (error) {
          console.error('An error occurred: ', error);
        }
      }, [stakeContractInstance, connectedAddress]); // set dependencies

    const getDepositsAndRewards = useCallback(async () => {
        try {
          if (!stakeContractInstance) {
            console.error('Stake contract instance is null');
            return;
          }
      
          const deposits = await stakeContractInstance.depositsOf(connectedAddress);
          const depositNumbers = deposits.map((deposit: BigInt) => Number(deposit));
          console.log('staked#s', depositNumbers);
          setStakedNFT_Ids(depositNumbers);
          setNumberOfStakedNFTs(depositNumbers.length);
          console.log(stakedNFT_Ids)
      
          // Now call getRewards, passing in depositNumbers
          if (depositNumbers.length > 0) {
            getRewards(depositNumbers);
          }
        } catch (error) {
          console.log('An error occurred:', error);
        }
      }, [stakeContractInstance, connectedAddress, stakedNFT_Ids, getRewards]);

    useEffect(() => {
        getDepositsAndRewards();
        const intervalId = setInterval(getDepositsAndRewards, 60 * 1000);
        return () => clearInterval(intervalId);
      }, []);

      async function claimRewards() {
        try {
          if (!stakeContractInstance) {
            console.error('Stake contract instance is null');
            return;
          }
          
          const transaction = await stakeContractInstance.claimRewards(stakedNFT_Ids, {
            gasLimit: ethers.toBeHex(600000),
        });
          console.log('Transaction: ', transaction);
          const receipt = await transaction.wait();
          console.log('Transaction was mined: ', receipt);
          getRewards(stakedNFT_Ids);  
    
        } catch (error) {
          console.error('An error occurred: ', error);
        }
    }
    
      

  return (
    <div className={styles.boxxx}>
         <h5>Each NFT recieves {numberOfStakedNFTs} KIWI per day! </h5>
      <Image src={nft} alt='nft' width={110} height={200} />
      <h5>Number of CNFTs Staked: {numberOfStakedNFTs} </h5>
      <Image src={rewardsLogo} alt='rewardsLogo' width={150} height={50} />
      <div className={styles.textBox}>
  {accumulatedRewards}
</div>
<button id={styles.claimBtn} className={styles.button} onClick={claimRewards}>Claim Rewards</button>
     

    </div>
  );
};

export default Collect;