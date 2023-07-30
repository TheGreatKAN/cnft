import React from 'react';
import { ethers } from 'ethers';

interface SectionProps {
    stakeContractInstance: ethers.Contract | null;
    mintContractInstance: ethers.Contract | null;
    tokenIds: number[];
  }
const Collect: React.FC<SectionProps> = ({ stakeContractInstance, mintContractInstance, tokenIds }) => {
    

  return (
    <div>
      {/* Your "COLLECT" section content goes here */}
      COLLECT SECTION
    </div>
  );
};

export default Collect;