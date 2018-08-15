import { h, render } from "preact";
import 'react-datepicker/dist/react-datepicker.css'
import './index.css';
import getWeb3 from './util/get_web3';
import Widget from "./components/Widget";

getWeb3().then(web3 => {
  const container = document.getElementById('container');

  const props = {
    apiKey: process.env.API_KEY,
    calendarId: process.env.CALENDAR_ID,
    minHour: JSON.parse(process.env.MIN_HOUR),
    maxHour: JSON.parse(process.env.MAX_HOUR),
    confirmationText: 'Confirm',
    network: {
      id: parseInt(process.env.NETWORK_ID, 10),
      name: process.env.NETWORK_NAME
    },
    web3
  }

  if (process.env.NODE_ENV === 'development') {
    require('preact/debug');
    render(<Widget {...props}/>, container, container.lastChild as Element);
  } else {
    render(<Widget {...props}/>, container);
  }

}).catch(error => console.log(error.message));
