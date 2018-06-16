import { h, render } from "preact";
import Widget from "./components/Widget";
import 'react-datepicker/dist/react-datepicker.css'
import './index.css';

const container = document.getElementById('container');

if (process.env.NODE_ENV === 'development') {
  require('preact/debug');
  render(<Widget />, container, container.lastChild as Element);
} else {
  render(<Widget />, container);
}