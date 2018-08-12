import { h, Component } from "preact";
import { Moment } from 'moment';
import moment from 'moment';
import Web3 from 'web3';
import calendar from '../services/calendar';
import { Appointment } from '../services/contract';
import scheduler from '../services/contract';
import { Network } from '../services/network';
import net from '../services/network';
import AppointmentForm from './widget/AppointmentForm';
import Success from './widget/Success';

enum Status {
  LOADING = 'loading',
  READY = 'ready',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

interface Receipt {
  name: string,
  dateTime: Moment,
  transactionHash: string
}

interface State {
  events: Map<string, Moment[]>,
  status: Status,
  receipt: Receipt,
  feedback: string
}

interface PropTypes {
  apiKey: string,
  calendarId: string,
  minHour: string,
  maxHour: string,
  confirmationText: string,
  network: Network,
  web3: Web3
}

class Widget extends Component<PropTypes> {

  state = {
    events: new Map<string, Moment[]>(),
    status: Status.LOADING,
    receipt: {},
    feedback: 'Checking Ethereum connectivity ...'
  };

  componentWillMount() {
    const { calendarId, apiKey, network, web3 } = this.props;
    net.checkConnection(web3, network)
      .then(() => this.setState({ feedback: 'Loading calendar data ...' }))
      .then(() => calendar.loadEvents(calendarId, apiKey))
      .then(events => {
        this.setState({ events, status: Status.READY });
      }).catch(error => {
        this.setState({
          status: Status.ERROR,
          feedback: error.message
        });
      })
  }

  onTransaction = (hash) => {
    const feedback = `Transaction sent. Mining underway ...`;
    this.setState({ feedback });
  }

  onReceipt = (receipt) => {
    const { name, date } = receipt.events['NewAppointment'].returnValues;
    const { transactionHash } = receipt;
    this.setState({ 
      status: Status.SUCCESS,
      receipt: { name, dateTime: moment.unix(date), transactionHash } 
    });
  }

  onError = (error) => {
    if (error.message && error.message.match(/User denied/)) {
      this.setState({ status: Status.READY, feedback: '' });
    } else {
      const feedback = `Dang it! Something went wrong :/ 
        You may check the console for more information.`;
      this.setState({ feedback });
      console.error(error)
    }
  }

  handleSubmission = (appointment: Appointment) => {
    this.setState({
      status: Status.WARNING,
      feedback: 'Please confirm transaction!'
    });
    const { web3, network: { id } } = this.props;
    return scheduler(web3, id)
      .makeAppointment(appointment, this.onTransaction)
        .then(this.onReceipt)
        .catch(this.onError);
  }

  render(props: PropTypes, { events, status, receipt, feedback }: State) {
    const { minHour, maxHour, confirmationText } = props;
    const { LOADING, READY, SUCCESS, WARNING, ERROR } = Status;
    return(
      <div>
        { (status === READY || status === WARNING) &&
          <AppointmentForm
            events={events}
            minHour={minHour}
            maxHour={maxHour}
            confirmationText={confirmationText}
            onSubmit={this.handleSubmission}
            />
        }
        { status === SUCCESS &&
          <Success { ...receipt }/>
        }
        { status !== READY && status !== SUCCESS && 
          <p class={`feedback ${status}`}>{ feedback }</p>
        }
      </div>
    );
  }
}


export default Widget;