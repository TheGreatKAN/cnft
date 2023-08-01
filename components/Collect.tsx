import React, { useCallback, useEffect, useState } from 'react';
import { ethers, formatEther } from 'ethers';
import nft from '../images/nftPrev.png'
import rewardsLogo from '../images/rewardsLogo.png'
import Image from 'next/image' 
import styles from '../styles/Collect.module.css'; 
import { useContractRead, useContractWrite } from 'wagmi';
import stakeContractABI from '../components/ABI/stakeContractABI.json'
import mintContractABI from '../components/ABI/mintContractABI.json'
import { parseGwei } from 'viem';

interface SectionProps {
    stakeContractInstance: ethers.Contract | null;
    mintContractInstance: ethers.Contract | null;
    tokenIds: number[];
    connectedAddress: string
  }
const Collect: React.FC<SectionProps> = ({ stakeContractInstance, mintContractInstance, tokenIds, connectedAddress }) => {
    const [numberOfStakedNFTs, setNumberOfStakedNFTs] = useState<number>(0);
    const[stakedNFT_Ids, setStakedNFT_Ids] = useState<number[]>([]);
    const[accumulatedRewards, setAccumulatedRewards] = useState<string>('00.0000');
    const mintContractAddress = '0x5CD5a6dCf173a4e44CC62dB621C957c4B133E270';
    const stakeContractAddress = '0xe0833Fba47fAEF2Ea12FEB674B8a2ca98658d1FD';

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

      const { data: data2, isError: isError2, isLoading: isLoading2 } = useContractRead({
        address: stakeContractAddress,
        abi: stakeContractABI,
        functionName: 'calculateRewards',
        args:[connectedAddress, stakedNFT_Ids],
        enabled: connectedAddress !== null && connectedAddress !== undefined,
       
      })

      useEffect(() => {
        const calculateRewards = () => {
            if (data2 && Array.isArray(data2)) {
              let sum = BigInt(0);
              for (let i = 0; i < data2.length; i++) {
                sum += data2[i];
              }
      
              const sumInEther = formatEther(sum);
              const sumAsNumber = parseFloat(sumInEther).toFixed(4); // Keeps up to 4 decimals
              console.log('Total Rewards: ', sumAsNumber);
              console.log('data2',data2)
              setAccumulatedRewards(sumAsNumber)
            }
        };
        calculateRewards();
        const intervalId = setInterval(calculateRewards, 60 * 1000);
        return () => clearInterval(intervalId);
    }, [data2]);
    

        const {data: data3, isLoading: isLoading3, isSuccess: isSuccess3, write: write2} = useContractWrite({
            address: stakeContractAddress,
            abi: stakeContractABI,
            functionName: 'claimRewards',
            args:[stakedNFT_Ids],
            gasPrice: BigInt(Math.ceil(5 * 1e9 * stakedNFT_Ids.length)),
            
        })
useEffect(()=>{
    if(isSuccess3 === true){
        setAccumulatedRewards('0.0000')
    }
},[data3,isSuccess3])
   

    
    
      

  return (
    <div className={styles.boxxx}>
         <h5>Each NFT recieves 1 KIWI per day! </h5>
      <Image src={nft} alt='nft' width={110} height={200} />
      <h5>Number of CNFTs Staked: {stakedNFT_Ids.length} </h5>
      <Image src={rewardsLogo} alt='rewardsLogo' width={150} height={50} />
      <div className={styles.textBox}>
  {accumulatedRewards}
</div>
<button id={styles.claimBtn} className={styles.button} disabled={!write2} onClick={() => write2()}>Claim Rewards</button>
     

    </div>
  );
};

export default Collect;
