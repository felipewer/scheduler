import { Moment } from 'moment';
import Web3 from 'web3';
import TruffleContract from "truffle-contract";
import schedulerJson from '../../build/contracts/Scheduler.json'

export interface Appointment {
  name: string,
  company: string,
  email: string,
  date: Moment  
}

const contract = (web3: Web3) => {

  const schedulerContract = TruffleContract(schedulerJson);
  schedulerContract.setProvider(web3.currentProvider);

  const makeAppointment = ({ name, company, email, date }: Appointment) => (
    web3.eth.getAccounts().then(accounts => (
      schedulerContract.deployed().then(scheduler => (
        scheduler.makeAppointment.estimateGas(name, company, email, date.unix())
          .then(gasEstimate => ({
            from: accounts[0],
            gas: gasEstimate + 10000 // Fator de cagaço :P (Safety Factor)
          }))
          .then(options => (
            scheduler.makeAppointment(name, company, email, date.unix(), options)
          ))
      ))
    ))
  );
  
  return { makeAppointment };
}


export default contract;