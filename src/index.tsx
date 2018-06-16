import { h, render } from "preact";
import habitat from "preact-habitat";
import Widget from "./components/Widget";
import './index.css';

if (process.env.NODE_ENV === 'development') {
  require('preact/debug');
  const root = document.getElementById('scheduler-widget');
  render(<Widget />, root, root.lastChild as Element);
} else {

  habitat(Widget).render({
    inline: false,
    clean: true,
    clientSpecified: true
  });

}