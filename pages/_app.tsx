import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  bsc,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    bsc
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://bsc-dataseed2.binance.org`, // replace with actual BSC Mainnet URL
     
      }),
      
    }),
  ]
);


const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId: '0bcae8881717fef9cec0c0341cb44143',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
