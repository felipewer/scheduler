import Web3 from 'web3';

export interface Network {
  id: number,
  name: string
}

const checkConnection = (web3: Web3, network: Network) => {
  const msg = `Connection error! Please make sure 
    you are connected to the ${network.name} network.`;
  return web3.eth.net.getId()
    .then(id => {
      if (id !== network.id) {
        throw Error(msg);
      }
    })
    .then(() => web3.eth.net.isListening())
    .catch(() => {
      throw Error(msg);
    });
}

export default { checkConnection };