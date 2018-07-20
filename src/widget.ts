import { readFileSync } from 'fs';
import habitat from "preact-habitat";
import getWeb3 from './util/getWeb3';
import Widget from "./components/Widget";

const injectWidgetStyles = () => {
  const datePickerCss = readFileSync(__dirname + '/../node_modules/react-datepicker/dist/react-datepicker.css', 'utf8');
  const indexCss = readFileSync(__dirname + '/index.css', 'utf8');
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(datePickerCss.concat(indexCss)));
  document.head.appendChild(style)
}

getWeb3().then(web3 => {
  injectWidgetStyles()
  habitat(Widget).render({
    inline: false,
    clean: true,
    clientSpecified: true,
    defaultProps: {
      apiKey: '',
      calendarId: '',
      minTime: 7,
      maxTime: 18,
      web3
    }
  });
}).catch(error => console.log(error.message));
