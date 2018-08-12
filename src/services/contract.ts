import { Moment } from 'moment';
import Web3 from 'web3';
import { abi, networks } from '../../build/contracts/Scheduler.json'

export interface Appointment {
  name: string,
  company: string,
  email: string,
  date: Moment  
}

const contract = (web3: Web3, networkId: number) => {

  const { address } = networks[networkId];
  const scheduler = new web3.eth.Contract(abi, address);

  const makeAppointment = (
    { name, company, email, date }: Appointment,
    onTransaction: (hash: string) => void
  ) => (
    web3.eth.getAccounts().then(accounts => (
      scheduler.methods.makeAppointment(name, company, email, date.unix()).estimateGas()
        .then(gasEstimate => ({
          from: accounts[0],
          gas: gasEstimate + 10000 // Fator de cagaço :P (Safety Factor)
        }))
        .then(options => (
          scheduler.methods.makeAppointment(name, company, email, date.unix()).send(options)
            .once('transactionHash', onTransaction)
        ))
    ))
  );
  
  return { makeAppointment };
}

export default contract;