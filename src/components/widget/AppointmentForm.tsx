import { FormikProps, withFormik } from 'formik';
import moment from 'moment';
import { Component, h } from "preact";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';

import './style.css';

interface FormValues {
  name: string,
  company: string,
  email: string
}

class AppointmentForm extends Component<FormikProps<FormValues>> {

  today = moment();

  render(props: FormikProps<FormValues>) {
    const {
      handleChange,
      handleBlur,
      handleSubmit,
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
          onChange={handleChange}
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
          onChange={handleChange}
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
          onChange={handleChange}
          onBlur={handleBlur}
          />
        {errors.email && touched.email && (
          <div class="input-feedback">{errors.email}</div>
        )}
        <label for="appointment-date">Date / Time</label>
        <DatePicker
          id="appointment-date"
          selected={this.today}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="LLL"
          timeCaption="time"
        />
        <button>Confirm</button>
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
  }),
  mapPropsToValues: props => ({
    email: '',
  }),
  handleSubmit: () => {},
  // handleSubmit: (values: FormValues, { setSubmitting }) => {
  //   const payload = {...values};
  //   setTimeout(() => {
  //     alert(JSON.stringify(payload, null, 2));
  //     setSubmitting(false);
  //   }, 1000);
  // },
  // displayName: 'MyForm'
}

export default withFormik(options)(AppointmentForm);