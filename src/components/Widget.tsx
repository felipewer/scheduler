import { h, Component } from "preact";
import { Moment } from 'moment';
import moment from 'moment-timezone';
import { FormikProps, withFormik} from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import Web3 from 'web3';
import { loadEvents } from '../services/calendar';
import { Appointment, Scheduler} from '../services/contract';
import scheduler from '../services/contract';

interface State {
  events: Map<string, Moment[]>,
  loading: boolean
}

interface PropTypes {
  apiKey: string,
  calendarId: string,
  minHour: string,
  maxHour: string,
  web3: Web3
}

class Widget extends Component<FormikProps<Appointment> & PropTypes> {

  state = {
    events: new Map<string, Moment[]>(),
    loading: false,
  };

  componentWillMount() {
    this.setState({ loading: true });
    const { calendarId, apiKey } = this.props;
    loadEvents(calendarId, apiKey).then(events => {
      this.setState({ events, loading: false });
    })
  }

  handleDateChange = (dateTime: Moment) => {
    this.props.setFieldValue('date', dateTime)
  }

  render(props: FormikProps<Appointment> & PropTypes, state: State) {

    const {
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      errors,
      touched,
      values,
      minHour,
      maxHour
    } = props;

    return(
      //#region form
      <form onSubmit={handleSubmit}>
        <label for="name">Name</label>
        <input
          id="name"
          placeholder="Enter your name"
          type="text"
          value={values.name}
          onInput={handleChange}
          onBlur={handleBlur}
        />
        {errors.name && touched.name && (
          <div class="input-feedback">{errors.name}</div>
        )}
        <label for="company">Company</label>
        <input
          id="company"
          placeholder="Company"
          type="text"
          value={values.company}
          onInput={handleChange}
          onBlur={handleBlur}
        />
        {errors.company && touched.company && (
          <div class="input-feedback">{errors.company}</div>
        )}
        <label for="email">Email</label>
        <input
          id="email"
          placeholder="Email"
          type="email"
          value={values.email}
          onInput={handleChange}
          onBlur={handleBlur}
          />
        {errors.email && touched.email && (
          <div class="input-feedback">{errors.email}</div>
        )}
        <label for="appointment-date">
          Date / Time  (GMT{ moment().format('Z') })
        </label>
        <DatePicker
          id="appointment-date"
          selected={values.date}
          onChange={this.handleDateChange}
          excludeTimes={state.events.get(values.date.format('YYYY-MM-DD'))}
          minTime={moment(`${moment().format('YYYY-MM-DD')}T${minHour}`)}
          maxTime={moment(`${moment().format('YYYY-MM-DD')}T${maxHour}`)}
          minDate={moment()}
          maxDate={moment().add(2, "months")}
          showDisabledMonthNavigation
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="lll"
          timeCaption="time"
          autocomplete="off"
        />
        {errors.date && touched.date && (
          <div class="input-feedback">{errors.date}</div>
        )}
        <div className="confirm-container">
          <button class="btn confirm"
            type="submit"
            disabled={isSubmitting}>
            Confirm
          </button>
        </div>
      </form>
      //#endregion
    );
  }
}

const startingDate = (minHour: string, maxHour: string) => {
  const date = moment().minutes(0).add(4, 'h');
  const lowerBound = moment(`${moment().format('YYYY-MM-DD')}T${minHour}`);
  const upperBound = moment(`${moment().format('YYYY-MM-DD')}T${maxHour}`);
  if (date.isBetween(lowerBound, upperBound, null, '[]')) {
    return date;
  } else {
    return lowerBound.add(1, 'd');
  }
}

const options = {
  validationSchema: Yup.object().shape({
    name: Yup.string().required('Name is required!'),
    company: Yup.string().required('Company is required!'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    date: Yup.date()
      .typeError('Must be a valid date')
      .min(moment(), 'Date must be in the future')
      .required('Date is required!')
  }),
  mapPropsToValues: props => ({
    name: '',
    company: '',
    email: '',
    date: startingDate(props.minHour, props.maxHour)
  }),
  handleSubmit: (values: Appointment, { props, setSubmitting }) => {
    scheduler.getInstance(props.web3)
      .then(inst => scheduler.makeAppointment(props.web3, inst, values))
      .then(res => console.log(res.logs))
      .catch(error => console.error(error))
      .then(() => setSubmitting(false));
  }
}

export default withFormik(options)(Widget);