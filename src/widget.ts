import { readFileSync } from 'fs';
import habitat from "preact-habitat";
import Widget from "./components/Widget";
import getWeb3 from './util/getWeb3';
import scheduler from './services/contract';

const injectWidgetStyles = () => {
  const datePickerCss = readFileSync(__dirname + '/../node_modules/react-datepicker/dist/react-datepicker.css', 'utf8');
  const indexCss = readFileSync(__dirname + '/index.css', 'utf8');
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(datePickerCss.concat(indexCss)));
  document.head.appendChild(style)
}

getWeb3()
  .then(web3 => {
    return scheduler.getInstance(web3)
      .then(contract => ({ contract, web3 }));
  })
  .then(({ contract, web3 }) => {
    injectWidgetStyles()
    habitat(Widget).render({
      inline: false,
      clean: true,
      clientSpecified: true,
      defaultProps: {
        apiKey: '',
        calendarId: '',
        contract,
        web3
      }
    });
  }).catch(error => console.log(error.message));
