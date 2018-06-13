import { h, Component } from "preact";
import AppointmentForm from "./widget/AppointmentForm";

class Widget extends Component {

  render() {
    return (
      <article>
        <h1>Interested in hiring me?</h1>
        <p>Looks like you've got Ethereum support in your browser. 
          Thats Great!</p>
        <p>
          You can jump ahead and schedule time for an interview.&nbsp;
          <em>(It will cost a little gas!)</em>
        </p>
        <AppointmentForm />
      </article>
    );
  
  }
}

export default Widget;