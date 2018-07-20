import { h, render } from "preact";
import 'react-datepicker/dist/react-datepicker.css'
import './index.css';
import Widget from "./components/Widget";
import getWeb3 from './util/getWeb3';
import scheduler from './services/contract';

getWeb3()
  .then(web3 => {
    return scheduler.getInstance(web3)
      .then(contract => ({ contract, web3 }));
  })
  .then(({ contract, web3 }) => {

    const container = document.getElementById('container');

    const props = {
      apiKey: process.env.API_KEY,
      calendarId: process.env.CALENDAR_ID,
      contract,
      web3
    }

    if (process.env.NODE_ENV === 'development') {
      require('preact/debug');
      render(<Widget {...props}/>, container, container.lastChild as Element);
    } else {
      render(<Widget {...props}/>, container);
    }

  }).catch(error => console.log(error.message));

