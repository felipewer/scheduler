import { h, Component } from "preact";
import { Moment } from 'moment';
import Web3 from 'web3';
import calendar from '../services/calendar';
import { Appointment } from '../services/contract';
import scheduler from '../services/contract';
import AppointmentForm from './widget/AppointmentForm';
import Success from './widget/Success';

enum Status {
  LOADING,
  READY,
  SUCCESS,
  ERROR,
  FATAL
}

interface State {
  events: Map<string, Moment[]>,
  status: Status,
  results: any
}

interface PropTypes {
  apiKey: string,
  calendarId: string,
  minHour: string,
  maxHour: string,
  confirmationText: string,
  web3: Web3
}

class Widget extends Component<PropTypes> {

  state = {
    events: new Map<string, Moment[]>(),
    status: Status.LOADING,
    results: {}
  };

  componentWillMount() {
    const { calendarId, apiKey } = this.props;
    calendar.loadEvents(calendarId, apiKey).then(events => {
      this.setState({ events, status: Status.READY });
    })
  }

  handleConfirmation = (appointment: Appointment) => {
    return scheduler(this.props.web3).makeAppointment(appointment)
      .then(res => {
        console.log(res);
        const { name, date } = res.logs[0].args;
        const { tx } = res;
        this.setState({ 
          status: Status.SUCCESS,
          results: { name, date, tx } 
        });
      })
      .catch(error => console.error(error));
  }

  render(props: PropTypes, { events, status, results }: State) {
    const { minHour, maxHour, confirmationText } = props;
    return(
      <div>
        { status === Status.LOADING && 
          <p>Loading calendar data...</p>
        }{ status === Status.READY &&
          <AppointmentForm
            events={events}
            minHour={minHour}
            maxHour={maxHour}
            confirmationText={confirmationText}
            onConfirm={this.handleConfirmation}
          />
        }{ status === Status.SUCCESS && <Success { ...results }/>}
      </div>
    );
  }
}


export default Widget;