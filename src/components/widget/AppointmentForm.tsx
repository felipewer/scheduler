import { h, Component } from "preact";
import moment from 'moment';
import { Moment } from 'moment';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import { Appointment } from '../../services/contract';
import { isWeekday, nextAvailableTime, lowerBound } from '../../services/date';
import { EventMap } from '../../services/calendar';

interface Props {
  events: EventMap,
  minHour: string,
  maxHour: string,
  confirmationText: string,
  onSubmit: (appointment: Appointment) => Promise<any>
}

interface State {
  nextAvailableTime: Moment
}

class AppointmentForm extends Component<Props, State> {

  state = {
    nextAvailableTime: null
  }

  componentWillMount() {
    const { events, minHour, maxHour } = this.props;
    this.setState({
      nextAvailableTime: nextAvailableTime(events, minHour, maxHour)
    })
  }

  timesToExclude = (date) => {
    const { events, minHour } = this.props;
    const minTime = lowerBound(date, minHour);
    const dateEvents = new Set(events.get(date.format('YYYY-MM-DD')));
    while (minTime.isBefore(this.state.nextAvailableTime)){
      dateEvents.add(minTime.format());
      minTime.add(1, 'hour');
    }
    return Array.from(dateEvents.values(), value => moment(value));
  }

  render(props: Props, state: State) {
    const {
      minHour,
      maxHour,
      confirmationText,
      onSubmit
    } = props;

    return (
      <Formik
        initialValues={{
          name: '',
          company: '',
          email: '',
          date: state.nextAvailableTime
        }}
        onSubmit={(values: Appointment, { setSubmitting }) => {
          onSubmit(values).then(() => setSubmitting(false));
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required!'),
          company: Yup.string().required('Company is required!'),
          email: Yup.string()
            .email('Invalid email address')
            .required('Email is required!'),
          date: Yup.date()
            .typeError('Must be a valid date')
            .min(
              state.nextAvailableTime,
              'Date must be an available time in the future'
            ).required('Date is required!')
        })}
        render={({
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          errors,
          setFieldValue,
          touched,
          values
        }) => (
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
            <label for="date">
              Date / Time  (GMT{ moment().format('Z') })
            </label>
            <DatePicker
              id="date"
              selected={values.date}
              onChange={dateTime => setFieldValue('date', dateTime)}
              filterDate={isWeekday}
              excludeTimes={this.timesToExclude(values.date)}
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
        )}
      />
    );
  }
}

export default AppointmentForm;
