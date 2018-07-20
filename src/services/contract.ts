import { Moment } from 'moment';
import Web3 from 'web3';
import TruffleContract from "truffle-contract";
import schedulerJson from '../../build/contracts/Scheduler.json'

export interface Scheduler {
  makeAppointment(
    name: string,
    company: string,
    email: string,
    date: Number,
    opts?: any
  ): Promise<any>
}

export interface Appointment {
  name: string,
  company: string,
  email: string,
  date: Moment  
}

const getInstance = (web3: Web3): Promise<Scheduler> => {
  const contract = TruffleContract(schedulerJson);
  contract.setProvider(web3.currentProvider);
  return contract.deployed();
}

const makeAppointment = (web3: Web3, instance, appointment: Appointment) => {
  const { name, company, email, date } = appointment;
  return web3.eth.getAccounts()
    .then(accounts => {
      return instance.makeAppointment.estimateGas(name, company, email, date.unix())
        .then(gasEstimate => ({
            from: accounts[0],
            gas: gasEstimate + 10000 // Fator de cagaço :P (Safety Factor)
          }));
    }).then(options => {
      return instance.makeAppointment(name, company, email, date.unix(), options);
    });
}

export default { getInstance, makeAppointment };