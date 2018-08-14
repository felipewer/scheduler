import { h, Component } from "preact";
import { Moment } from 'moment';
import moment from 'moment';
import { FormikProps, withFormik} from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import Web3 from 'web3';
import { Appointment } from '../../services/contract';
import { isWeekday, nextAvailableTime, lowerBound } from '../../services/date';
import { EventMap } from '../../services/calendar';

interface PropTypes {
  events: EventMap,
  minHour: string,
  maxHour: string,
  confirmationText: string,
  web3: Web3
}

class AppointmentForm extends Component<FormikProps<Appointment> & PropTypes> {

  state = {
    nextAvailableTime: null
  }

  componentWillMount() {
    const { events, minHour, maxHour } = this.props;
    this.setState({
      nextAvailableTime: nextAvailableTime(events, minHour, maxHour)
    })
  }

  handleDateChange = (dateTime: Moment) => {
    this.props.setFieldValue('date', dateTime)
  }

  timesToExclude = () => {
    const { events, minHour, values } = this.props;
    const minTime = lowerBound(values.date, minHour);
    const dateEvents = new Set(events.get(values.date.format('YYYY-MM-DD')));
    while (minTime.isBefore(this.state.nextAvailableTime)){
      dateEvents.add(minTime.format());
      minTime.add(1, 'hour');
    }
    return Array.from(dateEvents.values(), value => moment(value));
  }

  render(props: FormikProps<Appointment> & PropTypes) {

    const {
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      errors,
      touched,
      values,
      events,
      minHour,
      maxHour,
      confirmationText
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
          filterDate={isWeekday}
          excludeTimes={this.timesToExclude()}
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
          timeIntervals={60}
        />
        {errors.date && touched.date && (
          <div class="input-feedback">{errors.date}</div>
        )}
        <div class="confirm-container">
          <button class={ `btn confirm ${ isSubmitting && 'spinner' }` }
            type="submit"
            disabled={isSubmitting}>
            { !isSubmitting && confirmationText }
          </button>
        </div>
      </form>
      //#endregion
    );
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
    date: nextAvailableTime(props.events, props.minHour, props.maxHour)
  }),
  
  handleSubmit: (values: Appointment, { props, setSubmitting }) => {
    props.onSubmit(values).then(() => setSubmitting(false));
  }
}

export default withFormik(options)(AppointmentForm);