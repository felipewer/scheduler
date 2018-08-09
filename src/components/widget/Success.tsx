import { h } from "preact";
import moment from 'moment';

const firstName = (fullName: string) => fullName.split(' ')[0];

const formatDate = (date) => (
  moment.unix(date).format('dddd, MMMM Do YYYY, h:mm a')
)

export default ({ name, date, tx }) => (
  <div>
    <p>
      Thanks <strong>{ firstName(name) }</strong>. Your appointment 
      for <strong>{ formatDate(date) }</strong> is on the blockchain.
    </p>
      
    <p>Check it out on&nbsp;
      <a href={ `https://ropsten.etherscan.io/tx/${ tx }` } target="_blank">
      etherscan</a>.
    </p>
      
    <p>
      You should receive an email notification in a few moments with 
      an invite to the Google Calendar event and a link to a unique&nbsp;
      <a href="https://appear.in/" target="_blank">appear.in</a> conference 
      room.
    </p>
  </div>
);