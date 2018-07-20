import Web3 from 'web3';

const getWeb3 = () => new Promise<Web3>((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    const web3 = (window as any).web3;
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      resolve(new Web3(web3.currentProvider));
    } else {
      reject(new Error('No Web3 support!'));
    }
  })
})

export default getWeb3