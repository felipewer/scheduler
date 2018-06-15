import { h, Component } from "preact";
import { Moment } from 'moment';
import moment from 'moment';
import { FormikProps, withFormik} from 'formik';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';

import { loadEvents } from '../../services/calendar';
import './style.css';

interface FormValues {
  name: string,
  company: string,
  email: string,
  date: Moment
}

interface State {
  events: Map<string, Moment[]>,
  loading: boolean
}

class AppointmentForm extends Component<FormikProps<FormValues>> {

  constructor(props: FormikProps<FormValues>) {
    super(props);
    this.state = {
      events: new Map<string, Moment[]>(),
      loading: false
    };
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentWillMount() {
    this.setState({ loading: true });
    loadEvents().then(events => {
      this.setState({ events, loading: false });
    });
  }

  handleDateChange(dateTime: Moment) {
    this.props.setFieldValue('date', dateTime)
  }

  render(props: FormikProps<FormValues>, state: State) {
    
    const {
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      errors,
      touched,
      values
    } = props;

    return(
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
          placeholder="Enter your company"
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
          placeholder="Enter your email"
          type="email"
          value={values.email}
          onInput={handleChange}
          onBlur={handleBlur}
          />
        {errors.email && touched.email && (
          <div class="input-feedback">{errors.email}</div>
        )}
        <label for="appointment-date">Date / Time</label>
        <DatePicker
          id="appointment-date"
          selected={values.date}
          onChange={this.handleDateChange}
          excludeTimes={state.events.get(values.date.format('YYYY-MM-DD'))}
          minTime={moment().hours(7).minutes(0)}
          maxTime={moment().hours(21).minutes(30)}
          minDate={moment()}
          maxDate={moment().add(2, "months")}
          showDisabledMonthNavigation
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat="LLL"
          timeCaption="time"
          autocomplete="off"
        />
        {errors.date && touched.date && (
          <div class="input-feedback">{errors.date}</div>
        )}
        <button class="btn"
          type="submit"
          disabled={isSubmitting}>
          Confirm
        </button>
      </form>
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
    date: moment()
  }),
  handleSubmit: (values: FormValues, { setSubmitting }) => {
    const payload = {...values};
    setTimeout(() => {
      console.log(JSON.stringify(payload, null, 2));
      setSubmitting(false);
    }, 3000);
  }
}

export default withFormik(options)(AppointmentForm);