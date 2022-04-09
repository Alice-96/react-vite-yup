import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Page from './Page';
import { Typography } from '@mui/material';

interface FormikValuesProps {
  firstName: string;
  lastName: string;
}

const YupTrial: React.FC = () => {
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      firstName: Yup.string().required('必須項目です'),
      lastName: Yup.string().required('必須項目です'),
    });
  }, []);

  const formik = useFormik<FormikValuesProps>({
    initialValues: {
      firstName: '',
      lastName: '',
    },
    validationSchema: validationSchema,
    onSubmit: () => {},
  });

  return (
    <Page>
      <Typography component="h2" variant="h6" color="primary">
        Simple Yup
      </Typography>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
        />

        <p style={{ color: 'red', fontSize: '8px' }}>
          {formik.errors.firstName}
        </p>
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
        />

        <p style={{ color: 'red', fontSize: '8px' }}>
          {formik.errors.lastName}
        </p>
      </div>
    </Page>
  );
};

export default YupTrial;
