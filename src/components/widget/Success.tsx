import { h } from "preact";

const firstName = (fullName: string) => fullName.split(' ')[0];

const formatDate = (dateTime) => (
  dateTime.format('dddd, MMMM Do YYYY, h:mm a')
)

export default ({ name, dateTime, transactionHash }) => (
  <div>
    <p>
      Thanks <strong>{ firstName(name) }</strong>. Your appointment 
      for <strong>{ formatDate(dateTime) }</strong> is on the blockchain.
    </p>
      
    <p>Check it out on&nbsp;
      <a target="_blank"
        href={ `https://ropsten.etherscan.io/tx/${ transactionHash }` }>
        etherscan
      </a>.
    </p>
      
    <p>
      You should receive an email notification in a few moments with 
      an invite to the Google Calendar event and a link to a unique&nbsp;
      <a href="https://appear.in/" target="_blank">appear.in</a> conference 
      room.
    </p>
  </div>
);