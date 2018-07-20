import { h, render } from "preact";
import 'react-datepicker/dist/react-datepicker.css'
import './index.css';
import getWeb3 from './util/getWeb3';
import Widget from "./components/Widget";

getWeb3().then(web3 => {
  const container = document.getElementById('container');

  const props = {
    apiKey: process.env.API_KEY,
    calendarId: process.env.CALENDAR_ID,
    minTime: process.env.MIN_TIME,
    maxTime: process.env.MAX_TIME,
    web3
  }

  if (process.env.NODE_ENV === 'development') {
    require('preact/debug');
    render(<Widget {...props}/>, container, container.lastChild as Element);
  } else {
    render(<Widget {...props}/>, container);
  }

}).catch(error => console.log(error.message));
