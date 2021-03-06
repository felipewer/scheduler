import { readFileSync } from 'fs';
import habitat from "preact-habitat";
import getWeb3 from './util/get_web3';
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
      minHour: { "hour": 9, "timezone": "GMT" },
      maxHour: { "hour": 17, "timezone": "GMT" },
      confirmationText: 'Confirm',
      network: {
        id: 100,
        name: 'Custom'
      },
      web3
    }
  });
})
.then(() => {
  window.dispatchEvent(new Event('SCHEDULER_WIDGET_LOADED'));
})
.catch(error => console.log(error.message));
